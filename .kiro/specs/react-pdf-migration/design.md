# Design Document

## Overview

This design outlines the migration from jsPDF + html2canvas to react-pdf (@react-pdf/renderer) for PDF generation. The approach focuses on converting existing React components to react-pdf compatible components while maintaining visual consistency and implementing dynamic data flow from the form.

## Architecture

### Current Architecture

```
ItineraryForm.tsx → generateItineraryPDF() → jsPDF + html2canvas → PDF Download
                                        ↑
                                TravelItinerary.tsx (hardcoded data)
```

### New Architecture

```
ItineraryForm.tsx → generateItineraryPDF() → @react-pdf/renderer → PDF Download
                                        ↑
                            React-PDF Components (dynamic data)
```

### Key Changes

1. **PDF Generation Engine**: Replace jsPDF with @react-pdf/renderer
2. **Component Conversion**: Convert existing components to use react-pdf primitives
3. **Data Flow**: Pass form data directly to PDF components instead of using hardcoded data
4. **Styling System**: Convert CSS classes to react-pdf StyleSheet

## Components and Interfaces

### Core PDF Components (to be converted)

#### 1. PDFItineraryHeader

- **Current**: Uses HTML div, gradient CSS classes
- **New**: Uses react-pdf View with gradient styles
- **Props**: `{ customerName, destination, duration, planCode }`

#### 2. PDFDayItinerary

- **Current**: Uses HTML div, CSS flexbox
- **New**: Uses react-pdf View with flexDirection
- **Props**: `{ day, date, title, image, timeline }`

#### 3. PDFFlightSummary

- **Current**: Uses Card component with CSS grid
- **New**: Uses react-pdf View with table-like layout
- **Props**: `{ flights }`

#### 4. PDFHotelBookings

- **Current**: Uses Card component with CSS grid
- **New**: Uses react-pdf View with table-like layout
- **Props**: `{ hotels }`

#### 5. PDFActivityTable

- **Current**: Uses Card component with CSS grid
- **New**: Uses react-pdf View with table-like layout
- **Props**: `{ activities }`

#### 6. PDFPaymentPlan

- **Current**: Uses Card component with CSS styling
- **New**: Uses react-pdf View with custom styling
- **Props**: `{ totalAmount, tcs, installments }`

#### 7. PDFFooter

- **Current**: Uses HTML div with company info
- **New**: Uses react-pdf View with text components
- **Props**: `{ companyName, address, phone, email }`

### PDF Document Structure

```jsx
<Document>
  <Page size="A4" style={styles.page}>
    <PDFItineraryHeader {...headerData} />
    <PDFTripDetails {...tripData} />
    {days.map((day) => (
      <PDFDayItinerary key={day.id} {...day} />
    ))}
    <PDFFlightSummary flights={flights} />
    <PDFHotelBookings hotels={hotels} />
    <PDFImportantNotes notes={notes} />
    <PDFScopeOfService services={services} />
    <PDFInclusionSummary inclusions={inclusions} />
    <PDFActivityTable activities={activities} />
    <PDFPaymentPlan {...paymentData} />
    <PDFVisaDetails {...visaData} />
    <PDFFooter {...footerData} />
  </Page>
</Document>
```

## Data Models

### Form Data Interface (existing)

```typescript
interface ItineraryFormData {
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  days: DayData[];
}

interface DayData {
  dayNumber: number;
  date: string;
  activities: Activity[];
  transfers?: Transfer[];
  flights?: Flight[];
}
```

### PDF Data Transformation

The form data will be transformed into the format expected by PDF components:

```typescript
interface PDFData {
  header: {
    customerName: string;
    destination: string;
    duration: string;
  };
  tripDetails: {
    departureFrom: string;
    departureDate: string;
    arrivalDate: string;
    destination: string;
    travelers: number;
  };
  itinerary: PDFDayData[];
  flights: PDFFlightData[];
  hotels: PDFHotelData[];
  // ... other sections
}
```

## Styling Strategy

### React-PDF StyleSheet Approach

Convert existing Tailwind/CSS classes to react-pdf styles:

```typescript
const styles = StyleSheet.create({
  // Header styles
  header: {
    background: "linear-gradient(135deg, #541C9C 0%, #680099 100%)",
    color: "#FBF4FF",
    padding: 25,
    borderRadius: 16,
  },

  // Timeline styles
  timelineContainer: {
    flexDirection: "row",
    marginBottom: 50,
  },

  timelineCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#541C9C",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // Table styles
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4A148C",
    color: "#FBF4FF",
    padding: 12,
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: 12,
  },
});
```

### Color Palette Mapping

```typescript
const colors = {
  primary: "#541C9C", // vigovia-dark
  secondary: "#680099", // vigovia-cta
  accent: "#936FE0", // vigovia-accent
  light: "#FBF4FF", // vigovia-light
  background: "#ffffff",
  text: "#321E5D",
  border: "#ddd",
};
```

## Error Handling

### PDF Generation Error Handling

```typescript
try {
  const pdfBlob = await pdf(<PDFDocument data={transformedData} />).toBlob();

  // Download logic
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = generateFileName(data);
  link.click();
} catch (error) {
  console.error("PDF generation failed:", error);
  // Show user-friendly error message
  setError("Failed to generate PDF. Please try again.");
}
```

### Component Error Boundaries

Each PDF component should handle missing data gracefully:

```typescript
const PDFFlightSummary = ({ flights = [] }) => {
  if (!flights.length) {
    return (
      <View style={styles.emptySection}>
        <Text>No flights scheduled</Text>
      </View>
    );
  }

  return <View style={styles.flightSection}>{/* Flight content */}</View>;
};
```

## Testing Strategy

### Unit Testing

- Test each PDF component with various data inputs
- Test data transformation functions
- Test error handling scenarios

### Integration Testing

- Test complete PDF generation flow
- Test with different form data combinations
- Test file download functionality

### Visual Testing

- Compare generated PDFs with current design
- Test on different devices/browsers
- Verify PDF compatibility across viewers

### Performance Testing

- Measure PDF generation time
- Test with large datasets
- Monitor memory usage during generation

## Implementation Phases

### Phase 1: Setup and Core Infrastructure

- Install @react-pdf/renderer
- Create basic PDF document structure
- Set up data transformation utilities

### Phase 2: Component Conversion

- Convert header and basic layout components
- Implement styling system
- Test basic PDF generation

### Phase 3: Complex Components

- Convert timeline and activity components
- Implement table layouts
- Add image handling

### Phase 4: Integration and Polish

- Connect form data to PDF generation
- Implement error handling
- Add file naming and download logic

### Phase 5: Testing and Optimization

- Comprehensive testing
- Performance optimization
- Visual consistency verification
