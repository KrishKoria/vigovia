package middleware

import (
	"net/http"

	"github.com/KrishKoria/Vigovia/models"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ErrorHandler middleware handles panics and errors
func ErrorHandler() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				logrus.WithField("error", err).Error("Panic recovered")
				
				response := models.APIResponse{
					Success: false,
					Message: "Internal server error",
					Errors: []models.APIError{
						{
							Message: "An unexpected error occurred",
							Code:    "INTERNAL_ERROR",
						},
					},
				}
				
				c.JSON(http.StatusInternalServerError, response)
				c.Abort()
			}
		}()
		
		c.Next()
		
		// Handle errors from handlers
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			response := models.APIResponse{
				Success: false,
				Message: "Request failed",
				Errors: []models.APIError{
					{
						Message: err.Error(),
						Code:    "REQUEST_ERROR",
					},
				},
			}
			
			c.JSON(http.StatusBadRequest, response)
		}
	})
}
