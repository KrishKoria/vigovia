# Data Transformation Examples

This document provides comprehensive examples of data transformation mappings between frontend and backend formats for the itinerary application.

## Table of Contents

- [Overview](#overview)
- [Complete Transformation Example](#complete-transformation-example)
- [Customer Data Transformation](#customer-data-transformation)
- [Trip Data Transformation](#trip-data-transformation)
- [Activity Transformation](#activity-transformation)
- [Flight Extraction](#flight-extraction)
- [Transfer Transformation](#transfer-transformation)
- [Default Values Examples](#default-values-examples)
- [Edge Cases](#edge-cases)
- [Validation Examples](#validation-examples)

## Overview

The data transformation layer converts frontend `ItineraryFormData` to backend `ItineraryRequest` format. This document provides detailed examples of each transformation type with real-world data.

## Complete Transformation Example

### Frontend Input Data

```typescript
const frontendData: ItineraryFormData = {
  customerName: "Sarah Johnson",
  customerEmail: "sarah.johnson@email.com",
  customerPhone: "+1-555-0123",
  tripTitle: "Amazing Singapore Adventure",
  destination: "Singapore",
  startDate: "2024-04-15",
  endDate: "2024-04-20",
  numberOfTravellers: 2,
  days: [
    {
      dayNumber: 1,
      date: "2024-04-15",
      activities: [
        {
          id: "act1",
          name: "Marina Bay Sands SkyPark",
          description: "Observation deck with stunning city views",
          location: "Marina Bay Sands",
          duration: "2 hours",
          price: 28,
          image: "https://example.com/marina-bay.jpg",
        },
        {
          id: "act2",
          name: "Gardens by the Bay",
          description: "Futuristic botanical gardens with supertrees",
          location: "Gardens by the Bay",
          duration: "3 hours",
          price: 15,
          image: "https://example.com/gardens.jpg",
        },
      ],
      transfers: [
        {
          id: "trans1",
          type: "Airport Transfer",
          from: "Changi Airport",
          to: "Marina Bay Hotel",
          pickupTime: "14:00",
          dropoffTime: "15:00",
          duration: "45 minutes",
          price: 35,
          capacity: 4,
        },
      ],
      flights: [
        {
          id: "flight1",
          airline: "Singapore Airlines",
          flightNumber: "SQ401",
          from: "DEL",
          to: "SIN",
          departure: "08:30",
          arrival: "16:45",
          class: "Economy",
          price: 650,
        },
      ],
    },
    {
      dayNumber: 2,
      date: "2024-04-16",
      activities: [
        {
          id: "act3",
          name: "Hawker Center Food Tour",
          description: "Authentic local food experience",
          location: "Maxwell Food Centre",
          duration: "2.5 hours",
          price: 45,
          image: "https://example.com/food-tour.jpg",
        },
      ],
      transfers: [],
      flights: [],
    },
  ],
};
```

### Backend Output Data

```typescript
const backendData: ItineraryRequest = {
  customer: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0123",
  },
  trip: {
    title: "Amazing Singapore Adventure",
    destination: "Singapore",
    startDate: "2024-04-15",
    endDate: "2024-04-20",
    duration: "6 Days 5 Nights", // Calculated
    travelers: 2,
    departureFrom: "New Delhi", // Context-aware default
  },
  itinerary: {
    days: [
      {
        dayNumber: 1,
        date: "2024-04-15",
        title: "Marina Bay Sands SkyPark", // Generated from first activity
        activities: [
          {
            id: "act1",
            name: "Marina Bay Sands SkyPark",
            description: "Observation deck with stunning city views",
            location: "Marina Bay Sands",
            duration: "2 hours",
            price: 28,
            image: "https://example.com/marina-bay.jpg",
            type: "sightseeing", // Auto-determined
            time: "09:00", // Default for sightseeing
          },
          {
            id: "act2",
            name: "Gardens by the Bay",
            description: "Futuristic botanical gardens with supertrees",
            location: "Gardens by the Bay",
            duration: "3 hours",
            price: 15,
            image: "https://example.com/gardens.jpg",
            type: "nature", // Auto-determined from "gardens"
            time: "08:30", // Default for nature activities
          },
        ],
        transfers: [
          {
            id: "trans1",
            type: "Airport Transfer",
            from: "Changi Airport",
            to: "Marina Bay Hotel",
            pickupTime: "14:00",
            dropoffTime: "15:00",
            duration: "45 minutes",
            price: 35,
            capacity: 4,
          },
        ],
        flights: [
          {
            id: "flight1",
            date: "2024-04-15", // Mapped from day
            airline: "Singapore Airlines",
            flightNumber: "SQ401",
            route: "DEL to SIN", // Generated
            from: "DEL",
            to: "SIN",
            departure: "08:30",
            arrival: "16:45",
            class: "Economy",
            price: 650,
          },
        ],
        image: "https://example.com/marina-bay.jpg", // From first activity
        timeline: [
          {
            time: "Full Day",
            activities: [
              "Marina Bay Sands SkyPark at Marina Bay Sands (2 hours)",
              "Gardens by the Bay at Gardens by the Bay (3 hours)",
            ],
          },
        ],
      },
      {
        dayNumber: 2,
        date: "2024-04-16",
        title: "Hawker Center Food Tour",
        activities: [
          {
            id: "act3",
            name: "Hawker Center Food Tour",
            description: "Authentic local food experience",
            location: "Maxwell Food Centre",
            duration: "2.5 hours",
            price: 45,
            image: "https://example.com/food-tour.jpg",
            type: "dining", // Auto-determined from "food"
            time: "19:00", // Default for dining
          },
        ],
        transfers: [],
        flights: [],
        image: "https://example.com/food-tour.jpg",
        timeline: [
          {
            time: "Full Day",
            activities: [
              "Hawker Center Food Tour at Maxwell Food Centre (2.5 hours)",
            ],
          },
        ],
      },
    ],
  },
  flights: [
    {
      id: "flight1",
      date: "2024-04-15", // Extracted from day 1
      airline: "Singapore Airlines",
      flightNumber: "SQ401",
      route: "DEL to SIN",
      from: "DEL",
      to: "SIN",
      departure: "08:30",
      arrival: "16:45",
      class: "Economy",
      price: 650,
    },
  ],
  hotels: [], // Empty array as per requirements
  payment: {
    totalAmount: "0.00",
    tcs: "0.00",
    advanceAmount: "0.00",
    balanceAmount: "0.00",
    status: "pending",
    installments: [
      {
        installment: "Advance Payment",
        amount: "0.00",
        dueDate: "2024-04-15",
      },
    ],
  },
  config: {
    includeFlights: true,
    includeHotels: true,
    includeActivities: true,
    includePayments: true,
    pageFormat: "A4",
    orientation: "portrait",
    customBranding: {
      primaryColor: "#541C9C",
      accentColor: "#936FE0",
      logoUrl: "",
      companyName: "Travel Agency",
    },
  },
  companyInfo: {
    name: "Travel Agency",
    registeredOffice: {
      address: "123 Business Street",
      city: "Business City",
      state: "Business State",
      country: "Country",
    },
    contact: {
      phone: "+1-234-567-8900",
      email: "info@travelagency.com",
    },
    logo: "",
  },
  importantNotes: [
    {
      point: "Travel Documents",
      details: "Please ensure all travel documents are valid and up to date.",
    },
    {
      point: "Weather Conditions",
      details: "Check weather conditions before travel and pack accordingly.",
    },
    {
      point: "Local Customs",
      details: "Respect local customs and traditions during your visit.",
    },
    {
      point: "Emergency Contacts",
      details: "Keep emergency contact numbers readily available.",
    },
  ],
  scopeOfService: [
    {
      service: "Accommodation",
      details: "Hotel bookings and accommodation arrangements",
    },
    {
      service: "Transportation",
      details: "Airport transfers and local transportation",
    },
    {
      service: "Activities",
      details: "Sightseeing tours and activity bookings",
    },
    {
      service: "Support",
      details: "24/7 customer support during travel",
    },
  ],
  inclusions: [
    {
      category: "Accommodation",
      count: 1,
      details: "Hotel stay as per itinerary",
      status: "included",
    },
    {
      category: "Meals",
      count: 1,
      details: "Breakfast included",
      status: "included",
    },
    {
      category: "Transportation",
      count: 1,
      details: "Airport transfers",
      status: "included",
    },
    {
      category: "Activities",
      count: 1,
      details: "Sightseeing tours as mentioned",
      status: "included",
    },
  ],
  visaDetails: {
    visaType: "Tourist Visa",
    validity: "30 days",
    processingDate: "5-7 working days",
  },
};
```

## Customer Data Transformation

### Simple Customer Data

```typescript
// Frontend
const customerData = {
  customerName: "John Smith",
  customerEmail: "john.smith@example.com",
  customerPhone: "+44-20-7946-0958",
};

// Backend
const transformedCustomer = {
  customer: {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+44-20-7946-0958",
  },
};
```

### Customer Data with Special Characters

```typescript
// Frontend
const customerData = {
  customerName: "María José García-López",
  customerEmail: "maria.garcia@correo.es",
  customerPhone: "+34-91-123-4567",
};

// Backend
const transformedCustomer = {
  customer: {
    name: "María José García-López",
    email: "maria.garcia@correo.es",
    phone: "+34-91-123-4567",
  },
};
```

## Trip Data Transformation

### Basic Trip Data

```typescript
// Frontend
const tripData = {
  tripTitle: "European Grand Tour",
  destination: "Europe",
  startDate: "2024-06-01",
  endDate: "2024-06-15",
  numberOfTravellers: 4,
};

// Backend
const transformedTrip = {
  trip: {
    title: "European Grand Tour",
    destination: "Europe",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    duration: "15 Days 14 Nights", // Calculated
    travelers: 4,
    departureFrom: "Delhi", // Default for Europe
  },
};
```

### Duration Calculation Examples

```typescript
// Same day trip
calculateDuration("2024-06-01", "2024-06-01"); // "1 Days 0 Nights"

// Weekend trip
calculateDuration("2024-06-01", "2024-06-03"); // "3 Days 2 Nights"

// Week-long trip
calculateDuration("2024-06-01", "2024-06-08"); // "8 Days 7 Nights"

// Month-long trip
calculateDuration("2024-06-01", "2024-07-01"); // "31 Days 30 Nights"
```

### Departure Location Mapping

```typescript
// Context-aware departure locations
getDefaultDepartureFrom("Singapore"); // "New Delhi"
getDefaultDepartureFrom("Thailand"); // "Mumbai"
getDefaultDepartureFrom("Malaysia"); // "Chennai"
getDefaultDepartureFrom("Dubai"); // "Mumbai"
getDefaultDepartureFrom("Europe"); // "Delhi"
getDefaultDepartureFrom("USA"); // "Mumbai"
getDefaultDepartureFrom("Unknown Destination"); // "Delhi" (fallback)
```

## Activity Transformation

### Sightseeing Activity

```typescript
// Frontend
const activity = {
  id: "act1",
  name: "Eiffel Tower Visit",
  description: "Iconic iron tower with city views",
  location: "Champ de Mars, Paris",
  duration: "2 hours",
  price: 25,
  image: "https://example.com/eiffel.jpg",
};

// Backend (Enhanced)
const transformedActivity = {
  id: "act1",
  name: "Eiffel Tower Visit",
  description: "Iconic iron tower with city views",
  location: "Champ de Mars, Paris",
  duration: "2 hours",
  price: 25,
  image: "https://example.com/eiffel.jpg",
  type: "sightseeing", // Auto-determined
  time: "09:00", // Default for sightseeing
};
```

### Food Activity

```typescript
// Frontend
const activity = {
  id: "act2",
  name: "French Cooking Class",
  description: "Learn to cook authentic French cuisine",
  location: "Le Cordon Bleu, Paris",
  duration: "4 hours",
  price: 120,
  image: "https://example.com/cooking.jpg",
};

// Backend (Enhanced)
const transformedActivity = {
  id: "act2",
  name: "French Cooking Class",
  description: "Learn to cook authentic French cuisine",
  location: "Le Cordon Bleu, Paris",
  duration: "4 hours",
  price: 120,
  image: "https://example.com/cooking.jpg",
  type: "dining", // Auto-determined from "cooking"
  time: "19:00", // Default for dining activities
};
```

### Adventure Activity

```typescript
// Frontend
const activity = {
  id: "act3",
  name: "Mountain Trekking",
  description: "Challenging trek through alpine trails",
  location: "Swiss Alps",
  duration: "8 hours",
  price: 85,
  image: "https://example.com/trek.jpg",
};

// Backend (Enhanced)
const transformedActivity = {
  id: "act3",
  name: "Mountain Trekking",
  description: "Challenging trek through alpine trails",
  location: "Swiss Alps",
  duration: "8 hours",
  price: 85,
  image: "https://example.com/trek.jpg",
  type: "adventure", // Auto-determined from "trek"
  time: "08:00", // Default for adventure activities
};
```

### Activity Type Detection Examples

```typescript
// Cultural activities
getDefaultActivityType("Louvre Museum", "Art gallery"); // "cultural"
getDefaultActivityType("Heritage Site", "Historical monument"); // "cultural"

// Adventure activities
getDefaultActivityType("Bungee Jump", "Extreme adventure"); // "adventure"
getDefaultActivityType("Rock Climbing", "Outdoor activity"); // "adventure"

// Dining activities
getDefaultActivityType("Food Tour", "Local cuisine"); // "dining"
getDefaultActivityType("Restaurant Visit", "Fine dining"); // "dining"

// Shopping activities
getDefaultActivityType("Shopping Mall", "Retail therapy"); // "shopping"
getDefaultActivityType("Local Market", "Souvenir shopping"); // "shopping"

// Religious activities
getDefaultActivityType("Temple Visit", "Sacred site"); // "religious"
getDefaultActivityType("Church Tour", "Religious architecture"); // "religious"

// Nature activities
getDefaultActivityType("National Park", "Wildlife viewing"); // "nature"
getDefaultActivityType("Botanical Garden", "Plant collection"); // "nature"

// Default fallback
getDefaultActivityType("Unknown Activity", ""); // "sightseeing"
```

### Activity Time Mapping

```typescript
const timeMappings = {
  cultural: "10:00", // Museums, galleries
  adventure: "08:00", // Early start for adventures
  dining: "19:00", // Evening dining
  shopping: "14:00", // Afternoon shopping
  leisure: "11:00", // Relaxed timing
  religious: "09:00", // Morning visits
  nature: "08:30", // Early for nature
  sightseeing: "09:00", // Standard sightseeing
};
```

## Flight Extraction

### Single Flight Example

```typescript
// Frontend: Flight nested in day
const frontendData = {
  days: [
    {
      date: "2024-05-01",
      flights: [
        {
          id: "flight1",
          airline: "British Airways",
          flightNumber: "BA142",
          from: "LHR",
          to: "CDG",
          departure: "10:30",
          arrival: "13:45",
          class: "Business",
          price: 450,
        },
      ],
    },
  ],
};

// Backend: Flight extracted to top level
const backendData = {
  flights: [
    {
      id: "flight1",
      date: "2024-05-01", // Mapped from day
      airline: "British Airways",
      flightNumber: "BA142",
      route: "LHR to CDG", // Generated
      from: "LHR",
      to: "CDG",
      departure: "10:30",
      arrival: "13:45",
      class: "Business",
      price: 450,
    },
  ],
};
```

### Multiple Flights Example

```typescript
// Frontend: Multiple flights across days
const frontendData = {
  days: [
    {
      date: "2024-05-01",
      flights: [
        {
          id: "flight1",
          airline: "Emirates",
          flightNumber: "EK001",
          from: "DXB",
          to: "LHR",
          departure: "02:30",
          arrival: "07:15",
          class: "Economy",
          price: 650,
        },
      ],
    },
    {
      date: "2024-05-05",
      flights: [
        {
          id: "flight2",
          airline: "Emirates",
          flightNumber: "EK002",
          from: "LHR",
          to: "DXB",
          departure: "21:30",
          arrival: "07:45+1",
          class: "Economy",
          price: 650,
        },
      ],
    },
  ],
};

// Backend: All flights extracted with dates
const backendData = {
  flights: [
    {
      id: "flight1",
      date: "2024-05-01",
      airline: "Emirates",
      flightNumber: "EK001",
      route: "DXB to LHR",
      from: "DXB",
      to: "LHR",
      departure: "02:30",
      arrival: "07:15",
      class: "Economy",
      price: 650,
    },
    {
      id: "flight2",
      date: "2024-05-05",
      airline: "Emirates",
      flightNumber: "EK002",
      route: "LHR to DXB",
      from: "LHR",
      to: "DXB",
      departure: "21:30",
      arrival: "07:45+1",
      class: "Economy",
      price: 650,
    },
  ],
};
```

## Transfer Transformation

### Airport Transfer

```typescript
// Frontend
const transfer = {
  id: "trans1",
  type: "Airport Transfer",
  from: "Heathrow Airport",
  to: "Central London Hotel",
  pickupTime: "08:00",
  dropoffTime: "09:30",
  duration: "90 minutes",
  price: 45,
  capacity: 4,
};

// Backend (Direct mapping - no changes)
const transformedTransfer = {
  id: "trans1",
  type: "Airport Transfer",
  from: "Heathrow Airport",
  to: "Central London Hotel",
  pickupTime: "08:00",
  dropoffTime: "09:30",
  duration: "90 minutes",
  price: 45,
  capacity: 4,
};
```

### City Transfer

```typescript
// Frontend
const transfer = {
  id: "trans2",
  type: "City Transfer",
  from: "Hotel Marriott",
  to: "Eiffel Tower",
  pickupTime: "14:00",
  dropoffTime: "14:45",
  duration: "45 minutes",
  price: 25,
  capacity: 2,
};

// Backend (Direct mapping)
const transformedTransfer = {
  id: "trans2",
  type: "City Transfer",
  from: "Hotel Marriott",
  to: "Eiffel Tower",
  pickupTime: "14:00",
  dropoffTime: "14:45",
  duration: "45 minutes",
  price: 25,
  capacity: 2,
};
```

## Default Values Examples

### Payment Defaults

```typescript
const defaultPayment = {
  totalAmount: "0.00",
  tcs: "0.00",
  advanceAmount: "0.00",
  balanceAmount: "0.00",
  status: "pending",
  installments: [
    {
      installment: "Advance Payment",
      amount: "0.00",
      dueDate: "2024-04-15", // Current date
    },
  ],
};
```

### PDF Configuration Defaults

```typescript
const defaultConfig = {
  includeFlights: true,
  includeHotels: true,
  includeActivities: true,
  includePayments: true,
  pageFormat: "A4",
  orientation: "portrait",
  customBranding: {
    primaryColor: "#541C9C",
    accentColor: "#936FE0",
    logoUrl: "",
    companyName: "Travel Agency",
  },
};
```

### Company Information Defaults

```typescript
const defaultCompanyInfo = {
  name: "Travel Agency",
  registeredOffice: {
    address: "123 Business Street",
    city: "Business City",
    state: "Business State",
    country: "Country",
  },
  contact: {
    phone: "+1-234-567-8900",
    email: "info@travelagency.com",
  },
  logo: "",
};
```

## Edge Cases

### Empty Activities Day

```typescript
// Frontend: Day with no activities
const frontendDay = {
  dayNumber: 3,
  date: "2024-04-17",
  activities: [],
  transfers: [],
  flights: [],
};

// Backend: Generated defaults
const backendDay = {
  dayNumber: 3,
  date: "2024-04-17",
  title: "Day 3", // Generated title
  activities: [],
  transfers: [],
  flights: [],
  image:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format", // Default image
  timeline: [
    {
      time: "Full Day",
      activities: ["Day 3 - Free time"], // Generated timeline
    },
  ],
};
```

### Missing Activity Image

```typescript
// Frontend: Activity without image
const activity = {
  id: "act1",
  name: "Local Market Visit",
  description: "Explore traditional market",
  location: "Central Market",
  duration: "1 hour",
  price: 0,
  // image: undefined
};

// Backend: Default image added
const transformedActivity = {
  id: "act1",
  name: "Local Market Visit",
  description: "Explore traditional market",
  location: "Central Market",
  duration: "1 hour",
  price: 0,
  image:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format", // Default
  type: "shopping", // Auto-determined from "market"
  time: "14:00", // Default for shopping
};
```

### Single Day Trip

```typescript
// Frontend: Same start and end date
const tripData = {
  startDate: "2024-06-15",
  endDate: "2024-06-15",
  // ... other fields
};

// Backend: Calculated duration
const transformedTrip = {
  startDate: "2024-06-15",
  endDate: "2024-06-15",
  duration: "1 Days 0 Nights", // Calculated correctly
  // ... other fields
};
```

### Unknown Destination

```typescript
// Frontend: Unusual destination
const tripData = {
  destination: "Remote Island Paradise",
  // ... other fields
};

// Backend: Fallback departure
const transformedTrip = {
  destination: "Remote Island Paradise",
  departureFrom: "Delhi", // Fallback default
  // ... other fields
};
```

## Validation Examples

### Valid Data

```typescript
const validData = transformToBackendFormat(frontendData);
const validation = validateTransformedData(validData);

// Result
{
  isValid: true,
  errors: []
}
```

### Missing Customer Name

```typescript
const invalidData = {
  customer: { name: "", email: "test@example.com", phone: "+1234567890" },
  // ... rest of data
};

const validation = validateTransformedData(invalidData);

// Result
{
  isValid: false,
  errors: ["Customer name is required"]
}
```

### Invalid Date Range

```typescript
const invalidData = {
  trip: {
    startDate: "2024-06-15",
    endDate: "2024-06-10", // End before start
    // ... rest of trip data
  },
  // ... rest of data
};

const validation = validateTransformedData(invalidData);

// Result
{
  isValid: false,
  errors: ["End date must be after start date"]
}
```

### Invalid Traveler Count

```typescript
const invalidData = {
  trip: {
    travelers: 0, // Invalid count
    // ... rest of trip data
  },
  // ... rest of data
};

const validation = validateTransformedData(invalidData);

// Result
{
  isValid: false,
  errors: ["Number of travelers must be greater than 0"]
}
```

## Usage in Code

### Basic Transformation

```typescript
import { transformToBackendFormat } from "@/lib/dataTransformer";

const backendData = transformToBackendFormat(frontendFormData);
```

### With Validation

```typescript
import {
  transformToBackendFormat,
  validateTransformedData,
} from "@/lib/dataTransformer";

const backendData = transformToBackendFormat(frontendFormData);
const validation = validateTransformedData(backendData);

if (!validation.isValid) {
  console.error("Validation errors:", validation.errors);
  return;
}

// Proceed with valid data
```

### Debug Transformation

```typescript
import { getTransformationSummary } from "@/lib/dataTransformer";

const backendData = transformToBackendFormat(frontendFormData);
const summary = getTransformationSummary(frontendFormData, backendData);

console.log("Transformation Summary:", summary);
```

This comprehensive set of examples covers all major transformation scenarios and edge cases you might encounter when working with the data transformation layer.
