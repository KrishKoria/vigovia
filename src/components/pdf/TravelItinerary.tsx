import { ItineraryHeader } from "./components/ItineraryHeader";
import { DayItinerary } from "./components/DayItinerary";
import { FlightSummary } from "./components/FlightSummary";
import { HotelBookings } from "./components/HotelBookings";
import { ImportantNotes } from "./components/ImportantNotes";
import { InclusionSummary } from "./components/InclusionSummary";
import { PaymentPlan } from "./components/PaymentPlan";
import { ActivityTable } from "./components/ActivityTable";
import { Footer } from "./components/Footer";
import { FixedFooter } from "./components/FixedFooter";
import { TripDetails } from "./components/TripDetails";
import { ScopeOfService } from "./components/Scope";
import { VisaDetails } from "./components/VisaDetails";
import { TravelItineraryProps } from "@/lib/types";

interface TravelItineraryComponentProps {
  data: TravelItineraryProps;
}

export function TravelItinerary({ data }: TravelItineraryComponentProps) {
  const itineraryData = data;

  return (
    <div
      className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden pdf-content"
      data-testid="itinerary-content"
    >
      <ItineraryHeader {...itineraryData.header} />

      <div className="p-8 space-y-8">
        <TripDetails {...itineraryData.tripDetails} />

        {itineraryData.itinerary.map((day, index) => (
          <DayItinerary key={index} {...day} />
        ))}

        <FlightSummary flights={itineraryData.flights} />

        <HotelBookings hotels={itineraryData.hotels} />

        <ImportantNotes notes={itineraryData.importantNotes} />

        <ScopeOfService services={itineraryData.scopeOfService} />

        <InclusionSummary inclusions={itineraryData.inclusions} />

        <ActivityTable activities={itineraryData.activities} />
      </div>

      <PaymentPlan {...itineraryData.paymentPlan} />

      <VisaDetails {...itineraryData.visaDetails} />

      <div className="regular-footer">
        <Footer />
      </div>

      <FixedFooter />
    </div>
  );
}
