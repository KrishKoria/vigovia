import {
  BackendPdfError,
  NetworkError,
  ValidationError,
  ServerError,
} from "./backendPdfService";

// Error types for categorization
export enum ErrorCategory {
  NETWORK = "NETWORK",
  VALIDATION = "VALIDATION",
  SERVER = "SERVER",
  CLIENT = "CLIENT",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN",
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Structured error information
export interface ErrorInfo {
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  suggestions: string[];
  canRetry: boolean;
  fallbackAvailable: boolean;
  technicalDetails?: string;
  errorCode?: string;
}

export interface FieldError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationErrorInfo extends ErrorInfo {
  fieldErrors: FieldError[];
}

export class ErrorHandler {
  static handleError(error: unknown): ErrorInfo {
    console.error("Processing error:", error);

    if (error instanceof NetworkError) {
      return this.handleNetworkError(error);
    }

    if (error instanceof ValidationError) {
      return this.handleValidationError(error);
    }

    if (error instanceof ServerError) {
      return this.handleServerError(error);
    }

    if (error instanceof BackendPdfError) {
      return this.handleBackendPdfError(error);
    }

    if (error instanceof Error) {
      return this.handleGenericError(error);
    }

    return this.handleUnknownError(error);
  }

  private static handleNetworkError(error: NetworkError): ErrorInfo {
    let userMessage = "Connection failed. ";
    let suggestions: string[] = [];

    if (error.message.includes("timeout")) {
      userMessage = "Request timed out. ";
      suggestions = [
        "Check your internet connection",
        "Try again in a few moments",
        "Use the client-side PDF generation as backup",
        "Contact support if the issue persists",
      ];
    } else if (error.message.includes("Failed to connect")) {
      userMessage = "Cannot connect to the server. ";
      suggestions = [
        "Verify the backend server is running",
        "Check if the server URL is correct",
        "Try the client-side PDF generation instead",
        "Contact your system administrator",
      ];
    } else {
      suggestions = [
        "Check your internet connection",
        "Try refreshing the page",
        "Use the client-side PDF generation",
        "Try again in a few minutes",
      ];
    }

    return {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage: userMessage + "Please try the suggestions below.",
      suggestions,
      canRetry: true,
      fallbackAvailable: true,
      technicalDetails: error.originalError?.message,
      errorCode: error.code,
    };
  }

  private static handleValidationError(
    error: ValidationError
  ): ValidationErrorInfo {
    const fieldErrors = this.extractFieldErrors(error.message);

    let userMessage = "Please check the form data. ";
    const suggestions = [
      "Review all required fields",
      "Check date formats and ranges",
      "Verify email addresses are valid",
      "Ensure phone numbers are in correct format",
      "Make sure all required information is provided",
    ];

    if (fieldErrors.length > 0) {
      userMessage = `Please fix the following issues: ${fieldErrors
        .map((fe) => fe.message)
        .join(", ")}`;
    }

    return {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage,
      suggestions,
      canRetry: true,
      fallbackAvailable: false,
      technicalDetails: `HTTP ${error.statusCode}: ${error.message}`,
      errorCode: error.code,
      fieldErrors,
    };
  }

  private static handleServerError(error: ServerError): ErrorInfo {
    let userMessage = "Server error occurred. ";
    let severity = ErrorSeverity.HIGH;
    let suggestions: string[] = [];

    if (error.statusCode === 500) {
      userMessage = "Internal server error. ";
      suggestions = [
        "Try again in a few minutes",
        "Use the client-side PDF generation",
        "Contact support if the issue continues",
      ];
    } else if (error.statusCode === 503) {
      userMessage = "Service temporarily unavailable. ";
      suggestions = [
        "The server is temporarily down",
        "Try again in a few minutes",
        "Use the client-side PDF generation",
      ];
    } else if (error.statusCode === 502 || error.statusCode === 504) {
      userMessage = "Gateway error. ";
      suggestions = [
        "Server connection issue",
        "Try again shortly",
        "Use the client-side PDF generation",
      ];
    } else {
      suggestions = [
        "Try again later",
        "Use the client-side PDF generation",
        "Contact support if needed",
      ];
    }

    return {
      category: ErrorCategory.SERVER,
      severity,
      message: error.message,
      userMessage: userMessage + "Please try the suggestions below.",
      suggestions,
      canRetry: true,
      fallbackAvailable: true,
      technicalDetails: `HTTP ${error.statusCode}: ${error.message}`,
      errorCode: error.code,
    };
  }

  private static handleBackendPdfError(error: BackendPdfError): ErrorInfo {
    let category = ErrorCategory.CLIENT;
    let severity = ErrorSeverity.MEDIUM;
    let suggestions: string[] = [];

    if (error.code === "MAX_RETRIES_EXCEEDED") {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.HIGH;
      suggestions = [
        "Multiple attempts failed",
        "Check your internet connection",
        "Try the client-side PDF generation",
        "Contact support if this continues",
      ];
    } else if (error.code === "DOWNLOAD_ERROR") {
      category = ErrorCategory.CLIENT;
      suggestions = [
        "PDF generation succeeded but download failed",
        "Check browser permissions for downloads",
        "Try again or refresh the page",
        "Ensure popup blockers aren't interfering",
      ];
    } else {
      suggestions = [
        "Try again in a moment",
        "Use the client-side PDF generation",
        "Contact support if needed",
      ];
    }

    return {
      category,
      severity,
      message: error.message,
      userMessage: error.message,
      suggestions,
      canRetry: error.code !== "DOWNLOAD_ERROR",
      fallbackAvailable: true,
      technicalDetails: error.originalError?.message,
      errorCode: error.code,
    };
  }

  private static handleGenericError(error: Error): ErrorInfo {
    let category = ErrorCategory.CLIENT;
    let suggestions = [
      "Try refreshing the page",
      "Clear browser cache and try again",
      "Use the client-side PDF generation",
      "Contact support if the issue persists",
    ];

    if (error.name === "TypeError") {
      suggestions.unshift("This appears to be a data processing error");
    } else if (error.name === "ReferenceError") {
      suggestions.unshift("This appears to be a code execution error");
    }

    return {
      category,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage:
        "An unexpected error occurred. Please try the suggestions below.",
      suggestions,
      canRetry: true,
      fallbackAvailable: true,
      technicalDetails: `${error.name}: ${error.message}`,
    };
  }

  private static handleUnknownError(error: unknown): ErrorInfo {
    return {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: "Unknown error occurred",
      userMessage:
        "An unexpected error occurred. Please try the suggestions below.",
      suggestions: [
        "Try refreshing the page",
        "Use the client-side PDF generation",
        "Contact support with details of what you were doing",
      ],
      canRetry: true,
      fallbackAvailable: true,
      technicalDetails: String(error),
    };
  }

  private static extractFieldErrors(message: string): FieldError[] {
    const fieldErrors: FieldError[] = [];

    const patterns = [
      { regex: /(\w+)\s+is\s+required/gi, type: "required" },
      { regex: /(\w+)\s+must\s+be\s+a\s+valid\s+email/gi, type: "email" },
      { regex: /(\w+)\s+must\s+be\s+a\s+valid\s+date/gi, type: "date" },
      { regex: /(\w+)\s+must\s+be\s+a\s+number/gi, type: "number" },
      { regex: /(\w+)\s+is\s+too\s+short/gi, type: "minLength" },
      { regex: /(\w+)\s+is\s+too\s+long/gi, type: "maxLength" },
    ];

    patterns.forEach(({ regex, type }) => {
      let match;
      while ((match = regex.exec(message)) !== null) {
        const field = match[1];
        fieldErrors.push({
          field,
          message: this.getFieldErrorMessage(field, type),
        });
      }
    });

    return fieldErrors;
  }

  private static getFieldErrorMessage(field: string, type: string): string {
    const fieldName = this.formatFieldName(field);

    switch (type) {
      case "required":
        return `${fieldName} is required`;
      case "email":
        return `${fieldName} must be a valid email address`;
      case "date":
        return `${fieldName} must be a valid date`;
      case "number":
        return `${fieldName} must be a valid number`;
      case "minLength":
        return `${fieldName} is too short`;
      case "maxLength":
        return `${fieldName} is too long`;
      default:
        return `${fieldName} has an invalid value`;
    }
  }

  private static formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  static getRetryConfig(errorInfo: ErrorInfo): {
    shouldRetry: boolean;
    maxRetries: number;
    retryDelay: number;
  } {
    if (!errorInfo.canRetry) {
      return { shouldRetry: false, maxRetries: 0, retryDelay: 0 };
    }

    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return { shouldRetry: true, maxRetries: 3, retryDelay: 2000 };
      case ErrorCategory.SERVER:
        return { shouldRetry: true, maxRetries: 2, retryDelay: 5000 };
      case ErrorCategory.TIMEOUT:
        return { shouldRetry: true, maxRetries: 2, retryDelay: 3000 };
      default:
        return { shouldRetry: false, maxRetries: 0, retryDelay: 0 };
    }
  }

  static logError(error: unknown, context?: string): void {
    const errorInfo = this.handleError(error);

    console.group(`🚨 Error ${context ? `in ${context}` : ""}`);
    console.error("Category:", errorInfo.category);
    console.error("Severity:", errorInfo.severity);
    console.error("Message:", errorInfo.message);
    console.error("User Message:", errorInfo.userMessage);
    console.error("Can Retry:", errorInfo.canRetry);
    console.error("Fallback Available:", errorInfo.fallbackAvailable);

    if (errorInfo.technicalDetails) {
      console.error("Technical Details:", errorInfo.technicalDetails);
    }

    if (errorInfo.errorCode) {
      console.error("Error Code:", errorInfo.errorCode);
    }

    console.error("Suggestions:", errorInfo.suggestions);
    console.groupEnd();
  }
}

export function isValidationErrorInfo(
  errorInfo: ErrorInfo
): errorInfo is ValidationErrorInfo {
  return (
    errorInfo.category === ErrorCategory.VALIDATION &&
    "fieldErrors" in errorInfo
  );
}

export function handlePdfGenerationError(error: unknown): ErrorInfo {
  return ErrorHandler.handleError(error);
}

export function shouldShowFallback(errorInfo: ErrorInfo): boolean {
  return (
    errorInfo.fallbackAvailable && errorInfo.severity !== ErrorSeverity.LOW
  );
}

export function canRetryOperation(errorInfo: ErrorInfo): boolean {
  return errorInfo.canRetry && errorInfo.category !== ErrorCategory.VALIDATION;
}

export function getErrorDisplayMessage(errorInfo: ErrorInfo): string {
  return errorInfo.userMessage;
}

export function getErrorSuggestions(errorInfo: ErrorInfo): string[] {
  return errorInfo.suggestions;
}

export class ErrorRecovery {
  static async attemptRecovery(
    errorInfo: ErrorInfo,
    retryFunction: () => Promise<any>
  ): Promise<{ success: boolean; result?: any; error?: ErrorInfo }> {
    const retryConfig = ErrorHandler.getRetryConfig(errorInfo);

    if (!retryConfig.shouldRetry) {
      return { success: false, error: errorInfo };
    }

    for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        console.log(`Recovery attempt ${attempt}/${retryConfig.maxRetries}`);

        if (attempt > 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryConfig.retryDelay * attempt)
          );
        }

        const result = await retryFunction();
        console.log(`Recovery successful on attempt ${attempt}`);
        return { success: true, result };
      } catch (error) {
        console.warn(`Recovery attempt ${attempt} failed:`, error);

        const newErrorInfo = ErrorHandler.handleError(error);

        if (newErrorInfo.category === ErrorCategory.VALIDATION) {
          return { success: false, error: newErrorInfo };
        }

        if (attempt === retryConfig.maxRetries) {
          return { success: false, error: newErrorInfo };
        }
      }
    }

    return { success: false, error: errorInfo };
  }

  static getFallbackSuggestions(errorInfo: ErrorInfo): {
    primary: string;
    secondary: string[];
  } {
    if (!errorInfo.fallbackAvailable) {
      return {
        primary: "Please try again later",
        secondary: ["Contact support if the issue persists"],
      };
    }

    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return {
          primary: "Use the client-side PDF generation instead",
          secondary: [
            "Check your internet connection",
            "Try again when connection is stable",
            "Contact support if backend is needed",
          ],
        };
      case ErrorCategory.SERVER:
        return {
          primary: "Use the client-side PDF generation as backup",
          secondary: [
            "Server will be back online soon",
            "Try backend generation again later",
            "Contact support if urgent",
          ],
        };
      default:
        return {
          primary: "Use the client-side PDF generation",
          secondary: [
            "This provides the same functionality",
            "Try backend generation again later",
          ],
        };
    }
  }
}
