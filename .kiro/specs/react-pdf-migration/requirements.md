# Requirements Document

## Introduction

This feature involves migrating the existing PDF generation system from jsPDF + html2canvas to react-pdf (@react-pdf/renderer) while maintaining the same visual layout and functionality. The current system uses hardcoded data in TravelItinerary.tsx components and generates PDFs by converting HTML to canvas then to PDF. The new system should use react-pdf's native PDF generation capabilities with dynamic data from the ItineraryForm.tsx.

## Requirements

### Requirement 1

**User Story:** As a travel agent, I want to generate PDF itineraries using react-pdf instead of jsPDF, so that I get better performance, smaller file sizes, and more reliable PDF generation.

#### Acceptance Criteria

1. WHEN the user clicks "Generate Itinerary" THEN the system SHALL use @react-pdf/renderer to create the PDF
2. WHEN PDF generation is triggered THEN the system SHALL NOT use jsPDF or html2canvas libraries
3. WHEN the PDF is generated THEN it SHALL maintain the same visual layout as the current TravelItinerary.tsx components
4. WHEN the PDF generation completes THEN the system SHALL automatically download the PDF file with a descriptive filename

### Requirement 2

**User Story:** As a travel agent, I want the PDF to use dynamic data from the form instead of hardcoded values, so that each generated itinerary reflects the actual trip details entered.

#### Acceptance Criteria

1. WHEN the form is submitted THEN the system SHALL pass the form data to the PDF generation function
2. WHEN generating the PDF THEN the system SHALL NOT use any hardcoded sample data
3. WHEN the PDF is created THEN it SHALL display the customer name, trip title, destination, dates, and activities from the form
4. WHEN activities are added to days THEN they SHALL appear in the PDF with correct pricing, descriptions, and images
5. WHEN transfers or flights are added THEN they SHALL be included in the appropriate PDF sections

### Requirement 3

**User Story:** As a travel agent, I want the PDF styling to match the current design exactly, so that the visual consistency is maintained after the migration.

#### Acceptance Criteria

1. WHEN the PDF is generated THEN the header SHALL use the same gradient background and layout as TravelItinerary.tsx
2. WHEN displaying daily itineraries THEN the timeline design with circles and connecting lines SHALL be preserved
3. WHEN showing activity cards THEN they SHALL maintain the same layout with image, details, and pricing sections
4. WHEN rendering tables THEN they SHALL use the same styling for flight summaries, hotel bookings, and other tabular data
5. WHEN displaying the footer THEN it SHALL maintain the same company information layout and styling

### Requirement 4

**User Story:** As a developer, I want to reuse the existing PDF components and convert them to work with react-pdf, so that code duplication is minimized and maintenance is simplified.

#### Acceptance Criteria

1. WHEN converting components THEN the system SHALL modify the existing PDF components (ItineraryHeader, DayItinerary, FlightSummary, etc.) to work with react-pdf
2. WHEN updating components THEN they SHALL use react-pdf's View, Text, and StyleSheet instead of HTML elements and CSS classes
3. WHEN styling components THEN the system SHALL convert existing styles to react-pdf's StyleSheet.create format
4. WHEN the PDF generation function is called THEN it SHALL handle errors gracefully and provide meaningful error messages
5. WHEN components are converted THEN they SHALL maintain the same prop interfaces for dynamic data rendering

### Requirement 5

**User Story:** As a travel agent, I want the PDF generation to be fast and reliable, so that I can quickly provide itineraries to customers without technical issues.

#### Acceptance Criteria

1. WHEN generating a PDF THEN the process SHALL complete within 10 seconds for typical itineraries
2. WHEN the PDF generation fails THEN the system SHALL display a clear error message to the user
3. WHEN large amounts of data are processed THEN the system SHALL handle them without crashing
4. WHEN images are included THEN they SHALL be properly embedded in the PDF without breaking the layout
5. WHEN the PDF is generated THEN it SHALL be compatible with standard PDF viewers
