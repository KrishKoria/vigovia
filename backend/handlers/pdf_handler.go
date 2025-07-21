package handlers

import (
	"fmt"
	"net/http"

	"github.com/KrishKoria/Vigovia/models"
	"github.com/KrishKoria/Vigovia/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type PDFHandler struct {
	pdfService  *services.PDFService
	fileService *services.FileService
}

func NewPDFHandler() *PDFHandler {
	return &PDFHandler{
		pdfService:  services.NewPDFService(),
		fileService: services.NewFileService(),
	}
}

func (h *PDFHandler) GenerateItinerary(c *gin.Context) {
	var request models.ItineraryRequest
	
	if err := c.ShouldBindJSON(&request); err != nil {
		logrus.WithError(err).Error("Failed to bind JSON request")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request format",
			Message: err.Error(),
		})
		return
	}
	
	logrus.WithFields(logrus.Fields{
		"destination": request.Trip.Destination,
		"travelers":   request.Trip.Travelers,
		"startDate":   request.Trip.StartDate,
		"endDate":     request.Trip.EndDate,
		"customerName": request.Customer.Name,
		"customerEmail": request.Customer.Email,
		"daysCount": len(request.Itinerary.Days),
		"flightsCount": len(request.Flights),
		"hotelsCount": len(request.Hotels),
		"hasPayment": request.Payment.TotalAmount != "",
	}).Info("Received PDF generation request")
	
	logrus.WithField("requestStructure", fmt.Sprintf("%+v", request)).Debug("Full request structure")
	
	response, err := h.pdfService.GenerateItinerary(&request)
	if err != nil {
		logrus.WithError(err).Error("Failed to generate PDF")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "PDF generation failed",
			Message: err.Error(),
		})
		return
	}
	
	// Check if client wants to download the PDF directly
	if c.Query("download") == "true" {
		// Read the generated PDF file
		pdfData, err := h.fileService.ReadPDF(response.FilePath)
		if err != nil {
			logrus.WithError(err).Error("Failed to read generated PDF file")
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{
				Error:   "Failed to read PDF file",
				Message: err.Error(),
			})
			return
		}
		
		// Set appropriate headers for PDF response
		c.Header("Content-Type", "application/pdf")
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", response.FileName))
		c.Header("Content-Length", fmt.Sprintf("%d", len(pdfData)))
		
		// Stream the PDF data directly
		c.Data(http.StatusOK, "application/pdf", pdfData)
		return
	}
	
	// Default behavior: return JSON with file info (backward compatible)
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "PDF generated successfully",
		Data:    response,
	})
}
func (h *PDFHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Service is healthy",
		Data: map[string]interface{}{
			"status":    "ok",
			"timestamp": "2024-01-01T00:00:00Z",
			"version":   "1.0.0",
		},
	})
}
