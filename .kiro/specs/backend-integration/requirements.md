# Requirements Document

## Introduction

This feature will integrate the existing frontend itinerary form with the Go backend API for PDF generation. The frontend currently generates PDFs using a client-side solution, but we need to add support for backend PDF generation while maintaining the existing functionality. This requires creating a data transformation layer to convert the frontend form data structure to the backend's expected format and adding appropriate default values for missing fields.

## Requirements

### Requirement 1

**User Story:** As a user filling out the itinerary form, I want to have the option to generate PDFs using either the existing client-side method or the new backend API, so that I have flexibility in PDF generation methods.

#### Acceptance Criteria

1. WHEN the user completes the itinerary form THEN they SHALL see two PDF generation buttons: "Generate PDF (Client)" and "Generate PDF (Backend)"
2. WHEN the user clicks "Generate PDF (Client)" THEN the system SHALL use the existing client-side PDF generation method
3. WHEN the user clicks "Generate PDF (Backend)" THEN the system SHALL send the transformed data to the backend API
4. IF the backend generation fails THEN the system SHALL display an appropriate error message and allow the user to try the client-side method

### Requirement 2

**User Story:** As a developer, I want a data transformation layer that converts frontend form data to backend API format, so that the two systems can communicate properly.

#### Acceptance Criteria

1. WHEN frontend form data is submitted for backend processing THEN the system SHALL transform the data structure from ItineraryFormData to ItineraryRequest format
2. WHEN transforming customer data THEN the system SHALL map customerName, customerEmail, customerPhone to the customer object structure
3. WHEN transforming trip data THEN the system SHALL map tripTitle, destination, startDate, endDate, numberOfTravellers to the trip object and calculate duration string
4. WHEN transforming days data THEN the system SHALL convert the days array structure to match backend expectations with proper activity, transfer, and flight mapping
5. WHEN required backend fields are missing from frontend data THEN the system SHALL provide appropriate default values

### Requirement 3

**User Story:** As a developer, I want proper error handling and environment configuration for backend integration, so that the system is robust and configurable.

#### Acceptance Criteria

1. WHEN the backend URL is not configured THEN the system SHALL use a default localhost URL for development
2. WHEN the backend API call fails THEN the system SHALL provide detailed error messages to help with debugging
3. WHEN network errors occur THEN the system SHALL handle them gracefully and suggest fallback options
4. WHEN the backend returns validation errors THEN the system SHALL display field-specific error messages

### Requirement 4

**User Story:** As a user, I want the backend PDF generation to provide the same user experience as the client-side generation, so that the interface feels consistent.

#### Acceptance Criteria

1. WHEN backend PDF generation is in progress THEN the system SHALL show a loading state with appropriate messaging
2. WHEN backend PDF generation completes successfully THEN the system SHALL automatically download the PDF file
3. WHEN the PDF is downloaded THEN the filename SHALL follow the same naming convention as the client-side generation
4. WHEN backend generation takes longer than expected THEN the system SHALL provide progress feedback to the user

### Requirement 5

**User Story:** As a developer, I want comprehensive default values for backend-specific fields, so that the transformation works even when frontend data is minimal.

#### Acceptance Criteria

1. WHEN trip.departureFrom is not provided THEN the system SHALL use a default value based on the destination or "Not specified"
2. WHEN hotels array is empty THEN the system SHALL provide an empty array with proper structure
3. WHEN payment information is not provided THEN the system SHALL create default payment structure with placeholder values
4. WHEN config, companyInfo, importantNotes, scopeOfService, inclusions, and visaDetails are not provided THEN the system SHALL use appropriate default values
5. WHEN activity type and time fields are missing THEN the system SHALL provide default values based on activity data
