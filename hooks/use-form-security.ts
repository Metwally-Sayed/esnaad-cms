"use client";

import { useEffect, useState } from "react";

/**
 * Generate a simple form token on the client
 */
function generateFormToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Hook for form security features
 * Provides honeypot field, form token, and timing validation
 */
export function useFormSecurity() {
  const [formToken, setFormToken] = useState<string>("");
  const [formStartTime, setFormStartTime] = useState<number>(0);
  const [honeypotValue, setHoneypotValue] = useState<string>("");

  // Initialize on mount
  useEffect(() => {
    setFormToken(generateFormToken());
    setFormStartTime(Date.now());
  }, []);

  // Reset security tokens (call after successful submission)
  const resetSecurity = () => {
    setFormToken(generateFormToken());
    setFormStartTime(Date.now());
    setHoneypotValue("");
  };

  return {
    formToken,
    formStartTime,
    honeypotValue,
    setHoneypotValue,
    resetSecurity,
  };
}

export default useFormSecurity;
