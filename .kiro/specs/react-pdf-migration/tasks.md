# Implementation Plan

- [ ] 1. Setup react-pdf infrastructure and dependencies

  - Install @react-pdf/renderer package (from diegomura/react-pdf) for PDF creation, NOT wojtekmaj/react-pdf
  - Command: `pnpm add @react-pdf/renderer`
  - Remove jsPDF, html2canvas, and related dependencies from package.json
  - Import Document, Page, View, Text, StyleSheet from @react-pdf/renderer
  - Create basic PDF document structure with Document and Page components
  - Set up TypeScript types for react-pdf components
  - _Requirements: 1.1, 1.2_

- [ ] 2. Create data transformation utilities

  - Write function to transform ItineraryFormData to PDF-compatible data structure
  - Implement data validation and default value handling for missing fields
  - Create utility functions for date formatting and price calculations
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Convert ItineraryHeader component to react-pdf

  - Replace HTML elements with react-pdf View and Text components
  - Convert gradient background and styling to react-pdf StyleSheet
  - Implement dynamic data rendering from form instead of hardcoded values
  - _Requirements: 3.1, 4.1, 4.3_

- [ ] 4. Convert TripDetails component to react-pdf

  - Replace Card component with react-pdf View layout
  - Convert grid layout to flexbox-based layout using react-pdf
  - Implement dynamic data binding for trip information
  - _Requirements: 3.1, 4.1, 4.5_

- [ ] 5. Convert DayItinerary component to react-pdf

  - Replace HTML timeline structure with react-pdf View components
  - Implement timeline circles and connecting lines using react-pdf styling
  - Convert activity cards layout to react-pdf compatible structure
  - Handle dynamic activity data rendering with proper error handling
  - _Requirements: 3.2, 4.1, 4.5_

- [ ] 6. Convert table-based components to react-pdf
- [ ] 6.1 Convert FlightSummary component

  - Replace Card and table structure with react-pdf View layout
  - Implement table-like layout using flexDirection and borders
  - Add dynamic flight data rendering from form data
  - _Requirements: 3.4, 4.1, 4.5_

- [ ] 6.2 Convert HotelBookings component

  - Replace HTML table with react-pdf View-based table layout
  - Implement header row and data row styling
  - Add dynamic hotel data rendering and notes section
  - _Requirements: 3.4, 4.1, 4.5_

- [ ] 6.3 Convert ActivityTable component

  - Replace HTML grid with react-pdf table layout
  - Implement dynamic activity data from form days
  - Add proper column alignment and styling
  - _Requirements: 3.4, 4.1, 4.5_

- [ ] 7. Convert remaining content components
- [ ] 7.1 Convert ImportantNotes component

  - Replace Card component with react-pdf View
  - Implement table layout for notes display
  - Add dynamic notes content rendering
  - _Requirements: 3.4, 4.1_

- [ ] 7.2 Convert ScopeOfService component

  - Replace HTML table with react-pdf View layout
  - Implement service details table structure
  - Add dynamic service data rendering
  - _Requirements: 3.4, 4.1_

- [ ] 7.3 Convert InclusionSummary component

  - Replace Card and table with react-pdf View layout
  - Implement inclusion details table with proper styling
  - Add dynamic inclusion data rendering
  - _Requirements: 3.4, 4.1_

- [ ] 8. Convert PaymentPlan component to react-pdf

  - Replace Card component with react-pdf View layout
  - Implement payment installments table structure
  - Add dynamic payment data rendering with proper formatting
  - _Requirements: 3.4, 4.1, 4.5_

- [ ] 9. Convert VisaDetails component to react-pdf

  - Replace Card component with react-pdf View
  - Implement visa information layout and styling
  - Add dynamic visa data rendering and Book Now section
  - _Requirements: 3.4, 4.1, 4.5_

- [ ] 10. Convert Footer component to react-pdf

  - Replace HTML div structure with react-pdf View layout
  - Implement company information and branding layout
  - Add proper footer styling to match current design
  - _Requirements: 3.5, 4.1_

- [ ] 11. Create main PDF document component

  - Combine all converted components into single PDF Document
  - Implement proper page layout and spacing
  - Add page breaks where necessary for long content
  - Handle dynamic data flow to all child components
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 12. Update PDF generation function

  - Replace jsPDF implementation with react-pdf rendering
  - Implement pdf().toBlob() for browser-based PDF generation
  - Add proper error handling and user feedback
  - Implement file naming logic based on form data
  - _Requirements: 1.1, 1.4, 4.4, 5.2_

- [ ] 13. Integrate form data with PDF generation

  - Update generateItineraryPDF function to accept form data
  - Remove all hardcoded sample data from PDF components
  - Implement data transformation before passing to PDF components
  - Add validation for required fields before PDF generation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 14. Implement comprehensive error handling

  - Add try-catch blocks around PDF generation process
  - Implement user-friendly error messages for common failures
  - Add loading states and progress indicators
  - Handle edge cases like missing images or invalid data
  - _Requirements: 4.4, 5.2, 5.3_

- [ ] 15. Add image handling for PDF components

  - Implement proper image embedding in react-pdf
  - Add fallback handling for missing activity images
  - Optimize image sizes for PDF generation performance
  - Test image compatibility across different formats
  - _Requirements: 5.4, 5.5_

- [ ] 16. Performance optimization and testing

  - Optimize PDF generation speed for large itineraries
  - Test with various data sizes and combinations
  - Implement memory management for large PDF generation
  - Add performance monitoring and logging
  - _Requirements: 5.1, 5.3, 5.5_

- [ ] 17. Visual consistency verification

  - Compare generated PDFs with current design pixel by pixel
  - Adjust styling to match exact colors, fonts, and spacing
  - Test PDF rendering across different PDF viewers
  - Ensure responsive layout works for different content sizes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 18. Clean up and remove old dependencies
  - Remove jsPDF and html2canvas dependencies from package.json
  - Remove old PDF generation code and unused imports
  - Update any remaining references to old PDF system
  - Clean up unused CSS classes and styling
  - _Requirements: 1.2_
