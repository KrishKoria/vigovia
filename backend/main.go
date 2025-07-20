package main

import (
	"fmt"
	"log"

	"github.com/KrishKoria/Vigovia/config"
	"github.com/KrishKoria/Vigovia/handlers"
	"github.com/KrishKoria/Vigovia/middleware"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func main() {
	// Load configuration
	if err := config.LoadConfig(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	
	// Setup logging
	setupLogging()
	
	// Initialize Gin
	if config.AppConfig.Server.Host == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	
	// Create router
	router := gin.New()
	
	// Setup middleware
	router.Use(middleware.LoggingMiddleware())
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.ErrorHandlingMiddleware())
	router.Use(gin.Recovery())
	
	// Setup routes
	setupRoutes(router)
	
	// Start server
	port := fmt.Sprintf(":%s", config.AppConfig.Server.Port)
	logrus.WithField("port", port).Info("Starting server")
	
	if err := router.Run(port); err != nil {
		logrus.WithError(err).Fatal("Failed to start server")
	}
}

func setupLogging() {
	// Set log level
	switch config.AppConfig.Logging.Level {
	case "debug":
		logrus.SetLevel(logrus.DebugLevel)
	case "info":
		logrus.SetLevel(logrus.InfoLevel)
	case "warn":
		logrus.SetLevel(logrus.WarnLevel)
	case "error":
		logrus.SetLevel(logrus.ErrorLevel)
	default:
		logrus.SetLevel(logrus.InfoLevel)
	}
	
	// Set log format
	if config.AppConfig.Logging.Format == "json" {
		logrus.SetFormatter(&logrus.JSONFormatter{})
	} else {
		logrus.SetFormatter(&logrus.TextFormatter{
			FullTimestamp: true,
		})
	}
	
	logrus.Info("Logging configured")
}

func setupRoutes(router *gin.Engine) {
	// Initialize handlers
	pdfHandler := handlers.NewPDFHandler()
	
	// Serve static files (for logo and other assets)
	router.Static("/static", "./static")
	
	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Health check
		v1.GET("/health", pdfHandler.HealthCheck)
		
		// PDF generation
		v1.POST("/generate-pdf", pdfHandler.GenerateItinerary)
		
		// PDF management
		v1.GET("/download/:filename", pdfHandler.DownloadPDF)
		v1.GET("/pdf/:filename/info", pdfHandler.GetPDFInfo)
		v1.GET("/pdfs", pdfHandler.ListPDFs)
		v1.DELETE("/pdf/:filename", pdfHandler.DeletePDF)
	}
	
	// Root route
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Vigovia PDF Generation API",
			"version": "1.0.0",
			"status":  "running",
		})
	})
	
	logrus.Info("Routes configured")
}
