/**
 * Consistent logging utilities for server actions
 */

export function logActionError(actionName: string, error: unknown) {
  console.error(`[${actionName}] Error:`, error);
}

export function logActionInfo(actionName: string, message: string) {
  console.log(`[${actionName}] ${message}`);
}

export function logActionWarning(actionName: string, message: string) {
  console.warn(`[${actionName}] ${message}`);
}
