/**
 * Environment Configuration System
 *
 * This module provides centralized configuration management for the application,
 * including environment variable handling, validation, and feature flags.
 */

// Environment types
export type Environment = "development" | "production" | "test";

// Configuration interface
export interface AppConfig {
  // Environment settings
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;

  // Backend configuration
  backend: {
    url: string;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
    healthCheckInterval: number;
  };

  // Feature flags
  features: {
    backendPdfGeneration: boolean;
    clientSidePdfGeneration: boolean;
    errorReporting: boolean;
    debugMode: boolean;
    healthChecks: boolean;
  };

  // PDF generation settings
  pdf: {
    defaultTimeout: number;
    maxFileSize: number;
    allowedFormats: string[];
    compressionLevel: number;
  };

  // API settings
  api: {
    requestTimeout: number;
    maxConcurrentRequests: number;
    rateLimitPerMinute: number;
  };
}

// Configuration validation errors
export class ConfigurationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

// Environment variable schema with validation
interface EnvSchema {
  // Backend configuration
  NEXT_PUBLIC_BACKEND_URL?: string;
  NEXT_PUBLIC_PDF_TIMEOUT?: string;
  NEXT_PUBLIC_PDF_MAX_RETRIES?: string;
  NEXT_PUBLIC_PDF_RETRY_DELAY?: string;
  NEXT_PUBLIC_HEALTH_CHECK_INTERVAL?: string;

  // Feature flags
  NEXT_PUBLIC_ENABLE_BACKEND_PDF?: string;
  NEXT_PUBLIC_ENABLE_CLIENT_PDF?: string;
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING?: string;
  NEXT_PUBLIC_DEBUG_MODE?: string;
  NEXT_PUBLIC_ENABLE_HEALTH_CHECKS?: string;

  // PDF settings
  NEXT_PUBLIC_PDF_MAX_FILE_SIZE?: string;
  NEXT_PUBLIC_PDF_COMPRESSION_LEVEL?: string;

  // API settings
  NEXT_PUBLIC_API_TIMEOUT?: string;
  NEXT_PUBLIC_API_MAX_CONCURRENT?: string;
  NEXT_PUBLIC_API_RATE_LIMIT?: string;

  // System environment
  NODE_ENV?: string;
  VERCEL_ENV?: string;
}

/**
 * Configuration Manager Class
 */
class ConfigurationManager {
  private config: AppConfig;
  private isInitialized = false;

  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
    this.isInitialized = true;
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfiguration(): AppConfig {
    const env = this.getEnvironmentVariables();
    const environment = this.detectEnvironment(env);

    return {
      // Environment settings
      environment,
      isDevelopment: environment === "development",
      isProduction: environment === "production",
      isTest: environment === "test",

      // Backend configuration
      backend: {
        url: this.getBackendUrl(env, environment),
        timeout: this.parseNumber(env.NEXT_PUBLIC_PDF_TIMEOUT, 30000),
        maxRetries: this.parseNumber(env.NEXT_PUBLIC_PDF_MAX_RETRIES, 3),
        retryDelay: this.parseNumber(env.NEXT_PUBLIC_PDF_RETRY_DELAY, 1000),
        healthCheckInterval: this.parseNumber(
          env.NEXT_PUBLIC_HEALTH_CHECK_INTERVAL,
          60000
        ),
      },

      // Feature flags
      features: {
        backendPdfGeneration: this.parseBoolean(
          env.NEXT_PUBLIC_ENABLE_BACKEND_PDF,
          true
        ),
        clientSidePdfGeneration: this.parseBoolean(
          env.NEXT_PUBLIC_ENABLE_CLIENT_PDF,
          true
        ),
        errorReporting: this.parseBoolean(
          env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
          environment === "production"
        ),
        debugMode: this.parseBoolean(
          env.NEXT_PUBLIC_DEBUG_MODE,
          environment === "development"
        ),
        healthChecks: this.parseBoolean(
          env.NEXT_PUBLIC_ENABLE_HEALTH_CHECKS,
          true
        ),
      },

      // PDF generation settings
      pdf: {
        defaultTimeout: this.parseNumber(env.NEXT_PUBLIC_PDF_TIMEOUT, 30000),
        maxFileSize: this.parseNumber(
          env.NEXT_PUBLIC_PDF_MAX_FILE_SIZE,
          50 * 1024 * 1024
        ), // 50MB
        allowedFormats: ["application/pdf"],
        compressionLevel: this.parseNumber(
          env.NEXT_PUBLIC_PDF_COMPRESSION_LEVEL,
          6
        ),
      },

      // API settings
      api: {
        requestTimeout: this.parseNumber(env.NEXT_PUBLIC_API_TIMEOUT, 30000),
        maxConcurrentRequests: this.parseNumber(
          env.NEXT_PUBLIC_API_MAX_CONCURRENT,
          5
        ),
        rateLimitPerMinute: this.parseNumber(
          env.NEXT_PUBLIC_API_RATE_LIMIT,
          60
        ),
      },
    };
  }

  /**
   * Get environment variables with proper typing
   */
  private getEnvironmentVariables(): EnvSchema {
    if (typeof window !== "undefined") {
      // Client-side: only NEXT_PUBLIC_ variables are available
      return {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_PDF_TIMEOUT: process.env.NEXT_PUBLIC_PDF_TIMEOUT,
        NEXT_PUBLIC_PDF_MAX_RETRIES: process.env.NEXT_PUBLIC_PDF_MAX_RETRIES,
        NEXT_PUBLIC_PDF_RETRY_DELAY: process.env.NEXT_PUBLIC_PDF_RETRY_DELAY,
        NEXT_PUBLIC_HEALTH_CHECK_INTERVAL:
          process.env.NEXT_PUBLIC_HEALTH_CHECK_INTERVAL,
        NEXT_PUBLIC_ENABLE_BACKEND_PDF:
          process.env.NEXT_PUBLIC_ENABLE_BACKEND_PDF,
        NEXT_PUBLIC_ENABLE_CLIENT_PDF:
          process.env.NEXT_PUBLIC_ENABLE_CLIENT_PDF,
        NEXT_PUBLIC_ENABLE_ERROR_REPORTING:
          process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
        NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
        NEXT_PUBLIC_ENABLE_HEALTH_CHECKS:
          process.env.NEXT_PUBLIC_ENABLE_HEALTH_CHECKS,
        NEXT_PUBLIC_PDF_MAX_FILE_SIZE:
          process.env.NEXT_PUBLIC_PDF_MAX_FILE_SIZE,
        NEXT_PUBLIC_PDF_COMPRESSION_LEVEL:
          process.env.NEXT_PUBLIC_PDF_COMPRESSION_LEVEL,
        NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
        NEXT_PUBLIC_API_MAX_CONCURRENT:
          process.env.NEXT_PUBLIC_API_MAX_CONCURRENT,
        NEXT_PUBLIC_API_RATE_LIMIT: process.env.NEXT_PUBLIC_API_RATE_LIMIT,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
      };
    } else {
      // Server-side: all variables are available
      return process.env as EnvSchema;
    }
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(env: EnvSchema): Environment {
    // Check Vercel environment first
    if (env.VERCEL_ENV) {
      switch (env.VERCEL_ENV) {
        case "production":
          return "production";
        case "preview":
        case "development":
          return "development";
        default:
          break;
      }
    }

    // Check NODE_ENV
    switch (env.NODE_ENV) {
      case "production":
        return "production";
      case "test":
        return "test";
      case "development":
      default:
        return "development";
    }
  }

  /**
   * Get backend URL with environment-specific defaults
   */
  private getBackendUrl(env: EnvSchema, environment: Environment): string {
    const envUrl = env.NEXT_PUBLIC_BACKEND_URL;

    if (envUrl) {
      return envUrl.replace(/\/$/, ""); // Remove trailing slash
    }

    // Environment-specific defaults
    switch (environment) {
      case "production":
        throw new ConfigurationError(
          "NEXT_PUBLIC_BACKEND_URL must be set in production environment",
          "NEXT_PUBLIC_BACKEND_URL"
        );
      case "test":
        return "http://localhost:8081"; // Different port for tests
      case "development":
      default:
        return "http://localhost:8080";
    }
  }

  /**
   * Parse string to number with default value
   */
  private parseNumber(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      console.warn(
        `Invalid number value: ${value}, using default: ${defaultValue}`
      );
      return defaultValue;
    }

    return parsed;
  }

  /**
   * Parse string to boolean with default value
   */
  private parseBoolean(
    value: string | undefined,
    defaultValue: boolean
  ): boolean {
    if (!value) return defaultValue;

    const lowerValue = value.toLowerCase();
    if (lowerValue === "true" || lowerValue === "1" || lowerValue === "yes") {
      return true;
    }
    if (lowerValue === "false" || lowerValue === "0" || lowerValue === "no") {
      return false;
    }

    console.warn(
      `Invalid boolean value: ${value}, using default: ${defaultValue}`
    );
    return defaultValue;
  }

  /**
   * Validate configuration values
   */
  private validateConfiguration(): void {
    const errors: string[] = [];

    // Validate backend URL format
    try {
      new URL(this.config.backend.url);
    } catch {
      errors.push(`Invalid backend URL format: ${this.config.backend.url}`);
    }

    // Validate timeout values
    if (this.config.backend.timeout < 1000) {
      errors.push("Backend timeout must be at least 1000ms");
    }

    if (
      this.config.backend.maxRetries < 0 ||
      this.config.backend.maxRetries > 10
    ) {
      errors.push("Max retries must be between 0 and 10");
    }

    if (this.config.backend.retryDelay < 100) {
      errors.push("Retry delay must be at least 100ms");
    }

    // Validate PDF settings
    if (this.config.pdf.maxFileSize < 1024 * 1024) {
      // 1MB minimum
      errors.push("PDF max file size must be at least 1MB");
    }

    if (
      this.config.pdf.compressionLevel < 0 ||
      this.config.pdf.compressionLevel > 9
    ) {
      errors.push("PDF compression level must be between 0 and 9");
    }

    // Validate API settings
    if (
      this.config.api.maxConcurrentRequests < 1 ||
      this.config.api.maxConcurrentRequests > 20
    ) {
      errors.push("Max concurrent requests must be between 1 and 20");
    }

    if (this.config.api.rateLimitPerMinute < 1) {
      errors.push("Rate limit must be at least 1 request per minute");
    }

    // Production-specific validations
    if (this.config.isProduction) {
      if (this.config.backend.url.includes("localhost")) {
        errors.push("Cannot use localhost URL in production environment");
      }

      if (this.config.features.debugMode) {
        console.warn(
          "Debug mode is enabled in production - consider disabling it"
        );
      }
    }

    // Feature flag validations
    if (
      !this.config.features.backendPdfGeneration &&
      !this.config.features.clientSidePdfGeneration
    ) {
      errors.push("At least one PDF generation method must be enabled");
    }

    if (errors.length > 0) {
      throw new ConfigurationError(
        `Configuration validation failed:\n${errors.join("\n")}`
      );
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): AppConfig {
    if (!this.isInitialized) {
      throw new ConfigurationError("Configuration not initialized");
    }
    return { ...this.config };
  }

  /**
   * Get specific configuration section
   */
  public getBackendConfig() {
    return { ...this.config.backend };
  }

  public getFeatureFlags() {
    return { ...this.config.features };
  }

  public getPdfConfig() {
    return { ...this.config.pdf };
  }

  public getApiConfig() {
    return { ...this.config.api };
  }

  /**
   * Check if a feature is enabled
   */
  public isFeatureEnabled(feature: keyof AppConfig["features"]): boolean {
    return this.config.features[feature];
  }

  /**
   * Get environment information
   */
  public getEnvironmentInfo() {
    return {
      environment: this.config.environment,
      isDevelopment: this.config.isDevelopment,
      isProduction: this.config.isProduction,
      isTest: this.config.isTest,
    };
  }

  /**
   * Validate current configuration and return issues
   */
  public validateCurrentConfig(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      this.validateConfiguration();
    } catch (error) {
      if (error instanceof ConfigurationError) {
        errors.push(error.message);
      }
    }

    // Additional runtime validations
    if (this.config.isProduction && this.config.features.debugMode) {
      warnings.push("Debug mode is enabled in production");
    }

    if (this.config.backend.timeout > 60000) {
      warnings.push("Backend timeout is very high (>60s)");
    }

    if (this.config.backend.maxRetries > 5) {
      warnings.push("High retry count may cause long delays");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get configuration summary for debugging
   */
  public getConfigSummary(): Record<string, any> {
    return {
      environment: this.config.environment,
      backendUrl: this.config.backend.url,
      featuresEnabled: Object.entries(this.config.features)
        .filter(([, enabled]) => enabled)
        .map(([feature]) => feature),
      timeouts: {
        backend: this.config.backend.timeout,
        api: this.config.api.requestTimeout,
      },
      limits: {
        maxRetries: this.config.backend.maxRetries,
        maxFileSize: this.config.pdf.maxFileSize,
        rateLimitPerMinute: this.config.api.rateLimitPerMinute,
      },
    };
  }

  /**
   * Reload configuration (useful for testing)
   */
  public reload(): void {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }
}

// Create singleton instance
const configManager = new ConfigurationManager();

// Export configuration instance and utilities
export const config = configManager.getConfig();
export const getConfig = () => configManager.getConfig();
export const getBackendConfig = () => configManager.getBackendConfig();
export const getFeatureFlags = () => configManager.getFeatureFlags();
export const getPdfConfig = () => configManager.getPdfConfig();
export const getApiConfig = () => configManager.getApiConfig();
export const isFeatureEnabled = (feature: keyof AppConfig["features"]) =>
  configManager.isFeatureEnabled(feature);
export const getEnvironmentInfo = () => configManager.getEnvironmentInfo();
export const validateConfig = () => configManager.validateCurrentConfig();
export const getConfigSummary = () => configManager.getConfigSummary();

// Export the configuration manager for advanced usage
export { configManager };

// Default export
export default config;
