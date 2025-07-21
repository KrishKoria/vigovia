# Environment Configuration Guide

This document provides comprehensive information about configuring the application's environment variables and feature flags.

## Table of Contents

- [Overview](#overview)
- [Environment Files](#environment-files)
- [Configuration Categories](#configuration-categories)
- [Environment Detection](#environment-detection)
- [Feature Flags](#feature-flags)
- [Validation and Error Handling](#validation-and-error-handling)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses a centralized configuration system that manages environment variables, feature flags, and runtime settings. Configuration is automatically validated and provides sensible defaults for different environments.

### Key Features

- **Environment-aware defaults**: Different default values for development, production, and test environments
- **Feature flags**: Enable/disable functionality without code changes
- **Validation**: Automatic validation of configuration values with helpful error messages
- **Type safety**: Full TypeScript support for all configuration options
- **Runtime checks**: Health checks and connectivity validation

## Environment Files

### File Priority (highest to lowest)

1. `.env.local` - Local overrides (not committed to git)
2. `.env.development` - Development environment defaults
3. `.env.production` - Production environment defaults
4. `.env` - Global defaults (if present)

### Required Files

- **`.env.example`** - Template with all available options and documentation
- **`.env.development`** - Development-specific defaults (committed to git)

### Optional Files

- **`.env.local`** - Local overrides (add to .gitignore)
- **`.env.production`** - Production-specific defaults

## Configuration Categories

### Backend Configuration

Controls communication with the Go backend API.

```env
# Backend API URL - REQUIRED in production
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Request timeout in milliseconds (default: 30000)
NEXT_PUBLIC_PDF_TIMEOUT=30000

# Maximum retry attempts (default: 3, range: 0-10)
NEXT_PUBLIC_PDF_MAX_RETRIES=3

# Delay between retries in milliseconds (default: 1000)
NEXT_PUBLIC_PDF_RETRY_DELAY=1000

# Health check interval in milliseconds (default: 60000)
NEXT_PUBLIC_HEALTH_CHECK_INTERVAL=60000
```

**Environment-specific defaults:**

- **Development**: `http://localhost:8080`
- **Test**: `http://localhost:8081`
- **Production**: Must be explicitly set (no default)

### Feature Flags

Enable or disable application features without code changes.

```env
# Enable backend PDF generation (default: true)
NEXT_PUBLIC_ENABLE_BACKEND_PDF=true

# Enable client-side PDF generation (default: true)
NEXT_PUBLIC_ENABLE_CLIENT_PDF=true

# Enable error reporting (default: production=true, development=false)
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false

# Enable debug mode (default: development=true, production=false)
NEXT_PUBLIC_DEBUG_MODE=true

# Enable health checks (default: true)
NEXT_PUBLIC_ENABLE_HEALTH_CHECKS=true
```

### PDF Generation Settings

Configure PDF generation behavior and limits.

```env
# Maximum PDF file size in bytes (default: 52428800 = 50MB)
NEXT_PUBLIC_PDF_MAX_FILE_SIZE=52428800

# PDF compression level 0-9 (default: 6)
NEXT_PUBLIC_PDF_COMPRESSION_LEVEL=6
```

### API Settings

Configure API behavior and rate limiting.

```env
# API request timeout in milliseconds (default: 30000)
NEXT_PUBLIC_API_TIMEOUT=30000

# Maximum concurrent requests (default: 5, range: 1-20)
NEXT_PUBLIC_API_MAX_CONCURRENT=5

# Rate limit per minute (default: 60)
NEXT_PUBLIC_API_RATE_LIMIT=60
```

## Environment Detection

The application automatically detects the current environment using the following priority:

1. **Vercel Environment** (`VERCEL_ENV`):

   - `production` → Production
   - `preview` → Development
   - `development` → Development

2. **Node Environment** (`NODE_ENV`):
   - `production` → Production
   - `test` → Test
   - `development` → Development (default)

## Feature Flags

Feature flags allow you to enable or disable functionality without code changes.

### Available Features

| Feature                   | Description              | Default (Dev) | Default (Prod) |
| ------------------------- | ------------------------ | ------------- | -------------- |
| `backendPdfGeneration`    | Enable backend PDF API   | `true`        | `true`         |
| `clientSidePdfGeneration` | Enable client-side PDF   | `true`        | `true`         |
| `errorReporting`          | Enable error reporting   | `false`       | `true`         |
| `debugMode`               | Enable debug logging     | `true`        | `false`        |
| `healthChecks`            | Enable health monitoring | `true`        | `true`         |

### Usage in Code

```typescript
import { isFeatureEnabled } from "@/lib/config";

// Check if a feature is enabled
if (isFeatureEnabled("backendPdfGeneration")) {
  // Use backend PDF generation
}

// Get all feature flags
import { getFeatureFlags } from "@/lib/config";
const features = getFeatureFlags();
```

## Validation and Error Handling

The configuration system automatically validates all settings and provides helpful error messages.

### Validation Rules

- **Backend URL**: Must be a valid URL format
- **Timeouts**: Must be at least 1000ms
- **Retries**: Must be between 0 and 10
- **File sizes**: Must be at least 1MB
- **Compression**: Must be between 0 and 9
- **Concurrent requests**: Must be between 1 and 20

### Production-specific Validations

- Backend URL cannot be localhost
- Debug mode warnings in production
- Required environment variables must be set

### Error Types

```typescript
// Configuration validation error
ConfigurationError: Configuration validation failed:
- Invalid backend URL format: invalid-url
- Backend timeout must be at least 1000ms

// Runtime validation
const validation = validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
  console.warn('Configuration warnings:', validation.warnings);
}
```

## Best Practices

### Development Setup

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Customize values in `.env.local` for your local setup

3. Never commit `.env.local` to version control

### Production Setup

1. Set required environment variables:

   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
   NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
   NEXT_PUBLIC_DEBUG_MODE=false
   ```

2. Validate configuration before deployment:
   ```typescript
   import { validateConfig } from "@/lib/config";
   const result = validateConfig();
   ```

### Security Considerations

- Only use `NEXT_PUBLIC_` prefix for client-side variables
- Never expose sensitive data in client-side environment variables
- Use different backend URLs for different environments
- Enable error reporting only in production

### Performance Optimization

- Set appropriate timeouts based on your backend performance
- Adjust retry counts based on network reliability
- Configure rate limits to prevent API abuse
- Use health checks to monitor backend availability

## Troubleshooting

### Common Issues

#### Backend Connection Failed

**Error**: `Connection refused by server`

**Solutions**:

1. Check if backend server is running
2. Verify `NEXT_PUBLIC_BACKEND_URL` is correct
3. Check network connectivity
4. Verify firewall settings

#### Configuration Validation Failed

**Error**: `Invalid backend URL format`

**Solutions**:

1. Ensure URL includes protocol (`http://` or `https://`)
2. Remove trailing slashes from URLs
3. Check for typos in environment variable names

#### Feature Not Working

**Error**: Feature appears disabled

**Solutions**:

1. Check feature flag: `NEXT_PUBLIC_ENABLE_[FEATURE]=true`
2. Verify environment file is loaded correctly
3. Check browser console for configuration errors

### Debug Configuration

Use the configuration summary to debug issues:

```typescript
import { getConfigSummary } from "@/lib/config";

// Log current configuration
console.log("Current config:", getConfigSummary());

// Check specific values
import { getConfig } from "@/lib/config";
const config = getConfig();
console.log("Backend URL:", config.backend.url);
console.log(
  "Features enabled:",
  Object.entries(config.features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature)
);
```

### Environment Variable Not Loading

1. Ensure variable name starts with `NEXT_PUBLIC_` for client-side access
2. Restart development server after adding new variables
3. Check file naming (`.env.local`, not `.env.local.txt`)
4. Verify file is in project root directory

### Health Check Failures

If health checks are failing:

1. Verify backend server is running
2. Check backend URL configuration
3. Ensure health endpoint exists (`/health`)
4. Check network connectivity
5. Verify CORS settings on backend

## Configuration API Reference

### Main Functions

```typescript
// Get complete configuration
import { getConfig } from "@/lib/config";
const config = getConfig();

// Get specific sections
import {
  getBackendConfig,
  getFeatureFlags,
  getPdfConfig,
  getApiConfig,
} from "@/lib/config";

// Check features
import { isFeatureEnabled } from "@/lib/config";
const isEnabled = isFeatureEnabled("backendPdfGeneration");

// Validate configuration
import { validateConfig } from "@/lib/config";
const validation = validateConfig();

// Get environment info
import { getEnvironmentInfo } from "@/lib/config";
const env = getEnvironmentInfo();

// Debug configuration
import { getConfigSummary } from "@/lib/config";
const summary = getConfigSummary();
```

### Configuration Types

```typescript
interface AppConfig {
  environment: "development" | "production" | "test";
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;

  backend: {
    url: string;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
    healthCheckInterval: number;
  };

  features: {
    backendPdfGeneration: boolean;
    clientSidePdfGeneration: boolean;
    errorReporting: boolean;
    debugMode: boolean;
    healthChecks: boolean;
  };

  pdf: {
    defaultTimeout: number;
    maxFileSize: number;
    allowedFormats: string[];
    compressionLevel: number;
  };

  api: {
    requestTimeout: number;
    maxConcurrentRequests: number;
    rateLimitPerMinute: number;
  };
}
```

## Migration Guide

If you're upgrading from a previous version:

1. **Backup existing environment files**
2. **Copy new `.env.example`** to see new options
3. **Update your `.env.local`** with new variables
4. **Test configuration** using validation functions
5. **Update code** to use new configuration imports

### Breaking Changes

- Environment variables are now centrally managed
- Some default values may have changed
- New validation rules may require configuration updates
- Feature flags replace hardcoded feature toggles

For additional help, check the troubleshooting section or create an issue in the project repository.
