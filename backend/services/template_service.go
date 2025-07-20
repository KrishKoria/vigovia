package services

import (
	"fmt"
	"html/template"
	"path/filepath"
	"strings"

	"github.com/KrishKoria/Vigovia/config"
	"github.com/KrishKoria/Vigovia/models"
	"github.com/KrishKoria/Vigovia/utils"
	"github.com/sirupsen/logrus"
)

type TemplateService struct {
	templatePath string
	templates    map[string]*template.Template
}

func NewTemplateService() *TemplateService {
	return &TemplateService{
		templatePath: config.AppConfig.Server.TemplateDir,
		templates:    make(map[string]*template.Template),
	}
}

// LoadTemplate loads and caches a template
func (s *TemplateService) LoadTemplate(templateName string) (*template.Template, error) {
	// Check if template is already cached
	if tmpl, exists := s.templates[templateName]; exists {
		return tmpl, nil
	}
	
	// Create template path
	templateFile := filepath.Join(s.templatePath, templateName)
	
	// Parse template with helper functions
	tmpl, err := template.New(templateName).Funcs(s.getTemplateFunctions()).ParseFiles(templateFile)
	if err != nil {
		logrus.WithError(err).WithField("template", templateName).Error("Failed to parse template")
		return nil, fmt.Errorf("failed to parse template %s: %w", templateName, err)
	}
	
	// Cache the template
	s.templates[templateName] = tmpl
	
	logrus.WithField("template", templateName).Debug("Template loaded and cached")
	return tmpl, nil
}

// RenderTemplate renders a template with provided data
func (s *TemplateService) RenderTemplate(templateName string, data *models.TemplateData) (string, error) {
	tmpl, err := s.LoadTemplate(templateName)
	if err != nil {
		return "", err
	}
	
	var result strings.Builder
	err = tmpl.Execute(&result, data)
	if err != nil {
		logrus.WithError(err).WithField("template", templateName).Error("Failed to execute template")
		return "", fmt.Errorf("failed to execute template %s: %w", templateName, err)
	}
	
	html := result.String()
	logrus.WithFields(logrus.Fields{
		"template": templateName,
		"htmlSize": len(html),
		"customerName": data.Customer.Name,
		"destination": data.Trip.Destination,
		"daysCount": len(data.Days),
	}).Debug("Template rendered successfully")
	
	return html, nil
}

// getTemplateFunctions returns template helper functions
func (s *TemplateService) getTemplateFunctions() template.FuncMap {
	return template.FuncMap{
		"formatCurrency": utils.FormatCurrency,
		"formatCurrencyString": utils.FormatCurrencyString,
		"formatDate":     utils.FormatDate,
		"formatTime":     utils.FormatTime,
		"timeRange":      utils.FormatTimeRange,
		"truncate":       utils.TruncateText,
		"upper":          strings.ToUpper,
		"lower":          strings.ToLower,
		"title":          strings.Title,
		"contains":       strings.Contains,
		"add": func(a, b int) int {
			return a + b
		},
		"sub": func(a, b int) int {
			return a - b
		},
		"mul": func(a, b int) int {
			return a * b
		},
		"div": func(a, b int) int {
			if b == 0 {
				return 0
			}
			return a / b
		},
		"mod": func(a, b int) int {
			if b == 0 {
				return 0
			}
			return a % b
		},
		"isEven": func(n int) bool {
			return n%2 == 0
		},
		"isOdd": func(n int) bool {
			return n%2 != 0
		},
		"seq": func(start, end int) []int {
			var seq []int
			if start <= end {
				for i := start; i <= end; i++ {
					seq = append(seq, i)
				}
			}
			return seq
		},
		"join": func(sep string, items []string) string {
			return strings.Join(items, sep)
		},
		"default": func(defaultValue, value interface{}) interface{} {
			if value == nil || value == "" {
				return defaultValue
			}
			return value
		},
	}
}

// ClearCache clears the template cache
func (s *TemplateService) ClearCache() {
	s.templates = make(map[string]*template.Template)
	logrus.Info("Template cache cleared")
}

// PreloadTemplates preloads commonly used templates
func (s *TemplateService) PreloadTemplates() error {
	templateFiles := []string{
		"base.html",
		// "header.html",
		// "footer.html",
		// "trip-details.html",
		// "day-itinerary.html",
		// "flight-summary.html",
		// "hotel-bookings.html",
		// "activity-table.html",
		// "payment-plan.html",
		// "inclusions.html",
		// "important-notes.html",
		// "scope.html",
		// "visa-details.html",
	}
	
	for _, templateFile := range templateFiles {
		_, err := s.LoadTemplate(templateFile)
		if err != nil {
			logrus.WithError(err).WithField("template", templateFile).Warn("Failed to preload template")
		}
	}
	
	logrus.WithField("templatesLoaded", len(s.templates)).Info("Templates preloaded")
	return nil
}
