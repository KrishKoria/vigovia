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
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
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
func (s *TemplateService) loadAndCacheTemplate(templateName string, files []string) (*template.Template, error) {
	tmpl, err := template.New(templateName).Funcs(s.getTemplateFunctions()).ParseFiles(files...)
	if err != nil {
		logrus.WithError(err).WithField("template", templateName).Error("Failed to parse template")
		return nil, fmt.Errorf("failed to parse template %s: %w", templateName, err)
	}
	s.templates[templateName] = tmpl
	logrus.WithField("template", templateName).WithField("fileCount", len(files)).Debug("Template loaded and cached")
	return tmpl, nil
}

func (s *TemplateService) LoadTemplate(templateName string) (*template.Template, error) {
	if tmpl, exists := s.templates[templateName]; exists {
		return tmpl, nil
	}
	if templateName == "base.html" {
		files := []string{
			filepath.Join(s.templatePath, "base.html"),
			filepath.Join(s.templatePath, "partials", "header.html"),
			filepath.Join(s.templatePath, "partials", "footer.html"),
			filepath.Join(s.templatePath, "partials", "day-itinerary.html"),
			filepath.Join(s.templatePath, "partials", "flight-summary.html"),
			filepath.Join(s.templatePath, "partials", "hotel-bookings.html"),
			filepath.Join(s.templatePath, "partials", "activity-table.html"),
			filepath.Join(s.templatePath, "partials", "payment-plan.html"),
			filepath.Join(s.templatePath, "partials", "inclusions.html"),
			filepath.Join(s.templatePath, "partials", "important-notes.html"),
			filepath.Join(s.templatePath, "partials", "scope.html"),
			filepath.Join(s.templatePath, "partials", "visa-details.html"),
		}
		return s.loadAndCacheTemplate(templateName, files)
	}
	file := filepath.Join(s.templatePath, templateName)
	return s.loadAndCacheTemplate(templateName, []string{file})
}


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

func toFloat64(v interface{}) (float64, bool) {
	switch v := v.(type) {
	case float64:
		return v, true
	case float32:
		return float64(v), true
	case int:
		return float64(v), true
	case int64:
		return float64(v), true
	case int32:
		return float64(v), true
	default:
		return 0, false
	}
}

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
		"title": func(s string) string {
			caser := cases.Title(language.English)
			return caser.String(s)
		},
		"contains":       strings.Contains,
		"add": func(a, b int) int {
			return a + b
		},
		"sub": func(a, b int) int {
			return a - b
		},
        "mul": func(a, b interface{}) float64 {
            var aFloat, bFloat float64

            aFloat, _ = toFloat64(a)
            bFloat, _ = toFloat64(b)

            return aFloat * bFloat
        },
        "div": func(a, b interface{}) float64 {
            var aFloat, bFloat float64
            aFloat, _ = toFloat64(a)
			bFloat, _ = toFloat64(b)
			return aFloat / bFloat
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
		"dict": func(values ...interface{}) map[string]interface{} {
			if len(values)%2 != 0 {
				return nil
			}
			dict := make(map[string]interface{})
			for i := 0; i < len(values); i += 2 {
				key, ok := values[i].(string)
				if !ok {
					return nil
				}
				dict[key] = values[i+1]
			}
			return dict
		},
	}
}
