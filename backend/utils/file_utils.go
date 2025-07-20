package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

// GenerateUniqueFilename generates a unique filename for PDFs
func GenerateUniqueFilename(prefix string) string {
	timestamp := time.Now().Format("20060102_150405")
	uniqueID := uuid.New().String()[:8]
	return fmt.Sprintf("%s_%s_%s.pdf", prefix, timestamp, uniqueID)
}

// GenerateReadableFilename generates a human-readable filename
func GenerateReadableFilename(destination, startDate, endDate string, travelers int, customerName string) string {
	// Clean the strings for filename use
	destination = sanitizeForFilename(destination)
	customerName = sanitizeForFilename(customerName)
	
	filename := fmt.Sprintf("%s_%s_to_%s_%dpax_%s.pdf", 
		destination, startDate, endDate, travelers, customerName)
	
	return filename
}

// EnsureDirectory ensures a directory exists, creates if it doesn't
func EnsureDirectory(dirPath string) error {
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		return os.MkdirAll(dirPath, 0755)
	}
	return nil
}

// GetFileSize returns the size of a file in a human-readable format
func GetFileSize(filePath string) (string, error) {
	info, err := os.Stat(filePath)
	if err != nil {
		return "", err
	}
	
	size := info.Size()
	
	if size < 1024 {
		return fmt.Sprintf("%d B", size), nil
	} else if size < 1024*1024 {
		return fmt.Sprintf("%.1f KB", float64(size)/1024), nil
	} else {
		return fmt.Sprintf("%.1f MB", float64(size)/(1024*1024)), nil
	}
}

// CleanupOldFiles removes files older than the specified duration
func CleanupOldFiles(dirPath string, maxAge time.Duration) error {
	return filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		
		if !info.IsDir() && time.Since(info.ModTime()) > maxAge {
			logrus.WithField("file", path).Info("Removing old file")
			return os.Remove(path)
		}
		
		return nil
	})
}

// FileExists checks if a file exists
func FileExists(filePath string) bool {
	_, err := os.Stat(filePath)
	return !os.IsNotExist(err)
}

// EnsureDirectoryExists creates a directory if it doesn't exist
func EnsureDirectoryExists(dirPath string) error {
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		err := os.MkdirAll(dirPath, 0755)
		if err != nil {
			return fmt.Errorf("failed to create directory %s: %w", dirPath, err)
		}
	}
	return nil
}

// sanitizeForFilename removes or replaces characters that aren't safe for filenames
func sanitizeForFilename(s string) string {
	// Replace common problematic characters
	replacements := map[rune]string{
		' ':  "_",
		'/':  "_",
		'\\': "_",
		':':  "_",
		'*':  "_",
		'?':  "_",
		'"':  "_",
		'<':  "_",
		'>':  "_",
		'|':  "_",
	}
	
	result := ""
	for _, char := range s {
		if replacement, exists := replacements[char]; exists {
			result += replacement
		} else if char >= 32 && char <= 126 { // Printable ASCII
			result += string(char)
		}
	}
	
	return result
}
