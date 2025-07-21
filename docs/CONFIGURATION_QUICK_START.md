# Configuration Quick Start Guide

This guide helps you quickly set up and configure the application environment.

## Quick Setup

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Basic Configuration

Edit `.env.local` with your settings:

```env
# Required in production
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Optional - adjust as needed
NEXT_PUBLIC_PDF_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_BACKEND_PDF=true
NEXT_PUBLIC_DEBUG_MODE=true
```

### 3. Validate Configuration

```bash
npm run validate-config
```

## Environment-Specific Setup

### Development

Default configuration works out of the box:

- Backend URL: `http://localhost:8080`
- Debug mode: Enabled
- All features: Enabled

### Production

Required environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-api.com
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
```

### Testing

Use different port for test backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
```

## Feature Flags

Enable/disable features without code changes:

```env
# PDF Generation
NEXT_PUBLIC_ENABLE_BACKEND_PDF=true
NEXT_PUBLIC_ENABLE_CLIENT_PDF=true

# Development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false

# Monitoring
NEXT_PUBLIC_ENABLE_HEALTH_CHECKS=true
```

## Common Issues

### Backend Connection Failed

- Check if backend server is running
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Run `npm run validate-config` to check configuration

### Configuration Validation Failed

- Ensure all required variables are set
- Check URL format (include `http://` or `https://`)
- Remove trailing slashes from URLs

### Features Not Working

- Check feature flags are enabled
- Verify environment file is loaded
- Restart development server after changes

## Validation Commands

```bash
# Validate current configuration
npm run validate-config

# Generate configuration report
npm run config-report

# Check configuration in code
import { validateConfig } from '@/lib/config';
console.log(validateConfig());
```

## Debug Tools

In development mode, you can access debug tools:

```javascript
// Browser console
window.configUtils.healthCheck();
window.configUtils.report();
window.configUtils.logReport();
```

## Next Steps

- Read the [full configuration guide](./CONFIGURATION.md)
- Check [troubleshooting section](./CONFIGURATION.md#troubleshooting)
- Review [best practices](./CONFIGURATION.md#best-practices)
