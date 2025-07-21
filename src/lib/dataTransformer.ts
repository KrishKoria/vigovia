/**
 * Data Transformation Layer for Backend Integration
 *
 * This module handles the conversion of frontend ItineraryData to backend ItineraryRequest format.
 * It includes comprehensive data mapping, default value injection, and data enhancement.
 */

import { ItineraryData } from "./types";
import { ItineraryFormData } from "./schema";
import {
  ItineraryRequest,
  Customer,
  Trip,
  Itinerary,
  Day as BackendDay,
  Activity as BackendActivity,
  Transfer as BackendTransfer,
  Flight as BackendFlight,
  Timeline,
} from "./types/backend";
import {
  generateAllDefaults,
  getDefaultDepartureFrom,
  getDefaultActivityType,
  getDefaultActivityTime,
} from "./defaultValues";

/**
 * Main transformation function that converts frontend form data to backend format
 */
export function transformToBackendFormat(
  frontendData: ItineraryData | ItineraryFormData
): ItineraryRequest {
  const defaults = generateAllDefaults();

  return {
    customer: transformCustomerData(frontendData),
    trip: transformTripData(frontendData),
    itinerary: transformItineraryData(frontendData),
    flights: extractFlights(frontendData),
    hotels: defaults.hotels, // Empty array as per requirements
    payment: defaults.payment,
    config: defaults.config,
    companyInfo: defaults.companyInfo,
    importantNotes: defaults.importantNotes,
    scopeOfService: defaults.scopeOfService,
    inclusions: defaults.inclusions,
    visaDetails: defaults.visaDetails,
  };
}

/**
 * Transform customer data from frontend format to backend format
 */
export function transformCustomerData(
  frontendData: ItineraryData | ItineraryFormData
): Customer {
  return {
    name: frontendData.customerName,
    email: frontendData.customerEmail,
    phone: frontendData.customerPhone,
  };
}

/**
 * Transform trip data with duration calculation
 */
export function transformTripData(
  frontendData: ItineraryData | ItineraryFormData
): Trip {
  const duration = calculateDuration(
    frontendData.startDate,
    frontendData.endDate
  );
  const departureFrom = getDefaultDepartureFrom(frontendData.destination);

  return {
    title: frontendData.tripTitle,
    destination: frontendData.destination,
    startDate: frontendData.startDate,
    endDate: frontendData.endDate,
    duration,
    travelers: frontendData.numberOfTravellers,
    departureFrom,
  };
}

/**
 * Calculate duration string in "X Days Y Nights" format
 */
export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());

  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Nights are typically one less than days
  const nights = Math.max(0, diffDays - 1);

  return `${diffDays} Days ${nights} Nights`;
}

/**
 * Transform complete itinerary data including all days
 */
export function transformItineraryData(
  frontendData: ItineraryData | ItineraryFormData
): Itinerary {
  return {
    days: frontendData.days.map((day) => transformDayData(day)),
  };
}

/**
 * Transform individual day data to backend format
 */
export function transformDayData(frontendDay: any): BackendDay {
  return {
    dayNumber: frontendDay.dayNumber,
    date: frontendDay.date,
    title: generateDayTitle(frontendDay),
    activities: transformActivities(frontendDay.activities || []),
    transfers: transformTransfers(frontendDay.transfers || []),
    flights: transformDayFlights(frontendDay.flights || []),
    image: generateDayImage(frontendDay),
    timeline: generateTimeline(frontendDay),
  };
}

/**
 * Generate appropriate title for a day based on activities
 */
function generateDayTitle(day: any): string {
  if (day.activities && day.activities.length > 0) {
    return day.activities[0].name || `Day ${day.dayNumber} Activities`;
  }
  return `Day ${day.dayNumber}`;
}

/**
 * Generate appropriate image for a day
 */
function generateDayImage(day: any): string {
  if (day.activities && day.activities.length > 0 && day.activities[0].image) {
    return day.activities[0].image;
  }
  // Default image
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format";
}

/**
 * Generate timeline for a day based on activities
 */
function generateTimeline(day: any): Timeline[] {
  if (!day.activities || day.activities.length === 0) {
    return [
      {
        time: "Full Day",
        activities: [`Day ${day.dayNumber} - Free time`],
      },
    ];
  }

  return [
    {
      time: "Full Day",
      activities: day.activities.map(
        (activity: any) =>
          `${activity.name} at ${activity.location} (${activity.duration})`
      ),
    },
  ];
}

/**
 * Transform activities with enhanced backend fields
 */
export function transformActivities(
  frontendActivities: any[]
): BackendActivity[] {
  return frontendActivities.map((activity) => {
    const activityType = getDefaultActivityType(
      activity.name,
      activity.description
    );
    const activityTime = getDefaultActivityTime(activityType);

    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      location: activity.location,
      duration: activity.duration,
      price: activity.price,
      image:
        activity.image ||
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format",
      type: activityType,
      time: activityTime,
    };
  });
}

/**
 * Transform transfers with direct mapping (no changes needed)
 */
export function transformTransfers(
  frontendTransfers: any[]
): BackendTransfer[] {
  return frontendTransfers.map((transfer) => ({
    id: transfer.id,
    type: transfer.type,
    from: transfer.from,
    to: transfer.to,
    pickupTime: transfer.pickupTime,
    dropoffTime: transfer.dropoffTime,
    duration: transfer.duration,
    price: transfer.price,
    capacity: transfer.capacity,
  }));
}

/**
 * Transform day-level flights (used within day transformation)
 */
function transformDayFlights(frontendFlights: any[]): BackendFlight[] {
  return frontendFlights.map((flight) => ({
    id: flight.id,
    date: "", // Will be set during flight extraction
    airline: flight.airline,
    flightNumber: flight.flightNumber,
    route: `${flight.from} to ${flight.to}`,
    from: flight.from,
    to: flight.to,
    departure: flight.departure,
    arrival: flight.arrival,
    class: flight.class,
    price: flight.price,
  }));
}

/**
 * Extract flights from all days and map them to top-level flights array with dates
 */
export function extractFlights(
  frontendData: ItineraryData | ItineraryFormData
): BackendFlight[] {
  const flights: BackendFlight[] = [];

  frontendData.days.forEach((day) => {
    if (day.flights && day.flights.length > 0) {
      day.flights.forEach((flight) => {
        flights.push({
          id: flight.id,
          date: day.date,
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          route: `${flight.from} to ${flight.to}`,
          from: flight.from,
          to: flight.to,
          departure: flight.departure,
          arrival: flight.arrival,
          class: flight.class,
          price: flight.price,
        });
      });
    }
  });

  return flights;
}

/**
 * Utility function to validate transformed data
 */
export function validateTransformedData(data: ItineraryRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate customer data
  if (!data.customer.name) errors.push("Customer name is required");
  if (!data.customer.email) errors.push("Customer email is required");
  if (!data.customer.phone) errors.push("Customer phone is required");

  // Validate trip data
  if (!data.trip.title) errors.push("Trip title is required");
  if (!data.trip.destination) errors.push("Trip destination is required");
  if (!data.trip.startDate) errors.push("Trip start date is required");
  if (!data.trip.endDate) errors.push("Trip end date is required");

  // Validate dates
  const startDate = new Date(data.trip.startDate);
  const endDate = new Date(data.trip.endDate);
  if (startDate >= endDate) {
    errors.push("End date must be after start date");
  }

  // Validate travelers count
  if (data.trip.travelers <= 0) {
    errors.push("Number of travelers must be greater than 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Utility function to get transformation summary for debugging
 */
export function getTransformationSummary(
  frontendData: ItineraryData | ItineraryFormData,
  backendData: ItineraryRequest
) {
  return {
    customer: {
      frontend: `${frontendData.customerName} (${frontendData.customerEmail})`,
      backend: `${backendData.customer.name} (${backendData.customer.email})`,
    },
    trip: {
      frontend: `${frontendData.tripTitle} - ${frontendData.destination}`,
      backend: `${backendData.trip.title} - ${backendData.trip.destination}`,
      duration: backendData.trip.duration,
    },
    activities: {
      total: backendData.itinerary.days.reduce(
        (total, day) => total + day.activities.length,
        0
      ),
      enhanced: "Added type and time fields to all activities",
    },
    flights: {
      total: backendData.flights.length,
      extracted: "Extracted from days and mapped with dates",
    },
    defaults: {
      added:
        "Payment, config, company info, notes, services, inclusions, visa details",
    },
  };
}
