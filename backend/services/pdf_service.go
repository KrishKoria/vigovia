package services

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
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
	
	html = s.convertStaticURLsToFilePaths(html)
	
	htmlPreview := html
	if len(html) > 200 {
		htmlPreview = html[:200]
	}
	logrus.WithFields(logrus.Fields{
		"htmlSize": len(html),
		"htmlPreview": htmlPreview,
	}).Info("Template rendered to HTML")
	
	pdfData, err := s.convertHTMLToPDF(html)
	if err != nil {
		return nil, logrus.WithError(err).Error("Failed to convert HTML to PDF")
	}
	
	logrus.WithFields(logrus.Fields{
		"pdfSize": len(pdfData),
		"htmlSize": len(html),
	}).Info("HTML converted to PDF")
	
	k := s.generateFilename(request)
	
	filePath, err := s.fileService.SavePDF(pdfData, k)
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
		FileName:    k,
		FileSize:    fileSize,
		GeneratedAt: time.Now(),
	}
	
	logrus.WithFields(logrus.Fields{
		"k": k,
		"fileSize": fileSize,
		"filePath": filePath,
	}).Info("PDF generated successfully")
	
	return response, nil
}

func (s *PDFService) convertHTMLToPDF(html string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), config.AppConfig.ChromeDP.Timeout)
	defer cancel()

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
	
	logrus.Info("Starting ChromeDP HTML to PDF conversion")
	
	var pdfBuffer []byte
	var pageTitle string
	var bodyText string
	
	tempHTMLFile := filepath.Join(config.AppConfig.PDF.StoragePath, "temp_render.html")
	err := os.WriteFile(tempHTMLFile, []byte(html), 0644)
	if err != nil {
		logrus.WithError(err).Error("Failed to write temporary HTML file")
		return nil, fmt.Errorf("failed to write temporary HTML file: %w", err)
	}
	defer os.Remove(tempHTMLFile) 
	
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
		chromedp.Sleep(3*time.Second), 
		chromedp.ActionFunc(func(ctx context.Context) error {
			buf, _, err := page.PrintToPDF().
				WithPaperWidth(8.27).  
				WithPaperHeight(11.7). 
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

	return pdfBuffer, nil
}


func (s *PDFService) transformToTemplateData(request *models.ItineraryRequest) *models.TemplateData {
	importantNotes := request.ImportantNotes
	if len(importantNotes) == 0 {
		importantNotes = []models.ImportantNote{
			{Point: "General Information", Details: "Please carry valid identification and travel documents."},
			{Point: "Booking Confirmation", Details: "All bookings are subject to availability and confirmation."},
			{Point: "Weather Conditions", Details: "Activities may be subject to weather conditions."},
		}
	}
	
	scopeOfService := request.ScopeOfService
	if len(scopeOfService) == 0 {
		scopeOfService = []models.ServiceScope{
			{Service: "Itinerary Planning", Details: "Custom itinerary based on your preferences"},
			{Service: "Activity Booking", Details: "Pre-booking of selected activities and experiences"},
			{Service: "Transfer Arrangements", Details: "Transportation coordination and booking"},
		}
	}
	
	inclusions := request.Inclusions
	if len(inclusions) == 0 {
		inclusions = []models.Inclusion{
			{Category: "Accommodation", Count: len(request.Hotels), Details: "Hotel bookings as per itinerary", Status: "Included"},
			{Category: "Activities", Count: s.countTotalActivities(request.Itinerary.Days), Details: "Sightseeing and activities as mentioned", Status: "Included"},
			{Category: "Transfers", Count: s.countTotalTransfers(request.Itinerary.Days), Details: "Airport and inter-city transfers", Status: "Included"},
		}
	}
	
	visaDetails := request.VisaDetails
	if (visaDetails == models.VisaDetails{}) {
		visaDetails = models.VisaDetails{
			VisaType:       "Tourist Visa",
			Validity:       "30 Days",
			ProcessingDate: time.Now().AddDate(0, 0, 14).Format("2006-01-02"),
		}
	}
	
	enhancedPayment := s.enhancePaymentData(request.Payment)
	
	companyInfo := request.CompanyInfo
	if companyInfo.Name == "" {
		companyInfo = models.CompanyInfo{
			Name: "Vigovia Tech Pvt. Ltd",
			RegisteredOffice: models.RegisteredOffice{
				Address: "Hd-109 Cinnabar Hills, Links Business Park",
				City:    "Karnataka",
				State:   "Karnataka",
				Country: "India",
			},
			Contact: models.ContactInfo{
				Phone: "+91-99X9999999",
				Email: "Contact@Vigovia.Com",
			},
			Logo: "/static/final-logo-2.png",
		}
	}
	
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
		CompanyInfo:    companyInfo,
		GeneratedAt:    time.Now(),
	}
}

func (s *PDFService) generateFilename(request *models.ItineraryRequest) string {
	baseFilename := utils.GenerateReadableFilename(
		request.Trip.Destination,
		request.Trip.StartDate,
		request.Trip.EndDate,
		request.Trip.Travelers,
		request.Customer.Name,
	)
	
	return baseFilename
}

func (s *PDFService) countTotalActivities(days []models.Day) int {
	count := 0
	for _, day := range days {
		count += len(day.Activities)
	}
	return count
}

func (s *PDFService) countTotalTransfers(days []models.Day) int {
	count := 0
	for _, day := range days {
		count += len(day.Transfers)
	}
	return count
}

func (s *PDFService) enhancePaymentData(payment models.Payment) models.Payment {
	enhanced := payment
	enhanced.Status = "Pending" 
	
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

func (s *PDFService) convertStaticURLsToFilePaths(html string) string {
	cwd, err := os.Getwd()
	if err != nil {
		logrus.WithError(err).Warn("Failed to get current working directory")
		return html
	}
	
	staticDir := filepath.Join(cwd, "static")
	absStaticDir := filepath.ToSlash(staticDir)
	
	fileURL := "file:///" + absStaticDir + "/"
	
	html = strings.ReplaceAll(html, "/static/", fileURL)
	
	logrus.WithFields(logrus.Fields{
		"staticDir": staticDir,
		"fileURL": fileURL,
	}).Debug("Converted static URLs to file paths")
	
	return html
}
