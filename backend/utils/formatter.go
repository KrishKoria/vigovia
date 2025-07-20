package utils

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

// FormatCurrency formats a number as currency
func FormatCurrency(amount float64, currency string) string {
	if currency == "" {
		currency = "₹"
	}
	return fmt.Sprintf("%s%.2f", currency, amount)
}

// FormatDate formats a date string into a more readable format
func FormatDate(dateStr string) string {
	// Try to parse the date in various formats
	formats := []string{
		"2006-01-02",
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05.000Z",
		"02/01/2006",
		"2006/01/02",
	}
	
	for _, format := range formats {
		if t, err := time.Parse(format, dateStr); err == nil {
			return t.Format("2 January 2006")
		}
	}
	
	// If no format matches, return the original string
	return dateStr
}

// FormatDateShort formats a date string into a short format
func FormatDateShort(dateStr string) string {
	// Try to parse the date in various formats
	formats := []string{
		"2006-01-02",
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05.000Z",
		"02/01/2006",
		"2006/01/02",
	}
	
	for _, format := range formats {
		if t, err := time.Parse(format, dateStr); err == nil {
			return t.Format("2 Jan")
		}
	}
	
	// If no format matches, return the original string
	return dateStr
}

// CalculateDuration calculates the duration between two dates
func CalculateDuration(startDate, endDate string) string {
	start, err1 := time.Parse("2006-01-02", startDate)
	end, err2 := time.Parse("2006-01-02", endDate)
	
	if err1 != nil || err2 != nil {
		return "N/A"
	}
	
	days := int(end.Sub(start).Hours() / 24)
	nights := days - 1
	
	if nights <= 0 {
		return fmt.Sprintf("%d Day", days)
	}
	
	return fmt.Sprintf("%d Days %d Nights", days, nights)
}

// FormatTime formats a time string
func FormatTime(timeStr string) string {
	// Try to parse time in various formats
	formats := []string{
		"15:04",
		"15:04:05",
		"3:04 PM",
		"3:04:05 PM",
	}
	
	for _, format := range formats {
		if t, err := time.Parse(format, timeStr); err == nil {
			return t.Format("15:04")
		}
	}
	
	return timeStr
}

// FormatTimeRange formats a time range (e.g., "09:00 - 17:00")
func FormatTimeRange(start, end time.Time) string {
	return fmt.Sprintf("%s - %s", start.Format("15:04"), end.Format("15:04"))
}

// TruncateText truncates text to a specified length with ellipsis
func TruncateText(text string, maxLength int) string {
	if len(text) <= maxLength {
		return text
	}
	
	if maxLength <= 3 {
		return text[:maxLength]
	}
	
	return text[:maxLength-3] + "..."
}

// FormatPrice formats price with proper currency formatting
func FormatPrice(price float64) string {
	if price == 0 {
		return "Free"
	}
	
	return fmt.Sprintf("₹%.0f", price)
}

// ParseFloat safely parses a string to float64
func ParseFloat(s string) float64 {
	val, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0
	}
	return val
}

// ParseInt safely parses a string to int
func ParseInt(s string) int {
	val, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return val
}

// Capitalize capitalizes the first letter of each word
func Capitalize(s string) string {
	words := strings.Fields(s)
	for i, word := range words {
		if len(word) > 0 {
			words[i] = strings.ToUpper(string(word[0])) + strings.ToLower(word[1:])
		}
	}
	return strings.Join(words, " ")
}

// GenerateTimeRange generates a time range string
func GenerateTimeRange(start, end string) string {
	if start == "" && end == "" {
		return "Full Day"
	}
	if start == "" {
		return fmt.Sprintf("Until %s", FormatTime(end))
	}
	if end == "" {
		return fmt.Sprintf("From %s", FormatTime(start))
	}
	return fmt.Sprintf("%s - %s", FormatTime(start), FormatTime(end))
}
