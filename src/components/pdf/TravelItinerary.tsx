import { ItineraryHeader } from "./ItineraryHeader";
import { DayItinerary } from "./DayItinerary";
import { FlightSummary } from "./FlightSummary";
import { HotelBookings } from "./HotelBookings";
import { ImportantNotes } from "./ImportantNotes";
import { InclusionSummary } from "./InclusionSummary";
import { PaymentPlan } from "./PaymentPlan";
import { ActivityTable } from "./ActivityTable";
import { Footer } from "./Footer";
import { TripDetails } from "./TripDetails";
import { ScopeOfService } from "./Scope";
import { VisaDetails } from "./VisaDetails";

const sampleData = {
  header: {
    customerName: "Rahul",
    destination: "Singapore Itinerary",
    duration: "6 Days 5 Nights",
  },
  tripDetails: {
    departureFrom: "Kolkata",
    departureDate: "09/06/2025",
    arrivalDate: "15/06/2025",
    destination: "Singapore",
    travelers: 4,
  },
  itinerary: [
    {
      day: 1,
      date: "27th November",
      title: "Arrival In Singapore & City Exploration",
      image: "/lovable-uploads/57b45b4a-f0d9-4540-b055-1cffdce442a1.png",
      timeline: [
        {
          time: "Morning",
          activities: ["Arrive In Singapore. Transfer From Airport To Hotel."],
        },
        {
          time: "Afternoon",
          activities: [
            "Check Into Your Hotel",
            "Visit Marina Bay Sands Sky Park (2-3 Hours)",
            "Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.",
          ],
        },
        {
          time: "Evening",
          activities: [
            "Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)",
          ],
        },
      ],
    },
    {
      day: 2,
      date: "27th November",
      title: "Arrival In Singapore & City Exploration",
      image: "/lovable-uploads/57b45b4a-f0d9-4540-b055-1cffdce442a1.png",
      timeline: [
        {
          time: "Morning",
          activities: ["Arrive In Singapore. Transfer From Airport To Hotel."],
        },
        {
          time: "Afternoon",
          activities: [
            "Check Into Your Hotel",
            "Visit Marina Bay Sands Sky Park (2-3 Hours)",
            "Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.",
          ],
        },
        {
          time: "Evening",
          activities: [
            "Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)",
          ],
        },
      ],
    },
  ],
  flights: [
    {
      date: "Thu 10 Jan'24",
      airline: "Fly Air India",
      route: "From Delhi (DEL) To Singapore (SIN).",
    },
    {
      date: "Thu 10 Jan'24",
      airline: "Fly Air India",
      route: "From Delhi (DEL) To Singapore (SIN).",
    },
    {
      date: "Thu 10 Jan'24",
      airline: "Fly Air India",
      route: "From Delhi (DEL) To Singapore (SIN).",
    },
    {
      date: "Thu 10 Jan'24",
      airline: "Fly Air India",
      route: "From Delhi (DEL) To Singapore (SIN).",
    },
  ],
  hotels: [
    {
      city: "Singapore",
      checkIn: "24/02/2024",
      checkOut: "24/02/2024",
      nights: 2,
      hotelName: "Super TownHouse Oak Vashi Formerly Blue Diamond",
    },
    {
      city: "Singapore",
      checkIn: "24/02/2024",
      checkOut: "24/02/2024",
      nights: 2,
      hotelName: "Super TownHouse Oak Vashi Formerly Blue Diamond",
    },
  ],
  importantNotes: [
    {
      point: "Airline Standard Policy",
      details:
        "In Case Of Visa Rejection, Visa Fees Or Any Other Non-Cancellable Component Cannot Be Reimbursed At Any Cost.",
    },
    {
      point: "Flight/Hotel Cancellation",
      details:
        "In Case Of Visa Rejection, Visa Fees Or Any Other Non-Cancellable Component Cannot Be Reimbursed At Any Cost.",
    },
    {
      point: "Trip Insurance",
      details:
        "In Case Of Visa Rejection, Visa Fees Or Any Other Non-Cancellable Component Cannot Be Reimbursed At Any Cost.",
    },
  ],
  scopeOfService: [
    {
      service: "Flight Tickets And Hotel Vouchers",
      details: "Delivered 3 Days Post Full Payment",
    },
    {
      service: "Web Check-in",
      details: "Boarding Pass Delivery Via Email/WhatsApp",
    },
    {
      service: "Support",
      details: "Chat Support - Response Time: 4 Hours",
    },
  ],
  inclusions: [
    {
      category: "Flight",
      count: 2,
      details: "All Flights Mentioned",
      status: "Awaiting Confirmation",
    },
    {
      category: "Tourist Tax",
      count: 2,
      details:
        "Yotel (Singapore), Oakwood (Sydney), Mercure (Cairns), Novotel (Gold Coast), Holiday Inn (Melbourne)",
      status: "Awaiting Confirmation",
    },
  ],
  paymentPlan: {
    totalAmount: "₹ 9,00,000 For 3 Pax (Inclusive Of GST)",
    tcs: "Not Collected",
    installments: [
      {
        installment: "Installment 1",
        amount: "₹3,50,000",
        dueDate: "Initial Payment",
      },
      {
        installment: "Installment 2",
        amount: "₹4,00,000",
        dueDate: "Post Visa Approval",
      },
      {
        installment: "Installment 3",
        amount: "Remaining",
        dueDate: "20 Days Before Departure",
      },
    ],
  },
  visaDetails: {
    visaType: "Tourist",
    validity: "30 Days",
    processingDate: "14/06/2025",
  },
  activities: [
    {
      city: "Rio De Janeiro",
      activity: "Sydney Harbour Cruise & Taronga Zoo",
      type: "Nature/Sightseeing",
      timeRequired: "2-3 Hours",
    },
    {
      city: "Rio De Janeiro",
      activity: "Sydney Harbour Cruise & Taronga Zoo",
      type: "Airlines Standard",
      timeRequired: "2-3 Hours",
    },
  ],
};

export function TravelItinerary() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      <ItineraryHeader {...sampleData.header} />

      <div className="p-8 space-y-8">
        <TripDetails {...sampleData.tripDetails} />

        {sampleData.itinerary.map((day, index) => (
          <DayItinerary key={index} {...day} />
        ))}

        <FlightSummary flights={sampleData.flights} />

        <HotelBookings hotels={sampleData.hotels} />

        <ImportantNotes notes={sampleData.importantNotes} />

        <ScopeOfService services={sampleData.scopeOfService} />

        <InclusionSummary inclusions={sampleData.inclusions} />

        <ActivityTable activities={sampleData.activities} />

        <div className="text-center py-4">
          <p className="text-vigovia-cta font-medium underline cursor-pointer">
            View all terms and conditions
          </p>
        </div>
      </div>

      <PaymentPlan {...sampleData.paymentPlan} />

      <VisaDetails {...sampleData.visaDetails} />

      <Footer />
    </div>
  );
}
