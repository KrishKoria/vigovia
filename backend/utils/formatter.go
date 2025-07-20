package utils

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func FormatCurrency(amount float64, currency string) string {
	if currency == "" {
		currency = "₹"
	}
	return fmt.Sprintf("%s%.2f", currency, amount)
}

func FormatCurrencyString(amountStr string, currency string) string {
	if currency == "" {
		currency = "₹"
	}
	
	amount, err := strconv.ParseFloat(amountStr, 64)
	if err != nil {
		return fmt.Sprintf("%s%s", currency, amountStr)
	}
	
	return fmt.Sprintf("%s%.2f", currency, amount)
}

func FormatDate(date interface{}) string {
    switch v := date.(type) {
    case string:
        return formatDateString(v)
    case time.Time:
        return v.Format("2 January 2006")
    default:
        return fmt.Sprintf("%v", date)
    }
}

func formatDateString(dateStr string) string {
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
    
    return dateStr
}

func FormatDateShort(dateStr string) string {
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
	
	return dateStr
}

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

func FormatTime(timeStr string) string {
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

func FormatTimeRange(start, end time.Time) string {
	return fmt.Sprintf("%s - %s", start.Format("15:04"), end.Format("15:04"))
}

func TruncateText(text string, maxLength int) string {
	if len(text) <= maxLength {
		return text
	}
	
	if maxLength <= 3 {
		return text[:maxLength]
	}
	
	return text[:maxLength-3] + "..."
}

func FormatPrice(price float64) string {
	if price == 0 {
		return "Free"
	}
	
	return fmt.Sprintf("₹%.0f", price)
}

func ParseFloat(s string) float64 {
	val, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0
	}
	return val
}

func ParseInt(s string) int {
	val, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return val
}

func Capitalize(s string) string {
	words := strings.Fields(s)
	for i, word := range words {
		if len(word) > 0 {
			words[i] = strings.ToUpper(string(word[0])) + strings.ToLower(word[1:])
		}
	}
	return strings.Join(words, " ")
}

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
