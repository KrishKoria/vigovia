import { z } from "zod";
export const activitySchema = z.object({
  id: z.string().min(1, "Activity ID is required"),
  name: z.string().min(1, "Activity name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  image: z.string().optional(),
  location: z.string().min(1, "Location is required"),
});

export const transferSchema = z.object({
  id: z.string().min(1, "Transfer ID is required"),
  type: z.string().min(1, "Vehicle type is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  dropoffTime: z.string().min(1, "Dropoff time is required"),
  from: z.string().min(1, "From location is required"),
  to: z.string().min(1, "To location is required"),
});

export const flightSchema = z.object({
  id: z.string().min(1, "Flight ID is required"),
  airline: z.string().min(1, "Airline is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  departure: z.string().min(1, "Departure time is required"),
  arrival: z.string().min(1, "Arrival time is required"),
  from: z.string().min(1, "From airport is required"),
  to: z.string().min(1, "To airport is required"),
  price: z.number().min(0, "Price must be positive"),
  class: z.string().min(1, "Class is required"),
});

export const daySchema = z.object({
  dayNumber: z.number().min(1),
  date: z.string().min(1, "Date is required"),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required"),
  transfers: z.array(transferSchema).optional(),
  flights: z.array(flightSchema).optional(),
});

export const itinerarySchema = z.object({
  tripTitle: z.string().min(1, "Trip title is required"),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  numberOfDays: z.number().min(1, "Number of days must be at least 1"),
  numberOfTravellers: z
    .number()
    .min(1, "Number of travellers must be at least 1"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  days: z.array(daySchema),
});

export type ItineraryFormData = z.infer<typeof itinerarySchema>;
