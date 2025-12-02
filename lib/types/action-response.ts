/**
 * Standard response format for all server actions
 * Ensures consistent error handling across the application
 */
export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * For actions that return field-level validation errors
 */
export type ActionFieldErrors = {
  success: boolean;
  errors?: Record<string, string[]>;
};

/**
 * Helper to create success response
 */
export function success<T>(data: T): ActionResponse<T> {
  return { success: true, data };
}

/**
 * Helper to create error response
 */
export function failure<T = never>(error: string): ActionResponse<T> {
  return { success: false, error };
}
