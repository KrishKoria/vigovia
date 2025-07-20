package services

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/KrishKoria/Vigovia/config"
	"github.com/KrishKoria/Vigovia/models"
	"github.com/KrishKoria/Vigovia/utils"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"github.com/sirupsen/logrus"
)

type PDFService struct {
	templateService *TemplateService
	fileService     *FileService
}

func NewPDFService() *PDFService {
	return &PDFService{
		templateService: NewTemplateService(),
		fileService:     NewFileService(),
	}
}

func (s *PDFService) GenerateItinerary(request *models.ItineraryRequest) (*models.PDFResponse, error) {
	logrus.Info("Starting PDF generation")
	
	if errors := utils.ValidateStruct(request); len(errors) > 0 {
		return nil, fmt.Errorf("validation failed: %v", errors)
	}
	
	templateData := s.transformToTemplateData(request)
	
	// Log template data for debugging
	logrus.WithFields(logrus.Fields{
		"customerName": templateData.Customer.Name,
		"daysCount": len(templateData.Days),
		"flightsCount": len(templateData.Flights),
		"hotelsCount": len(templateData.Hotels),
		"hasPayment": templateData.Payment.TotalAmount != "",
	}).Info("Template data prepared")
	
	html, err := s.templateService.RenderTemplate("base.html", templateData)
	if err != nil {
		logrus.WithError(err).Error("Failed to render template")
		return nil, fmt.Errorf("failed to render template: %w", err)
	}
	
	// Log HTML size and preview for debugging
	htmlPreview := html
	if len(html) > 200 {
		htmlPreview = html[:200]
	}
	logrus.WithFields(logrus.Fields{
		"htmlSize": len(html),
		"htmlPreview": htmlPreview,
	}).Info("Template rendered to HTML")
	
	// Save HTML to file for debugging
	htmlFile := "debug_output.html"
	if err := s.fileService.SaveHTMLDebug([]byte(html), htmlFile); err != nil {
		logrus.WithError(err).Warn("Failed to save HTML debug file")
	} else {
		logrus.WithField("htmlFile", htmlFile).Info("HTML saved for debugging")
	}
	
	pdfData, err := s.convertHTMLToPDF(html)
	if err != nil {
		logrus.WithError(err).Error("Failed to convert HTML to PDF")
		return nil, fmt.Errorf("failed to convert HTML to PDF: %w", err)
	}
	
	// Log PDF conversion result
	logrus.WithFields(logrus.Fields{
		"pdfSize": len(pdfData),
		"htmlSize": len(html),
	}).Info("HTML converted to PDF")
	
	filename := s.generateFilename(request)
	
	filePath, err := s.fileService.SavePDF(pdfData, filename)
	if err != nil {
		logrus.WithError(err).Error("Failed to save PDF")
		return nil, fmt.Errorf("failed to save PDF: %w", err)
	}
	
	fileSize, err := utils.GetFileSize(filePath)
	if err != nil {
		logrus.WithError(err).Warn("Failed to get file size")
		fileSize = "Unknown"
	}
	
	response := &models.PDFResponse{
		FilePath:    filePath,
		FileName:    filename,
		FileSize:    fileSize,
		GeneratedAt: time.Now(),
		DownloadURL: fmt.Sprintf("/api/v1/download/%s", filename),
	}
	
	logrus.WithFields(logrus.Fields{
		"filename": filename,
		"fileSize": fileSize,
		"filePath": filePath,
	}).Info("PDF generated successfully")
	
	return response, nil
}

func (s *PDFService) convertHTMLToPDF(html string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), config.AppConfig.ChromeDP.Timeout)
	defer cancel()

	// Add more Chrome flags for better PDF rendering
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.DisableGPU,
		chromedp.NoDefaultBrowserCheck,
		chromedp.Flag("headless", config.AppConfig.ChromeDP.Headless),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-web-security", config.AppConfig.ChromeDP.DisableWebSecurity),
		chromedp.Flag("disable-features", "VizDisplayCompositor"),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.Flag("disable-extensions", true),
		chromedp.Flag("disable-plugins", true),
		chromedp.Flag("disable-background-timer-throttling", true),
		chromedp.Flag("disable-backgrounding-occluded-windows", true),
		chromedp.Flag("disable-renderer-backgrounding", true),
		chromedp.Flag("force-color-profile", "srgb"),
		chromedp.Flag("enable-print-background", true),
	)
	
	allocCtx, cancel := chromedp.NewExecAllocator(ctx, opts...)
	defer cancel()
	
	chromeCtx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()
	
	// Add logging for ChromeDP operations
	logrus.Info("Starting ChromeDP HTML to PDF conversion")
	
	var pdfBuffer []byte
	var pageTitle string
	var bodyText string
	
	// Create a temporary HTML file instead of using data URI
	tempHTMLFile := filepath.Join(config.AppConfig.PDF.StoragePath, "temp_render.html")
	err := os.WriteFile(tempHTMLFile, []byte(html), 0644)
	if err != nil {
		logrus.WithError(err).Error("Failed to write temporary HTML file")
		return nil, fmt.Errorf("failed to write temporary HTML file: %w", err)
	}
	defer os.Remove(tempHTMLFile) // Clean up
	
	// Convert to absolute path for file URL
	absPath, err := filepath.Abs(tempHTMLFile)
	if err != nil {
		logrus.WithError(err).Error("Failed to get absolute path")
		return nil, fmt.Errorf("failed to get absolute path: %w", err)
	}
	
	fileURL := "file:///" + filepath.ToSlash(absPath)
	logrus.WithField("fileURL", fileURL).Info("Loading HTML from file")
	
	err = chromedp.Run(chromeCtx,
		chromedp.Navigate(fileURL),
		chromedp.WaitReady("body", chromedp.ByQuery),
		chromedp.Title(&pageTitle),
		chromedp.Text("body", &bodyText, chromedp.ByQuery),
		chromedp.Sleep(3*time.Second), // Wait for CSS and fonts to load
		chromedp.ActionFunc(func(ctx context.Context) error {
			logrus.WithFields(logrus.Fields{
				"pageTitle": pageTitle,
				"bodyTextLength": len(bodyText),
				"bodyPreview": bodyText[:min(100, len(bodyText))],
			}).Info("Page loaded, generating PDF")
			
			buf, _, err := page.PrintToPDF().
				WithPaperWidth(8.27).  // A4 width in inches
				WithPaperHeight(11.7). // A4 height in inches
				WithMarginTop(0.4).
				WithMarginBottom(0.4).
				WithMarginLeft(0.4).
				WithMarginRight(0.4).
				WithPrintBackground(true).
				WithPreferCSSPageSize(false).
				WithDisplayHeaderFooter(false).
				Do(ctx)
			if err != nil {
				logrus.WithError(err).Error("PDF generation failed in ChromeDP")
				return err
			}
			pdfBuffer = buf
			logrus.WithField("pdfSize", len(buf)).Info("PDF generated successfully in ChromeDP")
			return nil
		}),
	)
	
	if err != nil {
		logrus.WithError(err).Error("ChromeDP execution failed")
		return nil, fmt.Errorf("chromedp error: %w", err)
	}
	
	if len(pdfBuffer) < 1000 { // If PDF is suspiciously small
		logrus.WithFields(logrus.Fields{
			"pdfSize": len(pdfBuffer),
			"htmlSize": len(html),
			"pageTitle": pageTitle,
			"bodyTextLength": len(bodyText),
		}).Warn("Generated PDF is suspiciously small")
	}
	
	return pdfBuffer, nil
}

// Helper function for min
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func (s *PDFService) transformToTemplateData(request *models.ItineraryRequest) *models.TemplateData {
	importantNotes := []models.ImportantNote{
		{Point: "General Information", Details: "Please carry valid identification and travel documents."},
		{Point: "Booking Confirmation", Details: "All bookings are subject to availability and confirmation."},
		{Point: "Weather Conditions", Details: "Activities may be subject to weather conditions."},
	}
	
	scopeOfService := []models.ServiceScope{
		{Service: "Itinerary Planning", Details: "Custom itinerary based on your preferences"},
		{Service: "Activity Booking", Details: "Pre-booking of selected activities and experiences"},
		{Service: "Transfer Arrangements", Details: "Transportation coordination and booking"},
	}
	
	inclusions := []models.Inclusion{
		{Category: "Accommodation", Count: len(request.Hotels), Details: "Hotel bookings as per itinerary", Status: "Included"},
		{Category: "Activities", Count: s.countTotalActivities(request.Itinerary.Days), Details: "Sightseeing and activities as mentioned", Status: "Included"},
		{Category: "Transfers", Count: s.countTotalTransfers(request.Itinerary.Days), Details: "Airport and inter-city transfers", Status: "Included"},
	}
	
	visaDetails := models.VisaDetails{
		VisaType:       "Tourist Visa",
		Validity:       "30 Days",
		ProcessingDate: time.Now().AddDate(0, 0, 14).Format("2006-01-02"),
	}
	
	// Calculate advance and balance amounts from installments
	enhancedPayment := s.enhancePaymentData(request.Payment)
	
	return &models.TemplateData{
		Customer:       request.Customer,
		Trip:           request.Trip,
		Days:           request.Itinerary.Days,
		Flights:        request.Flights,
		Hotels:         request.Hotels,
		Payment:        enhancedPayment,
		Config:         request.Config,
		ImportantNotes: importantNotes,
		ScopeOfService: scopeOfService,
		Inclusions:     inclusions,
		VisaDetails:    visaDetails,
		GeneratedAt:    time.Now(),
	}
}

// generateFilename generates a filename for the PDF
func (s *PDFService) generateFilename(request *models.ItineraryRequest) string {
	baseFilename := utils.GenerateReadableFilename(
		request.Trip.Destination,
		request.Trip.StartDate,
		request.Trip.EndDate,
		request.Trip.Travelers,
		request.Customer.Name,
	)
	
	// Ensure filename is unique
	return baseFilename
}

// countTotalActivities counts total activities across all days
func (s *PDFService) countTotalActivities(days []models.Day) int {
	count := 0
	for _, day := range days {
		count += len(day.Activities)
	}
	return count
}

// countTotalTransfers counts total transfers across all days
func (s *PDFService) countTotalTransfers(days []models.Day) int {
	count := 0
	for _, day := range days {
		count += len(day.Transfers)
	}
	return count
}

// enhancePaymentData calculates advance and balance amounts from installments
func (s *PDFService) enhancePaymentData(payment models.Payment) models.Payment {
	enhanced := payment
	enhanced.Status = "Pending" // Default status if not set
	
	// Calculate advance and balance amounts from installments
	var advanceAmount, balanceAmount string
	
	for _, installment := range payment.Installments {
		switch installment.InstallmentName {
		case "Advance Payment":
			advanceAmount = installment.Amount
		case "Balance Payment":
			balanceAmount = installment.Amount
		}
	}
	
	enhanced.AdvanceAmount = advanceAmount
	enhanced.BalanceAmount = balanceAmount
	
	return enhanced
}
