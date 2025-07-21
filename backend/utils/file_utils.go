package utils

import (
	"fmt"
	"os"
)

func GenerateReadableFilename(destination, startDate, endDate string, travelers int, customerName string) string {
	destination = sanitizeForFilename(destination)
	customerName = sanitizeForFilename(customerName)
	
	filename := fmt.Sprintf("%s_%s_to_%s_%dpax_%s.pdf", 
		destination, startDate, endDate, travelers, customerName)
	
	return filename
}

func EnsureDirectory(dirPath string) error {
    if _, err := os.Stat(dirPath); os.IsNotExist(err) {
        return os.MkdirAll(dirPath, 0755)
    }
    return nil
}

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


func FileExists(filePath string) bool {
	_, err := os.Stat(filePath)
	return !os.IsNotExist(err)
}

func sanitizeForFilename(s string) string {
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
		} else if char >= 32 && char <= 126 { 
			result += string(char)
		}
	}
	
	return result
}
