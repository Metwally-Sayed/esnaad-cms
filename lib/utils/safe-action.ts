import type { ActionResponse } from "@/lib/types/action-response";
import { success, failure } from "@/lib/types/action-response";
import { logActionError } from "@/lib/utils/logger";
import type { ZodSchema } from "zod";

/**
 * Wraps server actions with error handling and optional validation
 * Ensures consistent error handling across all actions
 *
 * @example
 * export const getPageById = safeAction(
 *   async (id: string) => {
 *     return prisma.page.findUnique({ where: { id } });
 *   },
 *   { actionName: "getPageById" }
 * );
 */
export function safeAction<TInput, TOutput>(
  fn: (input: TInput) => Promise<TOutput>,
  options?: {
    schema?: ZodSchema<TInput>;
    actionName?: string;
  }
): (input: TInput) => Promise<ActionResponse<TOutput>> {
  return async (input: TInput) => {
    try {
      // Validate input if schema provided
      if (options?.schema) {
        const result = options.schema.safeParse(input);
        if (!result.success) {
          const errorMessage = result.error.message;
          return failure(errorMessage);
        }
      }

      // Execute action
      const data = await fn(input);
      return success(data);
    } catch (error) {
      if (options?.actionName) {
        logActionError(options.actionName, error);
      }
      return failure(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };
}
