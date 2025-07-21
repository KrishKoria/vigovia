import { ItineraryFormData } from "./schema";
import { ErrorCategory, ErrorSeverity } from "./errorHandler";

export interface ValidationResult {
  isValid: boolean;
  errors: FieldValidationError[];
  summary: string;
}

export interface FieldValidationError {
  field: string;
  message: string;
  value?: any;
  severity: "error" | "warning";
}

export function validateItineraryForm(
  data: ItineraryFormData
): ValidationResult {
  const errors: FieldValidationError[] = [];

  if (!data.tripTitle?.trim()) {
    errors.push({
      field: "tripTitle",
      message: "Trip title is required",
      value: data.tripTitle,
      severity: "error",
    });
  } else if (data.tripTitle.length < 3) {
    errors.push({
      field: "tripTitle",
      message: "Trip title must be at least 3 characters long",
      value: data.tripTitle,
      severity: "error",
    });
  }

  if (!data.destination?.trim()) {
    errors.push({
      field: "destination",
      message: "Destination is required",
      value: data.destination,
      severity: "error",
    });
  }

  // Date Validation
  if (!data.startDate) {
    errors.push({
      field: "startDate",
      message: "Start date is required",
      value: data.startDate,
      severity: "error",
    });
  }

  if (!data.endDate) {
    errors.push({
      field: "endDate",
      message: "End date is required",
      value: data.endDate,
      severity: "error",
    });
  }

  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate >= endDate) {
      errors.push({
        field: "endDate",
        message: "End date must be after start date",
        value: data.endDate,
        severity: "error",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      errors.push({
        field: "startDate",
        message: "Start date is in the past",
        value: data.startDate,
        severity: "warning",
      });
    }
  }

  if (!data.numberOfDays || data.numberOfDays < 1) {
    errors.push({
      field: "numberOfDays",
      message: "Number of days must be at least 1",
      value: data.numberOfDays,
      severity: "error",
    });
  } else if (data.numberOfDays > 30) {
    errors.push({
      field: "numberOfDays",
      message: "Number of days cannot exceed 30",
      value: data.numberOfDays,
      severity: "warning",
    });
  }

  if (!data.numberOfTravellers || data.numberOfTravellers < 1) {
    errors.push({
      field: "numberOfTravellers",
      message: "Number of travellers must be at least 1",
      value: data.numberOfTravellers,
      severity: "error",
    });
  } else if (data.numberOfTravellers > 20) {
    errors.push({
      field: "numberOfTravellers",
      message: "Number of travellers cannot exceed 20",
      value: data.numberOfTravellers,
      severity: "warning",
    });
  }

  if (!data.customerName?.trim()) {
    errors.push({
      field: "customerName",
      message: "Customer name is required",
      value: data.customerName,
      severity: "error",
    });
  } else if (data.customerName.length < 2) {
    errors.push({
      field: "customerName",
      message: "Customer name must be at least 2 characters long",
      value: data.customerName,
      severity: "error",
    });
  }

  if (!data.customerEmail?.trim()) {
    errors.push({
      field: "customerEmail",
      message: "Customer email is required",
      value: data.customerEmail,
      severity: "error",
    });
  } else if (!isValidEmail(data.customerEmail)) {
    errors.push({
      field: "customerEmail",
      message: "Please enter a valid email address",
      value: data.customerEmail,
      severity: "error",
    });
  }

  if (!data.customerPhone?.trim()) {
    errors.push({
      field: "customerPhone",
      message: "Customer phone is required",
      value: data.customerPhone,
      severity: "error",
    });
  } else if (!isValidPhone(data.customerPhone)) {
    errors.push({
      field: "customerPhone",
      message: "Please enter a valid phone number",
      value: data.customerPhone,
      severity: "warning",
    });
  }

  if (!data.days || data.days.length === 0) {
    errors.push({
      field: "days",
      message: "At least one day must be defined",
      value: data.days,
      severity: "error",
    });
  } else {
    data.days.forEach((day, dayIndex) => {
      if (!day.activities || day.activities.length === 0) {
        errors.push({
          field: `days[${dayIndex}].activities`,
          message: `Day ${day.dayNumber} must have at least one activity`,
          value: day.activities,
          severity: "warning",
        });
      } else {
        day.activities.forEach((activity, activityIndex) => {
          if (!activity.name?.trim()) {
            errors.push({
              field: `days[${dayIndex}].activities[${activityIndex}].name`,
              message: `Activity name is required for Day ${day.dayNumber}`,
              value: activity.name,
              severity: "error",
            });
          }

          if (activity.price < 0) {
            errors.push({
              field: `days[${dayIndex}].activities[${activityIndex}].price`,
              message: `Activity price cannot be negative for Day ${day.dayNumber}`,
              value: activity.price,
              severity: "error",
            });
          }
        });
      }
    });
  }

  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  let summary = "";
  if (errorCount > 0) {
    summary = `${errorCount} error${errorCount > 1 ? "s" : ""} found`;
    if (warningCount > 0) {
      summary += ` and ${warningCount} warning${warningCount > 1 ? "s" : ""}`;
    }
  } else if (warningCount > 0) {
    summary = `${warningCount} warning${warningCount > 1 ? "s" : ""} found`;
  } else {
    summary = "Form validation passed";
  }

  return {
    isValid: errorCount === 0,
    errors,
    summary,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");

  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function getFieldDisplayName(fieldPath: string): string {
  const fieldMappings: Record<string, string> = {
    tripTitle: "Trip Title",
    destination: "Destination",
    startDate: "Start Date",
    endDate: "End Date",
    numberOfDays: "Number of Days",
    numberOfTravellers: "Number of Travellers",
    customerName: "Customer Name",
    customerEmail: "Customer Email",
    customerPhone: "Customer Phone",
  };

  const baseField = fieldPath.split("[")[0].split(".")[0];

  if (fieldMappings[baseField]) {
    return fieldMappings[baseField];
  }

  return fieldPath
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function convertToErrorHandlerFormat(
  validationResult: ValidationResult
) {
  const fieldErrors = validationResult.errors
    .filter((e) => e.severity === "error")
    .map((e) => ({
      field: getFieldDisplayName(e.field),
      message: e.message,
    }));

  return {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    message: validationResult.summary,
    userMessage: `Form validation failed: ${validationResult.summary}`,
    suggestions: [
      "Please fix all required fields",
      "Verify email addresses are valid",
      "Ensure all required information is provided",
    ],
    canRetry: true,
    fallbackAvailable: false,
    fieldErrors,
  };
}
