package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// LoggerMiddleware logs requests using logrus
func LoggerMiddleware() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		// Process request
		c.Next()

		// Calculate latency
		latency := time.Since(start)

		// Get client IP
		clientIP := c.ClientIP()
		
		// Get method and status
		method := c.Request.Method
		statusCode := c.Writer.Status()

		// Log the request
		entry := logrus.WithFields(logrus.Fields{
			"status":     statusCode,
			"latency":    latency,
			"client_ip":  clientIP,
			"method":     method,
			"path":       path,
			"raw_query":  raw,
			"user_agent": c.Request.UserAgent(),
		})

		if len(c.Errors) > 0 {
			entry.Error(c.Errors.String())
		} else {
			if statusCode >= 500 {
				entry.Error("Server error")
			} else if statusCode >= 400 {
				entry.Warn("Client error")
			} else {
				entry.Info("Request completed")
			}
		}
	})
}
