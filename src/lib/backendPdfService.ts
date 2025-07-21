/**
 * Backend PDF Service
 *
 * This service handles communication with the Go backend API for PDF generation.
 * It includes proper error handling, environment configuration, response processing,
 * file download functionality, and timeout/retry mechanisms.
 */

import {
  ItineraryRequest,
  APIResponse,
  PDFResponse,
  ErrorResponse,
} from "./types/backend";
import { getBackendConfig, getFeatureFlags, isFeatureEnabled } from "./config";

// Configuration interface
interface BackendConfig {
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

// Error types for better error handling
export class BackendPdfError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = "BackendPdfError";
  }
}

export class NetworkError extends BackendPdfError {
  constructor(message: string, originalError?: Error) {
    super(message, "NETWORK_ERROR", undefined, originalError);
    this.name = "NetworkError";
  }
}

export class ValidationError extends BackendPdfError {
  constructor(message: string, statusCode: number) {
    super(message, "VALIDATION_ERROR", statusCode);
    this.name = "ValidationError";
  }
}

export class ServerError extends BackendPdfError {
  constructor(message: string, statusCode: number) {
    super(message, "SERVER_ERROR", statusCode);
    this.name = "ServerError";
  }
}

/**
 * Backend PDF Service Class
 */
export class BackendPdfService {
  private config: BackendConfig;

  constructor() {
    this.config = this.getConfiguration();
  }

  /**
   * Get backend configuration from centralized config system
   */
  private getConfiguration(): BackendConfig {
    const backendConfig = getBackendConfig();
    return {
      baseUrl: backendConfig.url,
      timeout: backendConfig.timeout,
      maxRetries: backendConfig.maxRetries,
      retryDelay: backendConfig.retryDelay,
    };
  }

  /**
   * Get backend URL from centralized configuration
   */
  public getBackendUrl(): string {
    return getBackendConfig().url;
  }

  /**
   * Check if backend PDF generation is enabled
   */
  public isBackendPdfEnabled(): boolean {
    // Check feature flag first
    if (!isFeatureEnabled("backendPdfGeneration")) {
      return false;
    }

    // In production, also check if we have a valid backend URL
    if (process.env.NODE_ENV === "production") {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl || backendUrl === "https://api.example.com") {
        return false;
      }
    }

    return true;
  }

  /**
   * Main function to generate PDF from backend API
   */
  public async generatePDF(data: ItineraryRequest): Promise<Blob> {
    // Check if backend PDF generation is enabled
    if (!this.isBackendPdfEnabled()) {
      throw new BackendPdfError(
        "Backend PDF generation is disabled. Please enable it in configuration or use client-side generation.",
        "FEATURE_DISABLED"
      );
    }

    // Runtime validation for production environment
    if (process.env.NODE_ENV === "production") {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl || backendUrl === "https://api.example.com") {
        throw new BackendPdfError(
          "NEXT_PUBLIC_BACKEND_URL must be set in production environment",
          "CONFIGURATION_ERROR"
        );
      }
    }
    let lastError: Error | undefined;

    // Retry mechanism
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(
          `PDF generation attempt ${attempt}/${this.config.maxRetries}`
        );

        const blob = await this.attemptPdfGeneration(data);
        console.log("PDF generation successful");
        return blob;
      } catch (error) {
        lastError = error as Error;
        console.warn(`PDF generation attempt ${attempt} failed:`, error);

        // Don't retry for validation errors or client errors
        if (
          error instanceof ValidationError ||
          (error instanceof BackendPdfError &&
            error.statusCode &&
            error.statusCode < 500)
        ) {
          throw error;
        }

        // Wait before retrying (except on last attempt)
        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    // All retries failed
    throw new BackendPdfError(
      `PDF generation failed after ${
        this.config.maxRetries
      } attempts. Last error: ${lastError?.message || "Unknown error"}`,
      "MAX_RETRIES_EXCEEDED",
      undefined,
      lastError
    );
  }

  /**
   * Single attempt at PDF generation with enhanced network failure handling
   */
  private async attemptPdfGeneration(data: ItineraryRequest): Promise<Blob> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const url = `${this.config.baseUrl}/api/v1/generate-pdf`;

      console.log("Sending PDF generation request to:", url);

      // Pre-flight connection check
      await this.checkNetworkConnectivity();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf, application/json",
          "User-Agent": "ItineraryApp/1.0",
          "X-Request-ID": this.generateRequestId(),
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return await this.handleApiResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new NetworkError(
            `Request timeout after ${this.config.timeout}ms. The server may be overloaded or your connection is slow.`,
            error
          );
        }

        // Enhanced network error detection
        if (this.isNetworkError(error)) {
          throw new NetworkError(this.getNetworkErrorMessage(error), error);
        }

        // DNS resolution errors
        if (error.message.includes("getaddrinfo ENOTFOUND")) {
          throw new NetworkError(
            `Cannot resolve server address: ${this.config.baseUrl}. Please check the server URL and your internet connection.`,
            error
          );
        }

        // Connection refused errors
        if (error.message.includes("ECONNREFUSED")) {
          throw new NetworkError(
            `Connection refused by server at ${this.config.baseUrl}. The server may be down or the port may be blocked.`,
            error
          );
        }

        // SSL/TLS errors
        if (
          error.message.includes("certificate") ||
          error.message.includes("SSL")
        ) {
          throw new NetworkError(
            `SSL/TLS connection error. Please check if the server certificate is valid.`,
            error
          );
        }
      }

      throw error;
    }
  }

  /**
   * Check network connectivity before making requests
   */
  private async checkNetworkConnectivity(): Promise<void> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new NetworkError(
        "No internet connection detected. Please check your network connection."
      );
    }

    // Additional connectivity check for more reliable detection
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(`${this.config.baseUrl}/health`, {
        method: "HEAD",
        signal: controller.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);
    } catch (error) {
      // If health check fails, we'll still try the main request
      // but log the connectivity issue
      console.warn("Connectivity pre-check failed:", error);
    }
  }

  /**
   * Detect if error is network-related
   */
  private isNetworkError(error: Error): boolean {
    const networkErrorPatterns = [
      "fetch",
      "network",
      "connection",
      "timeout",
      "ECONNRESET",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ERR_NETWORK",
      "ERR_INTERNET_DISCONNECTED",
    ];

    return networkErrorPatterns.some((pattern) =>
      error.message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Get user-friendly network error message
   */
  private getNetworkErrorMessage(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes("timeout")) {
      return `Connection timed out. The server is taking too long to respond. Please try again or use the client-side PDF generation.`;
    }

    if (message.includes("connection") || message.includes("fetch")) {
      return `Failed to connect to the server at ${this.config.baseUrl}. Please check your internet connection and verify the server is running.`;
    }

    if (message.includes("network")) {
      return `Network error occurred. Please check your internet connection and try again.`;
    }

    return `Connection failed: ${error.message}. Please check your network connection and try the client-side PDF generation as an alternative.`;
  }

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle API response and convert to blob
   */
  private async handleApiResponse(response: Response): Promise<Blob> {
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      await this.handleErrorResponse(response, contentType);
    }

    // Check if response is PDF
    if (contentType.includes("application/pdf")) {
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new ServerError("Received empty PDF file", response.status);
      }

      console.log(`PDF blob received, size: ${blob.size} bytes`);
      return blob;
    }

    // Check if response is JSON (success response with file info)
    if (contentType.includes("application/json")) {
      const jsonResponse: APIResponse<PDFResponse> = await response.json();

      if (jsonResponse.success && jsonResponse.data) {
        // Backend returned success with file info, but we need the actual file
        // This might happen if backend returns file info instead of direct blob
        throw new ServerError(
          "Backend returned file info instead of PDF blob. This might be a backend configuration issue.",
          response.status
        );
      }
    }

    throw new ServerError(
      `Unexpected response content type: ${contentType}`,
      response.status
    );
  }

  /**
   * Handle error responses from the API with enhanced error parsing
   */
  private async handleErrorResponse(
    response: Response,
    contentType: string
  ): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let fieldErrors: Array<{ field: string; message: string }> = [];

    try {
      if (contentType.includes("application/json")) {
        const errorData: ErrorResponse | APIResponse = await response.json();

        if ("error" in errorData) {
          errorMessage = errorData.message || errorData.error;
        } else if ("errors" in errorData && errorData.errors) {
          // Handle array of errors
          const errors = errorData.errors;
          errorMessage = errors.map((e) => e.message).join(", ");

          // Extract field-specific errors
          fieldErrors = errors
            .filter((e) => e.field)
            .map((e) => ({ field: e.field!, message: e.message }));
        } else if ("message" in errorData) {
          errorMessage = errorData.message;
        }

        // Handle validation errors with field details
        if (response.status === 422 && fieldErrors.length > 0) {
          const fieldErrorMessage = fieldErrors
            .map((fe) => `${fe.field}: ${fe.message}`)
            .join("; ");
          errorMessage = `Validation failed: ${fieldErrorMessage}`;
        }
      } else {
        const textError = await response.text();
        if (textError) {
          errorMessage = textError;
        }
      }
    } catch (parseError) {
      console.warn("Failed to parse error response:", parseError);
      // Fallback to status-based error messages
      errorMessage = this.getStatusBasedErrorMessage(response.status);
    }

    // Enhanced error categorization
    if (response.status >= 400 && response.status < 500) {
      // Client errors (validation, authentication, etc.)
      if (response.status === 422) {
        throw new ValidationError(
          `Form validation failed: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 400) {
        throw new ValidationError(
          `Invalid request data: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 401) {
        throw new ValidationError(
          `Authentication required: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 403) {
        throw new ValidationError(
          `Access denied: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 404) {
        throw new NetworkError(
          `Service not found. Please check if the backend URL is correct: ${errorMessage}`
        );
      } else if (response.status === 429) {
        throw new ServerError(
          `Too many requests. Please wait a moment and try again: ${errorMessage}`,
          response.status
        );
      } else {
        throw new ValidationError(errorMessage, response.status);
      }
    } else {
      // Server errors (5xx)
      if (response.status === 500) {
        throw new ServerError(
          `Internal server error. The backend encountered an issue: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 502) {
        throw new ServerError(
          `Bad gateway. The backend server is not responding properly: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 503) {
        throw new ServerError(
          `Service unavailable. The backend is temporarily down: ${errorMessage}`,
          response.status
        );
      } else if (response.status === 504) {
        throw new ServerError(
          `Gateway timeout. The backend took too long to respond: ${errorMessage}`,
          response.status
        );
      } else {
        throw new ServerError(errorMessage, response.status);
      }
    }
  }

  /**
   * Get user-friendly error message based on HTTP status code
   */
  private getStatusBasedErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return "The request data is invalid or malformed";
      case 401:
        return "Authentication is required to access this service";
      case 403:
        return "You don't have permission to access this service";
      case 404:
        return "The PDF generation service was not found";
      case 422:
        return "The form data failed validation";
      case 429:
        return "Too many requests. Please wait before trying again";
      case 500:
        return "The server encountered an internal error";
      case 502:
        return "The server gateway is not responding properly";
      case 503:
        return "The service is temporarily unavailable";
      case 504:
        return "The server took too long to respond";
      default:
        return `Server returned status ${status}`;
    }
  }

  /**
   * Download PDF blob as file with proper naming
   */
  public downloadPdf(blob: Blob, filename?: string): void {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename || this.generateDefaultFilename();

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(url);

      console.log(`PDF downloaded as: ${link.download}`);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      throw new BackendPdfError(
        "Failed to download PDF file",
        "DOWNLOAD_ERROR",
        undefined,
        error as Error
      );
    }
  }

  /**
   * Generate default filename for PDF
   */
  private generateDefaultFilename(): string {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, "-");
    return `itinerary-${timestamp}.pdf`;
  }

  /**
   * Generate filename based on trip data
   */
  public generateFilename(tripData?: {
    destination?: string;
    customerName?: string;
    startDate?: string;
  }): string {
    if (!tripData) {
      return this.generateDefaultFilename();
    }

    const parts: string[] = [];

    if (tripData.destination) {
      parts.push(tripData.destination.replace(/[^a-zA-Z0-9]/g, "-"));
    }

    if (tripData.customerName) {
      parts.push(tripData.customerName.replace(/[^a-zA-Z0-9]/g, "-"));
    }

    if (tripData.startDate) {
      const date = new Date(tripData.startDate);
      if (!isNaN(date.getTime())) {
        parts.push(date.toISOString().slice(0, 10));
      }
    }

    const filename = parts.length > 0 ? parts.join("-") : "itinerary";
    return `${filename}.pdf`;
  }

  /**
   * Utility function to add delay for retry mechanism
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if backend is available with detailed health information
   */
  public async checkBackendHealth(): Promise<{
    isHealthy: boolean;
    responseTime?: number;
    error?: string;
    version?: string;
  }> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check

      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        try {
          const healthData = await response.json();
          return {
            isHealthy: true,
            responseTime,
            version: healthData.version,
          };
        } catch {
          // Health endpoint doesn't return JSON, but it's still healthy
          return {
            isHealthy: true,
            responseTime,
          };
        }
      } else {
        return {
          isHealthy: false,
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            isHealthy: false,
            responseTime,
            error: "Health check timed out after 5 seconds",
          };
        }

        return {
          isHealthy: false,
          responseTime,
          error: error.message,
        };
      }

      return {
        isHealthy: false,
        responseTime,
        error: "Unknown error during health check",
      };
    }
  }

  /**
   * Validate backend connection and configuration
   */
  public async validateConnection(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check URL format
    try {
      new URL(this.config.baseUrl);
    } catch {
      issues.push("Backend URL is not a valid URL format");
      recommendations.push(
        "Check the NEXT_PUBLIC_BACKEND_URL environment variable"
      );
    }

    // Check if URL is localhost in production
    if (
      process.env.NODE_ENV === "production" &&
      this.config.baseUrl.includes("localhost")
    ) {
      issues.push("Using localhost URL in production environment");
      recommendations.push("Set a proper production backend URL");
    }

    // Check backend health
    const healthCheck = await this.checkBackendHealth();
    if (!healthCheck.isHealthy) {
      issues.push(`Backend is not responding: ${healthCheck.error}`);
      recommendations.push("Ensure the backend server is running");
      recommendations.push("Check network connectivity");
      recommendations.push("Verify the backend URL is correct");
    } else if (healthCheck.responseTime && healthCheck.responseTime > 3000) {
      issues.push("Backend is responding slowly");
      recommendations.push("Check backend server performance");
      recommendations.push("Consider increasing timeout values");
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
    };
  }

  /**
   * Get service configuration for debugging
   */
  public getConfig(): BackendConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const backendPdfService = new BackendPdfService();

// Export convenience function for direct use
export async function generatePDF(data: ItineraryRequest): Promise<Blob> {
  return backendPdfService.generatePDF(data);
}

// Export feature check function
export function isBackendPdfEnabled(): boolean {
  return backendPdfService.isBackendPdfEnabled();
}

// Export download function for direct use
export function downloadPdf(blob: Blob, filename?: string): void {
  backendPdfService.downloadPdf(blob, filename);
}

// Export filename generation function
export function generateFilename(tripData?: {
  destination?: string;
  customerName?: string;
  startDate?: string;
}): string {
  return backendPdfService.generateFilename(tripData);
}
