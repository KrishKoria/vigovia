export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image?: string;
  location: string;
}

export interface Transfer {
  id: string;
  type: string;
  price: number;
  duration: string;
  capacity: number;
  pickupTime: string;
  dropoffTime: string;
  from: string;
  to: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  from: string;
  to: string;
  price: number;
  class: string;
}

export interface Day {
  dayNumber: number;
  date: string;
  activities: Activity[];
  transfers?: Transfer[];
  flights?: Flight[];
}

export interface ItineraryData {
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  days: Day[];
}
