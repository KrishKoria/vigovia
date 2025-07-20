package middleware

import (
	"net/http"

	"github.com/KrishKoria/Vigovia/models"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ErrorHandlingMiddleware handles panics and errors globally
func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				logrus.WithFields(logrus.Fields{
					"error": err,
					"path":  c.Request.URL.Path,
					"method": c.Request.Method,
				}).Error("Panic recovered")
				
				c.JSON(http.StatusInternalServerError, models.ErrorResponse{
					Error:   "Internal server error",
					Message: "An unexpected error occurred",
				})
				c.Abort()
			}
		}()
		
		c.Next()
		
		// Handle any errors that were set during request processing
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			logrus.WithFields(logrus.Fields{
				"error": err.Error(),
				"path":  c.Request.URL.Path,
				"method": c.Request.Method,
			}).Error("Request error")
			
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{
				Error:   "Request processing error",
				Message: err.Error(),
			})
			c.Abort()
		}
	}
}
