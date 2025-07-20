package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"

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
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "PDF generated successfully",
		Data:    response,
	})
}

func (h *PDFHandler) DownloadPDF(c *gin.Context) {
	filename := c.Param("filename")
	
	if filename == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Missing filename",
			Message: "Filename parameter is required",
		})
		return
	}
	
	pdfData, err := h.fileService.GetPDF(filename)
	if err != nil {
		logrus.WithError(err).WithField("filename", filename).Error("Failed to retrieve PDF")
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "File not found",
			Message: err.Error(),
		})
		return
	}
	
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Header("Content-Length", string(rune(len(pdfData))))
	
	c.Data(http.StatusOK, "application/pdf", pdfData)
	
	logrus.WithField("filename", filename).Info("PDF downloaded")
}

func (h *PDFHandler) GetPDFInfo(c *gin.Context) {
	filename := c.Param("filename")
	
	if filename == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Missing filename",
			Message: "Filename parameter is required",
		})
		return
	}
	
	fileInfo, err := h.fileService.GetFileInfo(filename)
	if err != nil {
		logrus.WithError(err).WithField("filename", filename).Error("Failed to get file info")
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "File not found",
			Message: err.Error(),
		})
		return
	}
	
	response := models.FileInfoResponse{
		FileName:    filename,
		FileSize:    fileInfo.Size(),
		ModTime:     fileInfo.ModTime(),
		ContentType: "application/pdf",
		Extension:   filepath.Ext(filename),
	}
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "File info retrieved successfully",
		Data:    response,
	})
}

func (h *PDFHandler) ListPDFs(c *gin.Context) {
	filenames, err := h.fileService.ListPDFs()
	if err != nil {
		logrus.WithError(err).Error("Failed to list PDFs")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to list files",
			Message: err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "PDF files listed successfully",
		Data: map[string]interface{}{
			"files": filenames,
			"count": len(filenames),
		},
	})
}

func (h *PDFHandler) DeletePDF(c *gin.Context) {
	filename := c.Param("filename")
	
	if filename == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Missing filename",
			Message: "Filename parameter is required",
		})
		return
	}
	
	err := h.fileService.DeletePDF(filename)
	if err != nil {
		logrus.WithError(err).WithField("filename", filename).Error("Failed to delete PDF")
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "Failed to delete file",
			Message: err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "PDF deleted successfully",
		Data: map[string]interface{}{
			"filename": filename,
		},
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
