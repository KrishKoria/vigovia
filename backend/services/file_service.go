package services

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

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
	err := utils.EnsureDirectoryExists(s.storagePath)
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

func (s *FileService) GetPDF(filename string) ([]byte, error) {
	filePath := filepath.Join(s.storagePath, filename)
	
	if !utils.FileExists(filePath) {
		return nil, fmt.Errorf("file not found: %s", filename)
	}
	
	data, err := os.ReadFile(filePath)
	if err != nil {
		logrus.WithError(err).WithField("filePath", filePath).Error("Failed to read PDF file")
		return nil, fmt.Errorf("failed to read PDF file: %w", err)
	}
	
	logrus.WithField("filePath", filePath).Debug("PDF file retrieved successfully")
	return data, nil
}

func (s *FileService) DeletePDF(filename string) error {
	filePath := filepath.Join(s.storagePath, filename)
	
	if !utils.FileExists(filePath) {
		return fmt.Errorf("file not found: %s", filename)
	}
	
	err := os.Remove(filePath)
	if err != nil {
		logrus.WithError(err).WithField("filePath", filePath).Error("Failed to delete PDF file")
		return fmt.Errorf("failed to delete PDF file: %w", err)
	}
	
	logrus.WithField("filePath", filePath).Info("PDF file deleted successfully")
	return nil
}

func (s *FileService) ListPDFs() ([]string, error) {
	files, err := filepath.Glob(filepath.Join(s.storagePath, "*.pdf"))
	if err != nil {
		logrus.WithError(err).Error("Failed to list PDF files")
		return nil, fmt.Errorf("failed to list PDF files: %w", err)
	}
	
	var filenames []string
	for _, file := range files {
		filenames = append(filenames, filepath.Base(file))
	}
	
	logrus.WithField("fileCount", len(filenames)).Debug("PDF files listed successfully")
	return filenames, nil
}

func (s *FileService) CleanupOldFiles() error {
	maxAge := config.AppConfig.PDF.MaxFileAge
	cutoffTime := time.Now().Add(-maxAge)
	
	files, err := filepath.Glob(filepath.Join(s.storagePath, "*.pdf"))
	if err != nil {
		logrus.WithError(err).Error("Failed to list files for cleanup")
		return fmt.Errorf("failed to list files for cleanup: %w", err)
	}
	
	var deletedCount int
	for _, file := range files {
		fileInfo, err := os.Stat(file)
		if err != nil {
			logrus.WithError(err).WithField("file", file).Warn("Failed to get file info")
			continue
		}
		
		if fileInfo.ModTime().Before(cutoffTime) {
			err = os.Remove(file)
			if err != nil {
				logrus.WithError(err).WithField("file", file).Error("Failed to delete old file")
			} else {
				deletedCount++
				logrus.WithField("file", file).Debug("Deleted old PDF file")
			}
		}
	}
	
	logrus.WithFields(logrus.Fields{
		"deletedCount": deletedCount,
		"maxAge":       maxAge,
	}).Info("Cleanup completed")
	
	return nil
}

func (s *FileService) GetFileInfo(filename string) (os.FileInfo, error) {
	filePath := filepath.Join(s.storagePath, filename)
	
	if !utils.FileExists(filePath) {
		return nil, fmt.Errorf("file not found: %s", filename)
	}
	
	return os.Stat(filePath)
}
