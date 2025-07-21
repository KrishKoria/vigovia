package utils

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/KrishKoria/Vigovia/models"
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

func ValidateStruct(s interface{}) []models.APIError {
	var errors []models.APIError
	
	err := validate.Struct(s)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			apiError := models.APIError{
				Field:   getJSONFieldName(s, err.Field()),
				Message: getValidationMessage(err),
				Code:    "VALIDATION_ERROR",
			}
			errors = append(errors, apiError)
		}
	}
	
	return errors
}

func getJSONFieldName(s interface{}, fieldName string) string {
	t := reflect.TypeOf(s)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}
	
	field, found := t.FieldByName(fieldName)
	if !found {
		return fieldName
	}
	
	jsonTag := field.Tag.Get("json")
	if jsonTag == "" {
		return fieldName
	}
	
	parts := strings.Split(jsonTag, ",")
	return parts[0]
}

func getValidationMessage(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", err.Field())
	case "email":
		return "Must be a valid email address"
	case "min":
		if err.Kind() == reflect.String {
			return fmt.Sprintf("Must be at least %s characters long", err.Param())
		}
		return fmt.Sprintf("Must be at least %s", err.Param())
	case "max":
		if err.Kind() == reflect.String {
			return fmt.Sprintf("Must be no more than %s characters long", err.Param())
		}
		return fmt.Sprintf("Must be no more than %s", err.Param())
	case "len":
		return fmt.Sprintf("Must be exactly %s characters long", err.Param())
	case "gt":
		return fmt.Sprintf("Must be greater than %s", err.Param())
	case "gte":
		return fmt.Sprintf("Must be greater than or equal to %s", err.Param())
	case "lt":
		return fmt.Sprintf("Must be less than %s", err.Param())
	case "lte":
		return fmt.Sprintf("Must be less than or equal to %s", err.Param())
	case "oneof":
		return fmt.Sprintf("Must be one of: %s", err.Param())
	case "url":
		return "Must be a valid URL"
	case "uuid":
		return "Must be a valid UUID"
	case "alphanum":
		return "Must contain only letters and numbers"
	case "alpha":
		return "Must contain only letters"
	case "numeric":
		return "Must contain only numbers"
	default:
		return fmt.Sprintf("Invalid value for %s", err.Field())
	}
}

