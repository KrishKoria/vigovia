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
	if err := config.LoadConfig(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	
	setupLogging()
	
	if config.AppConfig.Server.Host == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	
	router := gin.New()
	
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.ErrorHandlingMiddleware())
	router.Use(gin.Recovery())
	
	setupRoutes(router)
	
	port := fmt.Sprintf(":%s", config.AppConfig.Server.Port)
	logrus.WithField("port", port).Info("Starting server")
	
	if err := router.Run(port); err != nil {
		logrus.WithError(err).Fatal("Failed to start server")
	}
}

func setupLogging() {
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
	pdfHandler := handlers.NewPDFHandler()
	
	router.Static("/static", "./static")
	
	v1 := router.Group("/api/v1")
	{
		v1.GET("/health", pdfHandler.HealthCheck)
		
		v1.POST("/generate-pdf", pdfHandler.GenerateItinerary)
	}
	
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Vigovia PDF Generation API",
			"version": "1.0.0",
			"status":  "running",
		})
	})
	
	logrus.Info("Routes configured")
}
