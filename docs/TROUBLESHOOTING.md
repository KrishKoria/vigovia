# Backend Integration Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the backend integration functionality.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Connection Issues](#connection-issues)
- [Data Transformation Issues](#data-transformation-issues)
- [PDF Generation Issues](#pdf-generation-issues)
- [Configuration Issues](#configuration-issues)
- [Performance Issues](#performance-issues)
- [Error Messages](#error-messages)
- [Debug Tools](#debug-tools)
- [Recovery Procedures](#recovery-procedures)

## Quick Diagnostics

### Health Check Commands

Run these commands to quickly diagnose issues:

```typescript
// Check backend health
import { backendPdfService } from "@/lib/backendPdfService";

const health = await backendPdfService.checkBackendHealth();
console.log("Backend Health:", health);

// Validate connection
const validation = await backendPdfService.validateConnection();
console.log("Connection Validation:", validation);

// Check configuration
console.log("Current Config:", backendPdfService.getConfig());
console.log("Backend PDF Enabled:", backendPdfService.isBackendPdfEnabled());
```

### Environment Check

```bash
# Check environment variables
echo $NEXT_PUBLIC_BACKEND_URL
echo $NEXT_PUBLIC_ENABLE_BACKEND_PDF
echo $NEXT_PUBLIC_PDF_TIMEOUT

# Validate configuration
npm run validate-config
```

## Connection Issues

### Issue: "Connection refused by server"

**Symptoms:**

- Error message: "Connection refused by server at http://localhost:8080"
- Backend PDF generation fails immediately
- Health check fails

**Diagnosis:**

```typescript
const health = await backendPdfService.checkBackendHealth();
if (!health.isHealthy && health.error?.includes("ECONNREFUSED")) {
  console.log("Backend server is not running");
}
```

**Solutions:**

1. **Start the backend server:**

   ```bash
   cd backend
   go run main.go
   # or
   docker-compose up
   ```

2. **Check if server is running on correct port:**

   ```bash
   netstat -an | grep 8080
   # or
   lsof -i :8080
   ```

3. **Verify backend URL configuration:**

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

4. **Check firewall settings:**
   - Ensure port 8080 is not blocked
   - Check antivirus software settings

### Issue: "Request timeout after 30000ms"

**Symptoms:**

- Long loading times followed by timeout
- Error message mentions timeout
- Backend server is running but slow

**Diagnosis:**

```typescript
const startTime = Date.now();
try {
  await backendPdfService.generatePDF(data);
} catch (error) {
  const duration = Date.now() - startTime;
  console.log(`Request took ${duration}ms before failing`);
}
```

**Solutions:**

1. **Increase timeout:**

   ```env
   NEXT_PUBLIC_PDF_TIMEOUT=60000  # 60 seconds
   ```

2. **Check backend performance:**

   ```bash
   # Monitor backend logs
   tail -f backend/logs/app.log

   # Check system resources
   top
   htop
   ```

3. **Reduce data complexity:**

   - Limit number of activities per day
   - Reduce image sizes
   - Simplify descriptions

4. **Use client-side generation as fallback:**
   ```typescript
   try {
     await handleBackendPdfGeneration(data);
   } catch (error) {
     console.warn("Backend failed, using client-side:", error);
     await handleClientPdfGeneration(data);
   }
   ```

### Issue: "Cannot resolve server address"

**Symptoms:**

- Error: "getaddrinfo ENOTFOUND"
- DNS resolution failures
- Works with IP but not hostname

**Diagnosis:**

```bash
# Test DNS resolution
nslookup your-backend-domain.com
dig your-backend-domain.com

# Test direct IP connection
curl http://192.168.1.100:8080/health
```

**Solutions:**

1. **Use IP address instead of hostname:**

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://192.168.1.100:8080
   ```

2. **Check DNS settings:**

   - Verify DNS server configuration
   - Try different DNS servers (8.8.8.8, 1.1.1.1)

3. **Update hosts file (temporary fix):**
   ```bash
   # Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
   192.168.1.100 your-backend-domain.com
   ```

### Issue: "SSL/TLS connection error"

**Symptoms:**

- Certificate errors
- SSL handshake failures
- HTTPS connection issues

**Solutions:**

1. **For development, use HTTP:**

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

2. **For production, ensure valid certificate:**

   ```bash
   # Test certificate
   openssl s_client -connect your-domain.com:443
   ```

3. **Check certificate validity:**
   ```bash
   curl -I https://your-backend-domain.com/health
   ```

## Data Transformation Issues

### Issue: "Validation failed: Customer name is required"

**Symptoms:**

- Backend returns 422 validation error
- Form appears complete but validation fails
- Specific field errors

**Diagnosis:**

```typescript
import { validateTransformedData } from "@/lib/dataTransformer";

const backendData = transformToBackendFormat(frontendData);
const validation = validateTransformedData(backendData);

if (!validation.isValid) {
  console.log("Validation errors:", validation.errors);
}
```

**Solutions:**

1. **Check frontend form data:**

   ```typescript
   console.log("Frontend data:", frontendData);
   console.log("Customer name:", frontendData.customerName);
   ```

2. **Verify transformation:**

   ```typescript
   const transformed = transformCustomerData(frontendData);
   console.log("Transformed customer:", transformed);
   ```

3. **Check for empty strings:**
   ```typescript
   if (!frontendData.customerName || frontendData.customerName.trim() === "") {
     console.error("Customer name is empty or whitespace");
   }
   ```

### Issue: "Invalid date format"

**Symptoms:**

- Date-related validation errors
- "Invalid date" messages
- Duration calculation errors

**Diagnosis:**

```typescript
console.log("Start date:", frontendData.startDate);
console.log("End date:", frontendData.endDate);
console.log("Start date parsed:", new Date(frontendData.startDate));
console.log("End date parsed:", new Date(frontendData.endDate));
```

**Solutions:**

1. **Ensure ISO date format:**

   ```typescript
   // Correct format: YYYY-MM-DD
   const startDate = "2024-04-15";
   const endDate = "2024-04-20";
   ```

2. **Validate dates before transformation:**

   ```typescript
   const startDate = new Date(frontendData.startDate);
   const endDate = new Date(frontendData.endDate);

   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
     throw new Error("Invalid date format");
   }

   if (startDate >= endDate) {
     throw new Error("End date must be after start date");
   }
   ```

### Issue: "Activity type not recognized"

**Symptoms:**

- Activities get default "sightseeing" type
- Incorrect activity times
- Type detection not working

**Diagnosis:**

```typescript
import {
  getDefaultActivityType,
  getDefaultActivityTime,
} from "@/lib/defaultValues";

const activityType = getDefaultActivityType(
  activity.name,
  activity.description
);
const activityTime = getDefaultActivityTime(activityType);

console.log("Activity:", activity.name);
console.log("Detected type:", activityType);
console.log("Default time:", activityTime);
```

**Solutions:**

1. **Improve activity descriptions:**

   ```typescript
   // Better descriptions for type detection
   const activities = [
     { name: "Food Tour", description: "Local cuisine tasting" }, // → dining
     { name: "Museum Visit", description: "Art gallery tour" }, // → cultural
     { name: "Hiking", description: "Mountain trek adventure" }, // → adventure
   ];
   ```

2. **Add custom type mapping:**
   ```typescript
   // Extend getDefaultActivityType function
   if (text.includes("your-custom-keyword")) {
     return "your-custom-type";
   }
   ```

## PDF Generation Issues

### Issue: "Received empty PDF file"

**Symptoms:**

- PDF download starts but file is empty (0 bytes)
- No error message but PDF doesn't open
- Backend returns 200 but empty content

**Diagnosis:**

```typescript
try {
  const pdfBlob = await backendPdfService.generatePDF(data);
  console.log("PDF blob size:", pdfBlob.size);
  console.log("PDF blob type:", pdfBlob.type);
} catch (error) {
  console.error("PDF generation error:", error);
}
```

**Solutions:**

1. **Check backend logs:**

   ```bash
   tail -f backend/logs/app.log
   # Look for PDF generation errors
   ```

2. **Verify backend PDF service:**

   ```bash
   # Test backend directly
   curl -X POST http://localhost:8080/api/v1/generate-pdf \
     -H "Content-Type: application/json" \
     -d '{"customer":{"name":"Test"},"trip":{"title":"Test"}}' \
     --output test.pdf
   ```

3. **Check data completeness:**
   ```typescript
   const validation = validateTransformedData(backendData);
   if (!validation.isValid) {
     console.log("Data issues:", validation.errors);
   }
   ```

### Issue: "PDF download not working"

**Symptoms:**

- PDF generation succeeds but download doesn't start
- Browser doesn't show download dialog
- File download errors

**Diagnosis:**

```typescript
// Check if blob is valid
if (pdfBlob && pdfBlob.size > 0) {
  console.log("Blob is valid, checking download...");

  // Test manual download
  const url = URL.createObjectURL(pdfBlob);
  console.log("Blob URL:", url);
}
```

**Solutions:**

1. **Check browser permissions:**

   - Allow downloads from the site
   - Check popup blocker settings
   - Verify download location permissions

2. **Try alternative download method:**

   ```typescript
   // Alternative download approach
   const url = URL.createObjectURL(pdfBlob);
   window.open(url, "_blank");
   ```

3. **Check filename validity:**

   ```typescript
   const filename = backendPdfService.generateFilename(tripData);
   console.log("Generated filename:", filename);

   // Ensure filename is valid
   const validFilename = filename.replace(/[<>:"/\\|?*]/g, "-");
   ```

## Configuration Issues

### Issue: "Backend PDF generation is disabled"

**Symptoms:**

- Backend PDF button not visible
- Feature disabled message
- Only client-side option available

**Diagnosis:**

```typescript
import { isFeatureEnabled } from "@/lib/config";

console.log("Backend PDF enabled:", isFeatureEnabled("backendPdfGeneration"));
console.log("Environment variables:", {
  NEXT_PUBLIC_ENABLE_BACKEND_PDF: process.env.NEXT_PUBLIC_ENABLE_BACKEND_PDF,
  NODE_ENV: process.env.NODE_ENV,
});
```

**Solutions:**

1. **Enable feature flag:**

   ```env
   NEXT_PUBLIC_ENABLE_BACKEND_PDF=true
   ```

2. **Restart development server:**

   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

3. **Check environment file loading:**
   ```bash
   # Ensure .env.local exists and is properly formatted
   cat .env.local
   ```

### Issue: "Environment variables not loading"

**Symptoms:**

- Configuration shows default values
- Environment variables undefined
- Settings not taking effect

**Solutions:**

1. **Check file naming:**

   ```bash
   # Correct names
   .env.local          # Local overrides
   .env.development    # Development defaults
   .env.production     # Production defaults

   # Incorrect names (won't work)
   .env.local.txt
   env.local
   .environment
   ```

2. **Verify file location:**

   ```bash
   # Files should be in project root
   ls -la .env*
   ```

3. **Check variable naming:**

   ```env
   # Correct (client-side variables need NEXT_PUBLIC_ prefix)
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

   # Incorrect (won't be available in browser)
   BACKEND_URL=http://localhost:8080
   ```

4. **Restart after changes:**
   ```bash
   # Always restart after environment changes
   npm run dev
   ```

## Performance Issues

### Issue: "PDF generation is slow"

**Symptoms:**

- Long wait times for PDF generation
- Timeout warnings
- Poor user experience

**Diagnosis:**

```typescript
const startTime = Date.now();
try {
  const pdf = await backendPdfService.generatePDF(data);
  const duration = Date.now() - startTime;
  console.log(`PDF generation took ${duration}ms`);
} catch (error) {
  console.log(`Failed after ${Date.now() - startTime}ms`);
}
```

**Solutions:**

1. **Optimize data size:**

   ```typescript
   // Reduce image sizes
   const optimizedData = {
     ...data,
     itinerary: {
       days: data.itinerary.days.map((day) => ({
         ...day,
         activities: day.activities.map((activity) => ({
           ...activity,
           image: activity.image
             ? compressImage(activity.image)
             : activity.image,
         })),
       })),
     },
   };
   ```

2. **Implement progress indicators:**

   ```typescript
   const [progress, setProgress] = useState(0);

   // Show progress during generation
   const generateWithProgress = async () => {
     setProgress(25); // Data transformation
     const backendData = transformToBackendFormat(frontendData);

     setProgress(50); // Sending request
     const pdfBlob = await backendPdfService.generatePDF(backendData);

     setProgress(75); // Processing response
     const filename = generateFilename(tripData);

     setProgress(100); // Download
     downloadPdf(pdfBlob, filename);
   };
   ```

3. **Use streaming for large files:**

   ```typescript
   // For very large PDFs, consider streaming
   const response = await fetch("/api/v1/generate-pdf-stream", {
     method: "POST",
     body: JSON.stringify(data),
   });

   const reader = response.body.getReader();
   // Process stream chunks
   ```

## Error Messages

### Common Error Messages and Solutions

#### "Failed to fetch"

- **Cause**: Network connectivity issues, CORS problems
- **Solution**: Check network connection, verify CORS settings on backend

#### "422 Unprocessable Entity"

- **Cause**: Data validation failed on backend
- **Solution**: Check data format, run validation before sending

#### "500 Internal Server Error"

- **Cause**: Backend processing error
- **Solution**: Check backend logs, verify data completeness

#### "503 Service Unavailable"

- **Cause**: Backend server overloaded or down
- **Solution**: Check server status, implement retry logic

#### "CORS policy error"

- **Cause**: Cross-origin request blocked
- **Solution**: Configure CORS on backend, check request headers

## Debug Tools

### Browser Console Commands

```javascript
// Check configuration
window.configUtils?.report();

// Test backend health
await window.backendUtils?.healthCheck();

// Validate data transformation
window.transformUtils?.validate(formData);
```

### Development Tools

```typescript
// Enable debug mode
localStorage.setItem("debug", "true");

// Log all requests
localStorage.setItem("logRequests", "true");

// Mock backend responses
localStorage.setItem("mockBackend", "true");
```

### Logging

```typescript
// Enhanced logging
import { logger } from "@/lib/logger";

logger.debug("PDF generation started", { data });
logger.info("Backend health check", { health });
logger.error("PDF generation failed", { error, data });
```

## Recovery Procedures

### Automatic Recovery

The system includes automatic recovery mechanisms:

```typescript
// Automatic retry for transient failures
const result = await ErrorRecovery.attemptRecovery(
  error,
  () => backendPdfService.generatePDF(data),
  { maxAttempts: 3, delay: 1000 }
);
```

### Manual Recovery Steps

1. **Check system status:**

   ```bash
   npm run health-check
   ```

2. **Reset configuration:**

   ```bash
   rm .env.local
   cp .env.example .env.local
   ```

3. **Clear cache:**

   ```bash
   rm -rf .next
   npm run build
   ```

4. **Restart services:**

   ```bash
   # Frontend
   npm run dev

   # Backend
   cd backend && go run main.go
   ```

### Emergency Fallback

If backend is completely unavailable:

```typescript
// Disable backend PDF generation
localStorage.setItem("disableBackendPdf", "true");

// Or use environment variable
NEXT_PUBLIC_ENABLE_BACKEND_PDF = false;
```

### Data Recovery

If data transformation fails:

```typescript
// Save problematic data for analysis
localStorage.setItem("lastFailedData", JSON.stringify(frontendData));

// Use minimal data set
const minimalData = {
  customerName: frontendData.customerName || "Unknown",
  customerEmail: frontendData.customerEmail || "unknown@example.com",
  customerPhone: frontendData.customerPhone || "+1234567890",
  tripTitle: frontendData.tripTitle || "Trip",
  destination: frontendData.destination || "Destination",
  startDate: frontendData.startDate || new Date().toISOString().split("T")[0],
  endDate: frontendData.endDate || new Date().toISOString().split("T")[0],
  numberOfTravellers: frontendData.numberOfTravellers || 1,
  days: [],
};
```

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**

   ```bash
   # Frontend logs
   npm run logs

   # Backend logs
   tail -f backend/logs/app.log
   ```

2. **Create a minimal reproduction:**

   ```typescript
   const minimalData = {
     customerName: "Test User",
     customerEmail: "test@example.com",
     customerPhone: "+1234567890",
     tripTitle: "Test Trip",
     destination: "Test Destination",
     startDate: "2024-06-01",
     endDate: "2024-06-02",
     numberOfTravellers: 1,
     days: [],
   };

   // Test with minimal data
   const result = await backendPdfService.generatePDF(
     transformToBackendFormat(minimalData)
   );
   ```

3. **Document the issue:**

   - Environment details (OS, browser, Node version)
   - Configuration settings
   - Error messages and stack traces
   - Steps to reproduce
   - Expected vs actual behavior

4. **Check for known issues:**
   - Review project documentation
   - Check issue tracker
   - Search community forums

Remember to always test with minimal data first, then gradually add complexity to isolate the problem.
