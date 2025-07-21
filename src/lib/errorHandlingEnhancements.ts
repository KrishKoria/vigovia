/**
 * Enhanced Error Handling Utilities
 *
 * Additional error handling enhancements for comprehensive error management,
 * including advanced retry mechanisms, error analytics, and user guidance.
 */

import {
  ErrorInfo,
  ErrorCategory,
  ErrorSeverity,
  ErrorHandler,
} from "./errorHandler";
import { ValidationResult, validateItineraryForm } from "./formValidation";
import { ItineraryFormData } from "./schema";

// Enhanced error context for better debugging
export interface ErrorContext {
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  formData?: Partial<ItineraryFormData>;
  previousErrors?: ErrorInfo[];
  networkStatus: "online" | "offline" | "slow";
  retryAttempt: number;
}

// Error analytics for monitoring
export interface ErrorAnalytics {
  errorId: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  frequency: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  affectedUsers: number;
  resolutionRate: number;
  averageRetryCount: number;
}

/**
 * Enhanced Error Handler with advanced features
 */
export class EnhancedErrorHandler extends ErrorHandler {
  private static errorHistory: Map<string, ErrorAnalytics> = new Map();
  private static maxHistorySize = 100;

  /**
   * Handle error with enhanced context and analytics
   */
  static handleErrorWithContext(
    error: unknown,
    context: Partial<ErrorContext> = {}
  ): ErrorInfo & { context: ErrorContext } {
    const errorInfo = this.handleError(error);

    const fullContext: ErrorContext = {
      timestamp: new Date(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      url: typeof window !== "undefined" ? window.location.href : "Unknown",
      networkStatus: this.detectNetworkStatus(),
      retryAttempt: 0,
      ...context,
    };

    // Track error analytics
    this.trackErrorAnalytics(errorInfo, fullContext);

    // Enhanced logging with context
    this.logErrorWithContext(errorInfo, fullContext);

    return {
      ...errorInfo,
      context: fullContext,
    };
  }

  /**
   * Detect network status
   */
  private static detectNetworkStatus(): "online" | "offline" | "slow" {
    if (typeof navigator === "undefined") return "online";

    if (!navigator.onLine) return "offline";

    // Check connection speed if available
    const connection = (navigator as any).connection;
    if (connection) {
      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        return "slow";
      }
    }

    return "online";
  }

  /**
   * Track error analytics
   */
  private static trackErrorAnalytics(
    errorInfo: ErrorInfo,
    context: ErrorContext
  ) {
    const errorKey = `${errorInfo.category}-${errorInfo.message}`;
    const existing = this.errorHistory.get(errorKey);

    if (existing) {
      existing.frequency++;
      existing.lastOccurrence = context.timestamp;
      existing.averageRetryCount =
        (existing.averageRetryCount + context.retryAttempt) / 2;
    } else {
      this.errorHistory.set(errorKey, {
        errorId: this.generateErrorId(),
        category: errorInfo.category,
        severity: errorInfo.severity,
        frequency: 1,
        firstOccurrence: context.timestamp,
        lastOccurrence: context.timestamp,
        affectedUsers: 1,
        resolutionRate: 0,
        averageRetryCount: context.retryAttempt,
      });

      // Maintain history size limit
      if (this.errorHistory.size > this.maxHistorySize) {
        const oldestKey = this.errorHistory.keys().next().value ?? "";
        this.errorHistory.delete(oldestKey);
      }
    }
  }

  /**
   * Generate unique error ID
   */
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Enhanced error logging with context
   */
  private static logErrorWithContext(
    errorInfo: ErrorInfo,
    context: ErrorContext
  ) {
    console.group(`🚨 Enhanced Error Report`);
    console.error("Error Info:", errorInfo);
    console.error("Context:", context);
    console.error("Network Status:", context.networkStatus);
    console.error("Retry Attempt:", context.retryAttempt);

    if (context.formData) {
      console.error(
        "Form Data (sanitized):",
        this.sanitizeFormData(context.formData)
      );
    }

    console.groupEnd();

    // Send to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoringService(errorInfo, context);
    }
  }

  /**
   * Sanitize form data for logging (remove sensitive information)
   */
  private static sanitizeFormData(formData: Partial<ItineraryFormData>) {
    const sanitized = { ...formData };

    // Remove or mask sensitive fields
    if (sanitized.customerEmail) {
      sanitized.customerEmail = sanitized.customerEmail.replace(
        /(.{2}).*@/,
        "$1***@"
      );
    }

    if (sanitized.customerPhone) {
      sanitized.customerPhone = sanitized.customerPhone.replace(
        /(\d{3}).*(\d{3})/,
        "$1***$2"
      );
    }

    return sanitized;
  }

  /**
   * Send error to monitoring service
   */
  private static sendToMonitoringService(
    errorInfo: ErrorInfo,
    context: ErrorContext
  ) {
    // Implementation would depend on your monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
    console.log("Would send to monitoring service:", { errorInfo, context });
  }

  /**
   * Get error analytics summary
   */
  static getErrorAnalytics(): ErrorAnalytics[] {
    return Array.from(this.errorHistory.values());
  }

  /**
   * Get most frequent errors
   */
  static getMostFrequentErrors(limit = 5): ErrorAnalytics[] {
    return Array.from(this.errorHistory.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }
}

/**
 * Advanced retry mechanism with exponential backoff and jitter
 */
export class AdvancedRetryMechanism {
  /**
   * Retry with exponential backoff and jitter
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      backoffFactor?: number;
      jitter?: boolean;
      shouldRetry?: (error: any, attempt: number) => boolean;
      onRetry?: (error: any, attempt: number) => void;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 30000,
      backoffFactor = 2,
      jitter = true,
      shouldRetry = () => true,
      onRetry,
    } = options;

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on the last attempt
        if (attempt > maxRetries) {
          break;
        }

        // Check if we should retry this error
        if (!shouldRetry(error, attempt)) {
          break;
        }

        // Calculate delay with exponential backoff
        let delay = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt - 1),
          maxDelay
        );

        // Add jitter to prevent thundering herd
        if (jitter) {
          delay = delay * (0.5 + Math.random() * 0.5);
        }

        console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);

        if (onRetry) {
          onRetry(error, attempt);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Determine if error should be retried
   */
  static shouldRetryError(error: any): boolean {
    // Don't retry validation errors
    if (error?.name === "ValidationError" || error?.statusCode === 422) {
      return false;
    }

    // Don't retry client errors (4xx except 408, 429)
    if (error?.statusCode >= 400 && error?.statusCode < 500) {
      return error?.statusCode === 408 || error?.statusCode === 429;
    }

    // Retry network errors and server errors
    return true;
  }
}

/**
 * User guidance system for error resolution
 */
export class UserGuidanceSystem {
  /**
   * Get step-by-step guidance for error resolution
   */
  static getResolutionSteps(errorInfo: ErrorInfo): {
    title: string;
    steps: Array<{
      step: number;
      instruction: string;
      action?: "retry" | "fallback" | "contact" | "check";
      details?: string;
    }>;
    estimatedTime: string;
  } {
    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return {
          title: "Resolving Connection Issues",
          steps: [
            {
              step: 1,
              instruction: "Check your internet connection",
              action: "check",
              details:
                "Ensure you're connected to the internet and the connection is stable",
            },
            {
              step: 2,
              instruction: "Try refreshing the page",
              action: "retry",
              details:
                "Sometimes a simple refresh can resolve temporary connection issues",
            },
            {
              step: 3,
              instruction: "Use the client-side PDF generation",
              action: "fallback",
              details:
                "This works offline and doesn't require a server connection",
            },
            {
              step: 4,
              instruction: "Contact support if the issue persists",
              action: "contact",
              details: "Our team can help diagnose server connectivity issues",
            },
          ],
          estimatedTime: "2-5 minutes",
        };

      case ErrorCategory.VALIDATION:
        return {
          title: "Fixing Form Validation Issues",
          steps: [
            {
              step: 1,
              instruction: "Review all required fields marked in red",
              action: "check",
              details: "Make sure all mandatory information is provided",
            },
            {
              step: 2,
              instruction: "Check date formats and ranges",
              action: "check",
              details:
                "Ensure dates are valid and end date is after start date",
            },
            {
              step: 3,
              instruction: "Verify email and phone number formats",
              action: "check",
              details:
                "Use valid email format (user@domain.com) and complete phone numbers",
            },
            {
              step: 4,
              instruction: "Try generating the PDF again",
              action: "retry",
              details:
                "Once all validation issues are fixed, the generation should work",
            },
          ],
          estimatedTime: "1-3 minutes",
        };

      case ErrorCategory.SERVER:
        return {
          title: "Resolving Server Issues",
          steps: [
            {
              step: 1,
              instruction: "Wait a moment and try again",
              action: "retry",
              details: "Server issues are often temporary and resolve quickly",
            },
            {
              step: 2,
              instruction: "Use the client-side PDF generation",
              action: "fallback",
              details: "This bypasses the server and works independently",
            },
            {
              step: 3,
              instruction: "Check if the issue is widespread",
              action: "check",
              details:
                "Try other features to see if the entire service is affected",
            },
            {
              step: 4,
              instruction: "Contact support for urgent issues",
              action: "contact",
              details: "Report server issues so our team can investigate",
            },
          ],
          estimatedTime: "3-10 minutes",
        };

      default:
        return {
          title: "General Error Resolution",
          steps: [
            {
              step: 1,
              instruction: "Try the operation again",
              action: "retry",
              details: "Many errors are temporary and resolve on retry",
            },
            {
              step: 2,
              instruction: "Use alternative methods if available",
              action: "fallback",
              details: "Try the client-side PDF generation as an alternative",
            },
            {
              step: 3,
              instruction: "Contact support with error details",
              action: "contact",
              details:
                "Provide the error message and what you were trying to do",
            },
          ],
          estimatedTime: "2-5 minutes",
        };
    }
  }

  /**
   * Get contextual help based on user's current state
   */
  static getContextualHelp(
    errorInfo: ErrorInfo,
    formData?: Partial<ItineraryFormData>
  ): {
    quickFix?: string;
    preventionTips: string[];
    relatedHelp: string[];
  } {
    const help = {
      preventionTips: [] as string[],
      relatedHelp: [] as string[],
    };

    // Add quick fix if available
    let quickFix: string | undefined;

    if (errorInfo.category === ErrorCategory.VALIDATION && formData) {
      const validation = validateItineraryForm(formData as ItineraryFormData);
      const firstError = validation.errors.find((e) => e.severity === "error");

      if (firstError) {
        quickFix = `Fix the ${firstError.field}: ${firstError.message}`;
      }
    } else if (errorInfo.category === ErrorCategory.NETWORK) {
      quickFix = "Try the client-side PDF generation button instead";
    }

    // Add prevention tips
    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        help.preventionTips = [
          "Ensure stable internet connection before starting",
          "Save form data frequently to avoid losing progress",
          "Use client-side generation for offline work",
        ];
        break;
      case ErrorCategory.VALIDATION:
        help.preventionTips = [
          "Fill out all required fields before submitting",
          "Double-check date formats and ranges",
          "Use valid email and phone number formats",
        ];
        break;
      case ErrorCategory.SERVER:
        help.preventionTips = [
          "Try operations during off-peak hours",
          "Keep form data simple to reduce processing load",
          "Use client-side generation as backup",
        ];
        break;
    }

    // Add related help topics
    help.relatedHelp = [
      "How to use client-side PDF generation",
      "Form validation requirements",
      "Troubleshooting connection issues",
      "Contacting support",
    ];

    return { quickFix, ...help };
  }
}

/**
 * Error recovery coordinator
 */
export class ErrorRecoveryCoordinator {
  private static recoveryHistory: Map<string, number> = new Map();

  /**
   * Coordinate recovery attempt with intelligent decision making
   */
  static async coordinateRecovery<T>(
    errorInfo: ErrorInfo,
    operations: {
      primary: () => Promise<T>;
      fallback?: () => Promise<T>;
      validation?: () => ValidationResult;
    },
    context: Partial<ErrorContext> = {}
  ): Promise<{
    success: boolean;
    result?: T;
    method: "primary" | "fallback" | "validation";
    error?: ErrorInfo;
  }> {
    const errorKey = `${errorInfo.category}-${errorInfo.message}`;
    const previousAttempts = this.recoveryHistory.get(errorKey) || 0;

    // Update recovery history
    this.recoveryHistory.set(errorKey, previousAttempts + 1);

    // If validation is needed and available, try that first
    if (
      operations.validation &&
      errorInfo.category === ErrorCategory.VALIDATION
    ) {
      const validationResult = operations.validation();
      if (!validationResult.isValid) {
        return {
          success: false,
          method: "validation",
          error: {
            ...errorInfo,
            userMessage: `Please fix validation errors: ${validationResult.summary}`,
          },
        };
      }
    }

    // Decide recovery strategy based on error history and type
    const shouldUseFallback = this.shouldUseFallback(
      errorInfo,
      previousAttempts
    );

    if (shouldUseFallback && operations.fallback) {
      try {
        const result = await operations.fallback();
        return { success: true, result, method: "fallback" };
      } catch (fallbackError) {
        const fallbackErrorInfo =
          EnhancedErrorHandler.handleError(fallbackError);
        return { success: false, method: "fallback", error: fallbackErrorInfo };
      }
    }

    // Try primary operation with retry
    try {
      const result = await AdvancedRetryMechanism.retryWithBackoff(
        operations.primary,
        {
          maxRetries: this.getRetryCount(errorInfo, previousAttempts),
          shouldRetry: AdvancedRetryMechanism.shouldRetryError,
          onRetry: (error, attempt) => {
            console.log(`Recovery attempt ${attempt} for ${errorKey}`);
          },
        }
      );

      return { success: true, result, method: "primary" };
    } catch (retryError) {
      const retryErrorInfo = EnhancedErrorHandler.handleError(retryError);

      // If primary failed and fallback is available, try fallback
      if (operations.fallback) {
        try {
          const result = await operations.fallback();
          return { success: true, result, method: "fallback" };
        } catch (fallbackError) {
          const fallbackErrorInfo =
            EnhancedErrorHandler.handleError(fallbackError);
          return {
            success: false,
            method: "fallback",
            error: fallbackErrorInfo,
          };
        }
      }

      return { success: false, method: "primary", error: retryErrorInfo };
    }
  }

  /**
   * Determine if fallback should be used
   */
  private static shouldUseFallback(
    errorInfo: ErrorInfo,
    previousAttempts: number
  ): boolean {
    // Use fallback immediately for certain error types
    if (errorInfo.category === ErrorCategory.NETWORK && previousAttempts > 1) {
      return true;
    }

    if (errorInfo.severity === ErrorSeverity.CRITICAL) {
      return true;
    }

    // Use fallback after multiple failed attempts
    return previousAttempts > 2;
  }

  /**
   * Get retry count based on error type and history
   */
  private static getRetryCount(
    errorInfo: ErrorInfo,
    previousAttempts: number
  ): number {
    // Reduce retries for repeated errors
    const baseRetries = errorInfo.category === ErrorCategory.NETWORK ? 3 : 2;
    return Math.max(1, baseRetries - Math.floor(previousAttempts / 2));
  }

  /**
   * Clear recovery history (useful for testing or reset)
   */
  static clearRecoveryHistory(): void {
    this.recoveryHistory.clear();
  }

  /**
   * Get recovery statistics
   */
  static getRecoveryStats(): Array<{ error: string; attempts: number }> {
    return Array.from(this.recoveryHistory.entries()).map(
      ([error, attempts]) => ({
        error,
        attempts,
      })
    );
  }
}

// Export convenience functions
export function handleErrorWithContext(
  error: unknown,
  context?: Partial<ErrorContext>
) {
  return EnhancedErrorHandler.handleErrorWithContext(error, context);
}

export function getResolutionSteps(errorInfo: ErrorInfo) {
  return UserGuidanceSystem.getResolutionSteps(errorInfo);
}

export function getContextualHelp(
  errorInfo: ErrorInfo,
  formData?: Partial<ItineraryFormData>
) {
  return UserGuidanceSystem.getContextualHelp(errorInfo, formData);
}

export function coordinateRecovery<T>(
  errorInfo: ErrorInfo,
  operations: {
    primary: () => Promise<T>;
    fallback?: () => Promise<T>;
    validation?: () => ValidationResult;
  },
  context?: Partial<ErrorContext>
) {
  return ErrorRecoveryCoordinator.coordinateRecovery(
    errorInfo,
    operations,
    context
  );
}
