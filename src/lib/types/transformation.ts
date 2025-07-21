import type { ItineraryFormData } from "../schema";
import type {
  ItineraryRequest,
  Activity as BackendActivity,
  Flight as BackendFlight,
} from "./backend";

export type FrontendActivity = ItineraryFormData["days"][0]["activities"][0];

export type FrontendFlight = NonNullable<
  ItineraryFormData["days"][0]["flights"]
>[0];

export type FrontendTransfer = NonNullable<
  ItineraryFormData["days"][0]["transfers"]
>[0];

export type FrontendDay = ItineraryFormData["days"][0];

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

export type RequiredBackendFields = Required<
  Pick<ItineraryRequest, "customer" | "trip" | "itinerary">
>;

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

export type TransformedBackendRequest = RequiredBackendFields &
  OptionalBackendFields;
