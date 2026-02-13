"use server";

import {
  validateFormSubmission,
  sanitizeFields,
  sanitizeInput,
} from "@/lib/form-security";
import { sendFormSubmissionEmail, type FormSubmissionData } from "@/lib/mail";
import { headers } from "next/headers";

export type FormEmailInput = {
  formType: string;
  formTitle: string;
  fields: Record<string, string | number | boolean>;
  // Security fields
  honeypot?: string;
  formToken?: string;
  formStartTime?: number;
};

export type FormEmailResult = {
  success: boolean;
  message: string;
};

/**
 * Get client IP from headers
 */
async function getClientIP(): Promise<string> {
  const headersList = await headers();

  // Try various headers (in order of reliability)
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    // Get the first IP in the chain
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = headersList.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headersList.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback
  return "unknown";
}

export async function submitFormEmail(
  input: FormEmailInput
): Promise<FormEmailResult> {
  try {
    // Get client IP for rate limiting
    const clientIP = await getClientIP();

    // Security validation
    const securityCheck = validateFormSubmission({
      ip: clientIP,
      honeypot: input.honeypot,
      formToken: input.formToken,
      formStartTime: input.formStartTime,
      fields: input.fields,
    });

    if (!securityCheck.valid) {
      console.warn(
        `Form security check failed: ${securityCheck.code} from IP: ${clientIP}`
      );
      return {
        success: false,
        message: securityCheck.error || "Invalid submission.",
      };
    }

    // Sanitize all input fields
    const sanitizedFields = sanitizeFields(input.fields);
    const sanitizedFormType = sanitizeInput(input.formType).substring(0, 50);
    const sanitizedFormTitle = sanitizeInput(input.formTitle).substring(0, 200);

    // Check if email is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials not configured");
      // Still return success to user but log the error
      // This prevents exposing configuration issues to end users
      return {
        success: true,
        message: "Form submitted successfully",
      };
    }

    const submissionData: FormSubmissionData = {
      formType: sanitizedFormType,
      formTitle: sanitizedFormTitle,
      fields: sanitizedFields,
      submittedAt: new Date().toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Dubai",
      }),
    };

    await sendFormSubmissionEmail(submissionData);

    return {
      success: true,
      message: "Form submitted successfully",
    };
  } catch (error) {
    console.error("Error sending form email:", error);

    // Return a generic error message to the user
    return {
      success: false,
      message: "Failed to submit form. Please try again later.",
    };
  }
}
