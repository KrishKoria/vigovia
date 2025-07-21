/**
 * Enhanced Error Display Component
 *
 * Provides comprehensive error display with user-friendly messages,
 * suggestions, retry options, and fallback recommendations.
 */

import React, { useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import {
  AlertTriangle,
  Wifi,
  Server,
  AlertCircle,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import {
  ErrorInfo,
  ErrorCategory,
  ErrorSeverity,
  ValidationErrorInfo,
  isValidationErrorInfo,
} from "@/lib/errorHandler";

interface ErrorDisplayProps {
  errorInfo: ErrorInfo;
  onRetry?: () => void;
  onFallback?: () => void;
  onDismiss?: () => void;
  showRetryButton?: boolean;
  showFallbackButton?: boolean;
  showDismissButton?: boolean;
  className?: string;
}

export function ErrorDisplay({
  errorInfo,
  onRetry,
  onFallback,
  onDismiss,
  showRetryButton = true,
  showFallbackButton = true,
  showDismissButton = true,
  className = "",
}: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const getErrorIcon = () => {
    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return <Wifi className="h-5 w-5" />;
      case ErrorCategory.SERVER:
        return <Server className="h-5 w-5" />;
      case ErrorCategory.VALIDATION:
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getErrorColor = () => {
    switch (errorInfo.severity) {
      case ErrorSeverity.CRITICAL:
        return "border-red-500 bg-red-50 text-red-800";
      case ErrorSeverity.HIGH:
        return "border-red-400 bg-red-50 text-red-700";
      case ErrorSeverity.MEDIUM:
        return "border-orange-400 bg-orange-50 text-orange-700";
      case ErrorSeverity.LOW:
        return "border-yellow-400 bg-yellow-50 text-yellow-700";
      default:
        return "border-red-400 bg-red-50 text-red-700";
    }
  };

  const getErrorTitle = () => {
    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return "Connection Issue";
      case ErrorCategory.SERVER:
        return "Server Error";
      case ErrorCategory.VALIDATION:
        return "Form Validation Error";
      case ErrorCategory.TIMEOUT:
        return "Request Timeout";
      default:
        return "Error Occurred";
    }
  };

  const handleRetry = async () => {
    if (!onRetry) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Card className={`border-2 shadow-lg ${getErrorColor()} ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">{getErrorIcon()}</div>
            <div>
              <h3 className="font-semibold text-lg">{getErrorTitle()}</h3>
              <p className="text-sm opacity-90 mt-1">{errorInfo.userMessage}</p>
            </div>
          </div>

          {showDismissButton && onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-current hover:bg-current/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Field Errors (for validation errors) */}
        {isValidationErrorInfo(errorInfo) &&
          errorInfo.fieldErrors.length > 0 && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg border border-current/20">
              <h4 className="font-medium text-sm mb-2">
                Please fix these issues:
              </h4>
              <ul className="space-y-1">
                {errorInfo.fieldErrors.map((fieldError, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0" />
                    <span>{fieldError.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Suggestions */}
        {errorInfo.suggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Suggested solutions:</h4>
            <ul className="space-y-1">
              {errorInfo.suggestions.slice(0, 3).map((suggestion, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0 mt-2" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>

            {errorInfo.suggestions.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-current hover:bg-current/10 mt-2 p-0 h-auto"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show more suggestions
                  </>
                )}
              </Button>
            )}

            {showDetails && errorInfo.suggestions.length > 3 && (
              <ul className="space-y-1 mt-2">
                {errorInfo.suggestions.slice(3).map((suggestion, index) => (
                  <li
                    key={index + 3}
                    className="text-sm flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0 mt-2" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {showRetryButton && errorInfo.canRetry && onRetry && (
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              size="sm"
              className="bg-current/10 text-current hover:bg-current/20 border border-current/30"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
          )}

          {showFallbackButton && errorInfo.fallbackAvailable && onFallback && (
            <Button
              onClick={onFallback}
              size="sm"
              variant="outline"
              className="border-current/30 text-current hover:bg-current/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Use Client PDF
            </Button>
          )}
        </div>

        {/* Technical Details (collapsible) */}
        {(errorInfo.technicalDetails || errorInfo.errorCode) && (
          <div className="mt-4 pt-4 border-t border-current/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-current hover:bg-current/10 p-0 h-auto text-xs"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide technical details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show technical details
                </>
              )}
            </Button>

            {showDetails && (
              <div className="mt-2 p-3 bg-white/30 rounded border border-current/20">
                {errorInfo.errorCode && (
                  <div className="text-xs mb-1">
                    <span className="font-medium">Error Code:</span>{" "}
                    {errorInfo.errorCode}
                  </div>
                )}
                {errorInfo.technicalDetails && (
                  <div className="text-xs">
                    <span className="font-medium">Details:</span>{" "}
                    {errorInfo.technicalDetails}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Simplified error display for inline use
 */
interface SimpleErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function SimpleErrorDisplay({
  message,
  onRetry,
  onDismiss,
  className = "",
}: SimpleErrorDisplayProps) {
  return (
    <div
      className={`p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">{message}</span>
        </div>

        <div className="flex items-center gap-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="ghost"
              className="text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}

          {onDismiss && (
            <Button
              onClick={onDismiss}
              size="sm"
              variant="ghost"
              className="text-red-700 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Success message display for consistency
 */
interface SuccessDisplayProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function SuccessDisplay({
  message,
  onDismiss,
  className = "",
}: SuccessDisplayProps) {
  return (
    <div
      className={`p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-xl shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">{message}</span>
        </div>

        {onDismiss && (
          <Button
            onClick={onDismiss}
            size="sm"
            variant="ghost"
            className="text-green-700 hover:bg-green-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
