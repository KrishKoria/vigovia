/**
 * Error Recovery Hook
 *
 * Custom React hook for handling errors with recovery mechanisms,
 * retry logic, and fallback options.
 */

import { useState, useCallback } from "react";
import {
  ErrorHandler,
  ErrorRecovery,
  ErrorInfo,
  handlePdfGenerationError,
  canRetryOperation,
  shouldShowFallback,
} from "@/lib/errorHandler";

interface UseErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: (result: any) => void;
  onFallback?: () => void;
  logErrors?: boolean;
}

interface UseErrorRecoveryReturn {
  error: ErrorInfo | null;
  isLoading: boolean;
  isRetrying: boolean;
  canRetry: boolean;
  canFallback: boolean;
  execute: (operation: () => Promise<any>) => Promise<void>;
  retry: () => Promise<void>;
  fallback: () => void;
  clearError: () => void;
  setError: (error: unknown) => void;
}

export function useErrorRecovery(
  options: UseErrorRecoveryOptions = {}
): UseErrorRecoveryReturn {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onFallback,
    logErrors = true,
  } = options;

  const [error, setErrorState] = useState<ErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastOperation, setLastOperation] = useState<
    (() => Promise<any>) | null
  >(null);

  const setError = useCallback(
    (err: unknown) => {
      const errorInfo = handlePdfGenerationError(err);

      if (logErrors) {
        ErrorHandler.logError(err, "useErrorRecovery");
      }

      setErrorState(errorInfo);
    },
    [logErrors]
  );

  const clearError = useCallback(() => {
    setErrorState(null);
    setLastOperation(null);
  }, []);

  const execute = useCallback(
    async (operation: () => Promise<any>) => {
      setIsLoading(true);
      setErrorState(null);
      setLastOperation(() => operation);

      try {
        const result = await operation();

        if (onSuccess) {
          onSuccess(result);
        }

        setLastOperation(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, setError]
  );

  const retry = useCallback(async () => {
    if (!lastOperation || !error || !canRetryOperation(error)) {
      return;
    }

    setIsRetrying(true);
    setErrorState(null);

    try {
      const recoveryResult = await ErrorRecovery.attemptRecovery(
        error,
        lastOperation
      );

      if (recoveryResult.success) {
        if (onSuccess) {
          onSuccess(recoveryResult.result);
        }
        setLastOperation(null);
      } else if (recoveryResult.error) {
        setErrorState(recoveryResult.error);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsRetrying(false);
    }
  }, [error, lastOperation, onSuccess, setError]);

  const fallback = useCallback(() => {
    if (onFallback) {
      onFallback();
    }
    clearError();
  }, [onFallback, clearError]);

  return {
    error,
    isLoading,
    isRetrying,
    canRetry: error ? canRetryOperation(error) : false,
    canFallback: error ? shouldShowFallback(error) : false,
    execute,
    retry,
    fallback,
    clearError,
    setError,
  };
}

/**
 * Specialized hook for PDF generation with built-in fallback
 */
export function usePdfGenerationWithFallback() {
  const [clientFallbackTriggered, setClientFallbackTriggered] = useState(false);

  const errorRecovery = useErrorRecovery({
    onFallback: () => {
      setClientFallbackTriggered(true);
    },
    logErrors: true,
  });

  const generatePdf = useCallback(
    async (
      backendOperation: () => Promise<any>,
      clientFallback: () => Promise<any>
    ) => {
      if (clientFallbackTriggered) {
        // If fallback was already triggered, use client generation
        try {
          await clientFallback();
          setClientFallbackTriggered(false);
        } catch (err) {
          errorRecovery.setError(err);
        }
      } else {
        // Try backend first
        await errorRecovery.execute(backendOperation);
      }
    },
    [clientFallbackTriggered, errorRecovery]
  );

  const triggerFallback = useCallback(
    async (clientFallback: () => Promise<any>) => {
      try {
        await clientFallback();
        errorRecovery.clearError();
        setClientFallbackTriggered(false);
      } catch (err) {
        errorRecovery.setError(err);
      }
    },
    [errorRecovery]
  );

  return {
    ...errorRecovery,
    generatePdf,
    triggerFallback,
    clientFallbackTriggered,
  };
}

/**
 * Hook for form validation errors with field-specific handling
 */
export function useFormErrorRecovery() {
  const errorRecovery = useErrorRecovery({
    logErrors: true,
  });

  const validateAndExecute = useCallback(
    async (
      validationFn: () => boolean | string[],
      operation: () => Promise<any>
    ) => {
      const validationResult = validationFn();

      if (validationResult === true) {
        await errorRecovery.execute(operation);
      } else {
        // Create validation error
        const fieldErrors = Array.isArray(validationResult)
          ? validationResult.map((msg) => ({ field: "form", message: msg }))
          : [{ field: "form", message: "Validation failed" }];

        const validationError = {
          category: "VALIDATION" as const,
          severity: "MEDIUM" as const,
          message: "Form validation failed",
          userMessage: "Please fix the form errors and try again",
          suggestions: ["Check all required fields", "Verify data formats"],
          canRetry: true,
          fallbackAvailable: false,
          fieldErrors,
        };

        errorRecovery.setError(validationError);
      }
    },
    [errorRecovery]
  );

  return {
    ...errorRecovery,
    validateAndExecute,
  };
}

/**
 * Hook for network operations with connection checking
 */
export function useNetworkErrorRecovery() {
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline" | "checking"
  >("online");

  const checkConnection = useCallback(async () => {
    setConnectionStatus("checking");

    try {
      // Simple connectivity check
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
      });

      setConnectionStatus(response.ok ? "online" : "offline");
      return response.ok;
    } catch {
      setConnectionStatus("offline");
      return false;
    }
  }, []);

  const errorRecovery = useErrorRecovery({
    onSuccess: () => {
      setConnectionStatus("online");
    },
    logErrors: true,
  });

  const executeWithConnectionCheck = useCallback(
    async (operation: () => Promise<any>) => {
      const isOnline = await checkConnection();

      if (!isOnline) {
        errorRecovery.setError(
          new Error(
            "No internet connection. Please check your network and try again."
          )
        );
        return;
      }

      await errorRecovery.execute(operation);
    },
    [checkConnection, errorRecovery]
  );

  return {
    ...errorRecovery,
    connectionStatus,
    checkConnection,
    executeWithConnectionCheck,
  };
}
