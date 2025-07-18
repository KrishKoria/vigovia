import { ItineraryHeader } from "./ItineraryHeader";
import { DayItinerary } from "./DayItinerary";
import { FlightSummary } from "./FlightSummary";
import { HotelBookings } from "./HotelBookings";
import { ImportantNotes } from "./ImportantNotes";
import { InclusionSummary } from "./InclusionSummary";
import { PaymentPlan } from "./PaymentPlan";
import { ActivityTable } from "./ActivityTable";
import { Footer } from "./Footer";
import { FixedFooter } from "./FixedFooter";
import { TripDetails } from "./TripDetails";
import { ScopeOfService } from "./Scope";
import { VisaDetails } from "./VisaDetails";
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

        <div className="text-center py-4">
          <p className="text-vigovia-cta font-medium underline cursor-pointer">
            View all terms and conditions
          </p>
        </div>
      </div>

      <PaymentPlan {...itineraryData.paymentPlan} />

      <VisaDetails {...itineraryData.visaDetails} />

      {/* Regular footer - hidden in print mode */}
      <div className="regular-footer">
        <Footer />
      </div>

      {/* Fixed footer that appears on every page in print mode */}
      <FixedFooter />
    </div>
  );
}
