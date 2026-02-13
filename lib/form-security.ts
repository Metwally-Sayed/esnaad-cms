/**
 * Form Security Utilities
 * Protection against bots, spam, and injection attacks
 */

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3; // Max 3 submissions per minute per IP

/**
 * Check if IP is rate limited
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  // Reset if window expired
  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  // Increment and check
  record.count++;
  if (record.count > MAX_SUBMISSIONS_PER_WINDOW) {
    return true;
  }

  return false;
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Validate honeypot field (should be empty)
 */
export function validateHoneypot(honeypotValue: string | undefined): boolean {
  return !honeypotValue || honeypotValue.trim() === "";
}

/**
 * Validate form timing (form should take at least 3 seconds to fill)
 */
export function validateFormTiming(
  startTime: number,
  minSeconds: number = 3
): boolean {
  const elapsed = Date.now() - startTime;
  return elapsed >= minSeconds * 1000;
}

/**
 * Generate a simple form token
 */
export function generateFormToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Validate form token (must be valid format and not too old)
 */
export function validateFormToken(
  token: string | undefined,
  maxAgeMinutes: number = 30
): boolean {
  if (!token) return false;

  const parts = token.split("-");
  if (parts.length !== 2) return false;

  try {
    const timestamp = parseInt(parts[0], 36);
    const age = Date.now() - timestamp;
    const maxAge = maxAgeMinutes * 60 * 1000;

    // Token should be valid (not too old, not from future)
    return age >= 0 && age <= maxAge;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input to prevent XSS and injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Remove null bytes
    .replace(/\0/g, "")
    // Escape HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Remove potential script injections
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    // Limit length
    .substring(0, 10000)
    .trim();
}

/**
 * Sanitize all fields in an object
 */
export function sanitizeFields(
  fields: Record<string, unknown>
): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(fields)) {
    // Sanitize key
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 100);

    if (typeof value === "string") {
      sanitized[safeKey] = sanitizeInput(value);
    } else if (typeof value === "number") {
      sanitized[safeKey] = isFinite(value) ? value : 0;
    } else if (typeof value === "boolean") {
      sanitized[safeKey] = value;
    }
    // Skip other types (objects, arrays, etc.)
  }

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check for spam patterns in text
 */
export function hasSpamPatterns(text: string): boolean {
  const spamPatterns = [
    /\[url=/i,
    /\[link=/i,
    /<a\s+href/i,
    /viagra|cialis|casino|lottery|winner|congratulations.*won/i,
    /click\s+here\s+to\s+(claim|verify|confirm)/i,
    /\$\d+,?\d*,?\d*\s*(usd|dollars?|euro)/i,
    /bit\.ly|tinyurl|goo\.gl/i,
    // Excessive URLs
    /(https?:\/\/[^\s]+){3,}/i,
  ];

  return spamPatterns.some((pattern) => pattern.test(text));
}

/**
 * Comprehensive security validation result
 */
export type SecurityValidation = {
  valid: boolean;
  error?: string;
  code?: "RATE_LIMITED" | "BOT_DETECTED" | "INVALID_TOKEN" | "SPAM_DETECTED" | "INVALID_INPUT";
};

/**
 * Perform comprehensive security validation
 */
export function validateFormSubmission(params: {
  ip: string;
  honeypot?: string;
  formToken?: string;
  formStartTime?: number;
  fields: Record<string, unknown>;
}): SecurityValidation {
  const { ip, honeypot, formToken, formStartTime, fields } = params;

  // 1. Rate limiting
  if (isRateLimited(ip)) {
    return {
      valid: false,
      error: "Too many submissions. Please wait a moment and try again.",
      code: "RATE_LIMITED",
    };
  }

  // 2. Honeypot check
  if (!validateHoneypot(honeypot)) {
    return {
      valid: false,
      error: "Invalid submission.",
      code: "BOT_DETECTED",
    };
  }

  // 3. Form token validation
  if (formToken && !validateFormToken(formToken)) {
    return {
      valid: false,
      error: "Form session expired. Please refresh and try again.",
      code: "INVALID_TOKEN",
    };
  }

  // 4. Timing validation (optional)
  if (formStartTime && !validateFormTiming(formStartTime)) {
    return {
      valid: false,
      error: "Invalid submission.",
      code: "BOT_DETECTED",
    };
  }

  // 5. Spam pattern detection
  for (const value of Object.values(fields)) {
    if (typeof value === "string" && hasSpamPatterns(value)) {
      return {
        valid: false,
        error: "Your message was flagged as potential spam. Please remove any links or promotional content.",
        code: "SPAM_DETECTED",
      };
    }
  }

  return { valid: true };
}
