/**
 * Type utilities for data transformation between frontend and backend
 * These types help ensure type safety during the transformation process
 */

import type { ItineraryFormData } from "../schema";
import type {
  ItineraryRequest,
  Activity as BackendActivity,
  Flight as BackendFlight,
} from "./backend";

// Type for frontend Activity (from schema)
export type FrontendActivity = ItineraryFormData["days"][0]["activities"][0];

// Type for frontend Flight (from schema)
export type FrontendFlight = NonNullable<
  ItineraryFormData["days"][0]["flights"]
>[0];

// Type for frontend Transfer (from schema)
export type FrontendTransfer = NonNullable<
  ItineraryFormData["days"][0]["transfers"]
>[0];

// Type for frontend Day (from schema)
export type FrontendDay = ItineraryFormData["days"][0];

// Transformation function type signatures
export interface DataTransformationFunctions {
  transformToBackendFormat: (
    frontendData: ItineraryFormData
  ) => ItineraryRequest;
  transformCustomer: (
    frontendData: ItineraryFormData
  ) => ItineraryRequest["customer"];
  transformTrip: (frontendData: ItineraryFormData) => ItineraryRequest["trip"];
  transformActivity: (activity: FrontendActivity) => BackendActivity;
  transformFlight: (flight: FrontendFlight, date: string) => BackendFlight;
  calculateDuration: (startDate: string, endDate: string) => string;
  extractFlights: (days: FrontendDay[]) => BackendFlight[];
}

// Utility type to ensure all required fields are present
export type RequiredBackendFields = Required<
  Pick<ItineraryRequest, "customer" | "trip" | "itinerary">
>;

// Optional backend fields that can have defaults
export type OptionalBackendFields = Partial<
  Pick<
    ItineraryRequest,
    | "flights"
    | "hotels"
    | "payment"
    | "config"
    | "companyInfo"
    | "importantNotes"
    | "scopeOfService"
    | "inclusions"
    | "visaDetails"
  >
>;

// Complete backend request with required and optional fields
export type TransformedBackendRequest = RequiredBackendFields &
  OptionalBackendFields;
