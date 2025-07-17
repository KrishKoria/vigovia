import { Card } from "@/components/ui/card";

interface TripDetailsProps {
  departureFrom: string;
  departureDate: string;
  arrivalDate: string;
  destination: string;
  travelers: number;
}

export function TripDetails({
  departureFrom,
  departureDate,
  arrivalDate,
  destination,
  travelers,
}: TripDetailsProps) {
  return (
    <Card className="p-4 border-2 border-vigovia-accent/20 bg-vigovia-light">
      <div className="grid grid-cols-5 gap-4 text-sm">
        <div>
          <p className="font-semibold text-vigovia-dark">Departure From</p>
          <p className="text-vigovia-dark/80">{departureFrom}</p>
        </div>
        <div>
          <p className="font-semibold text-vigovia-dark">Departure</p>
          <p className="text-vigovia-dark/80">{departureDate}</p>
        </div>
        <div>
          <p className="font-semibold text-vigovia-dark">Arrival</p>
          <p className="text-vigovia-dark/80">{arrivalDate}</p>
        </div>
        <div>
          <p className="font-semibold text-vigovia-dark">Destination</p>
          <p className="text-vigovia-dark/80">{destination}</p>
        </div>
        <div>
          <p className="font-semibold text-vigovia-dark">No. Of Travellers</p>
          <p className="text-vigovia-dark/80">{travelers}</p>
        </div>
      </div>
    </Card>
  );
}
