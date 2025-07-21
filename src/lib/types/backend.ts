/**
 * TypeScript interfaces that match the Go backend models
 * These types ensure type safety for data transformation between frontend and backend
 */

// Main request interface that matches Go's ItineraryRequest
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

// Customer information
export interface Customer {
  name: string;
  email: string;
  phone: string;
}

// Trip details
export interface Trip {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelers: number;
  departureFrom: string;
}

// Complete itinerary with days
export interface Itinerary {
  days: Day[];
}

// Single day in the itinerary
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

// Activity details (enhanced from frontend version)
export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  type: string; // Added for backend
  time: string; // Added for backend
}

// Transfer/transportation details
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

// Flight information (enhanced from frontend version)
export interface Flight {
  id: string;
  date: string; // Added for backend
  airline: string;
  flightNumber: string;
  route: string; // Added for backend
  from: string;
  to: string;
  departure: string;
  arrival: string;
  class: string;
  price: number;
}

// Hotel booking information
export interface Hotel {
  city: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelName: string;
  roomType: string;
  pricePerNight: number;
}

// Payment information
export interface Payment {
  totalAmount: string;
  tcs: string;
  advanceAmount?: string;
  balanceAmount?: string;
  status?: string;
  installments: Installment[];
}

// Payment installment
export interface Installment {
  installment: string;
  amount: string;
  dueDate: string;
}

// Timeline activities for a day
export interface Timeline {
  time: string;
  activities: string[];
}

// PDF generation configuration
export interface PDFConfig {
  includeFlights: boolean;
  includeHotels: boolean;
  includeActivities: boolean;
  includePayments: boolean;
  pageFormat: string;
  orientation: string;
  customBranding: CustomBranding;
}

// Custom branding options
export interface CustomBranding {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  companyName: string;
}

// Company information
export interface CompanyInfo {
  name: string;
  registeredOffice: RegisteredOffice;
  contact: ContactInfo;
  logo: string;
}

// Company registered office address
export interface RegisteredOffice {
  address: string;
  city: string;
  state: string;
  country: string;
}

// Contact information
export interface ContactInfo {
  phone: string;
  email: string;
}

// Important notes in the PDF
export interface ImportantNote {
  point: string;
  details: string;
}

// Scope of service
export interface ServiceScope {
  service: string;
  details: string;
}

// Package inclusions
export interface Inclusion {
  category: string;
  count: number;
  details: string;
  status: string;
}

// Visa information
export interface VisaDetails {
  visaType: string;
  validity: string;
  processingDate: string;
}

// API Response types
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
