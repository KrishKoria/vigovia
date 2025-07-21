package models

import (
	"time"
)

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  []APIError  `json:"errors,omitempty"`
}

// APIError represents an API error
type APIError struct {
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
	Code    string `json:"code,omitempty"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// PDFResponse represents the response after generating a PDF
type PDFResponse struct {
	FilePath    string    `json:"file_path"`
	FileName    string    `json:"file_name"`
	FileSize    string    `json:"file_size"`
	GeneratedAt time.Time `json:"generated_at"`
}

// FileInfoResponse represents file information response
type FileInfoResponse struct {
	FileName    string    `json:"file_name"`
	FileSize    int64     `json:"file_size"`
	ModTime     time.Time `json:"mod_time"`
	ContentType string    `json:"content_type"`
	Extension   string    `json:"extension"`
}
