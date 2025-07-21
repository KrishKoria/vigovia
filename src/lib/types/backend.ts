export interface ItineraryRequest {
  customer: Customer;
  trip: Trip;
  itinerary: Itinerary;
  flights: Flight[];
  hotels: Hotel[];
  payment: Payment;
  config: PDFConfig;
  companyInfo: CompanyInfo;
  importantNotes: ImportantNote[];
  scopeOfService: ServiceScope[];
  inclusions: Inclusion[];
  visaDetails: VisaDetails;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Trip {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelers: number;
  departureFrom: string;
}

export interface Itinerary {
  days: Day[];
}

export interface Day {
  dayNumber: number;
  date: string;
  title: string;
  activities: Activity[];
  transfers: Transfer[];
  flights: Flight[];
  image: string;
  timeline: Timeline[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  type: string;
  time: string;
}

export interface Transfer {
  id: string;
  type: string;
  from: string;
  to: string;
  pickupTime: string;
  dropoffTime: string;
  duration: string;
  price: number;
  capacity: number;
}

export interface Flight {
  id: string;
  date: string;
  airline: string;
  flightNumber: string;
  route: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  class: string;
  price: number;
}

export interface Hotel {
  city: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelName: string;
  roomType: string;
  pricePerNight: number;
}

export interface Payment {
  totalAmount: string;
  tcs: string;
  advanceAmount?: string;
  balanceAmount?: string;
  status?: string;
  installments: Installment[];
}

export interface Installment {
  installment: string;
  amount: string;
  dueDate: string;
}

export interface Timeline {
  time: string;
  activities: string[];
}

export interface PDFConfig {
  includeFlights: boolean;
  includeHotels: boolean;
  includeActivities: boolean;
  includePayments: boolean;
  pageFormat: string;
  orientation: string;
  customBranding: CustomBranding;
}

export interface CustomBranding {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  companyName: string;
}

export interface CompanyInfo {
  name: string;
  registeredOffice: RegisteredOffice;
  contact: ContactInfo;
  logo: string;
}

export interface RegisteredOffice {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface ImportantNote {
  point: string;
  details: string;
}

export interface ServiceScope {
  service: string;
  details: string;
}

export interface Inclusion {
  category: string;
  count: number;
  details: string;
  status: string;
}

export interface VisaDetails {
  visaType: string;
  validity: string;
  processingDate: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: APIError[];
}

export interface APIError {
  field?: string;
  message: string;
  code?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PDFResponse {
  file_path: string;
  file_name: string;
  file_size: string;
  generated_at: string;
}

export interface FileInfoResponse {
  file_name: string;
  file_size: number;
  mod_time: string;
  content_type: string;
  extension: string;
}
