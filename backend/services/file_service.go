package services

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/KrishKoria/Vigovia/config"
	"github.com/KrishKoria/Vigovia/utils"
	"github.com/sirupsen/logrus"
)

type FileService struct {
	storagePath string
}

func NewFileService() *FileService {
	return &FileService{
		storagePath: config.AppConfig.PDF.StoragePath,
	}
}

func (s *FileService) SavePDF(pdfData []byte, filename string) (string, error) {
	err := utils.EnsureDirectory(s.storagePath)
	if err != nil {
		logrus.WithError(err).Error("Failed to create storage directory")
		return "", fmt.Errorf("failed to create storage directory: %w", err)
	}
	
	filePath := filepath.Join(s.storagePath, filename)
	
	err = os.WriteFile(filePath, pdfData, 0644)
	if err != nil {
		logrus.WithError(err).WithField("filePath", filePath).Error("Failed to write PDF file")
		return "", fmt.Errorf("failed to write PDF file: %w", err)
	}
	
	logrus.WithFields(logrus.Fields{
		"filePath": filePath,
		"fileSize": len(pdfData),
	}).Info("PDF file saved successfully")
	
	return filePath, nil
}

func (s *FileService) ReadPDF(filePath string) ([]byte, error) {
	pdfData, err := os.ReadFile(filePath)
	if err != nil {
		logrus.WithError(err).WithField("filePath", filePath).Error("Failed to read PDF file")
		return nil, fmt.Errorf("failed to read PDF file: %w", err)
	}
	
	logrus.WithFields(logrus.Fields{
		"filePath": filePath,
		"fileSize": len(pdfData),
	}).Info("PDF file read successfully")
	
	return pdfData, nil
}
