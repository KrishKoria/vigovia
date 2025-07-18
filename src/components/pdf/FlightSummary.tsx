import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Flight {
  date: string;
  airline: string;
  route: string;
}

interface FlightSummaryProps {
  flights: Flight[];
}

export function FlightSummary({ flights }: FlightSummaryProps) {
  return (
    <Card className="mb-8 page-break-before">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Flight <span className="text-vigovia-cta">Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {flights.map((flight, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0"
          >
            <div className="bg-vigovia-accent/20 px-3 py-2 rounded-lg min-w-24">
              <span className="text-vigovia-dark font-medium text-sm">
                {flight.date}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-vigovia-dark">
                <span className="text-vigovia-cta">{flight.airline}</span>{" "}
                {flight.route}
              </p>
            </div>
          </div>
        ))}
        <div className="p-4 text-xs text-vigovia-dark/60">
          Note: All Flights Include Meals, Seat Choice (Excluding XL) And
          25kg/25kg Checked Baggage.
        </div>
      </CardContent>
    </Card>
  );
}
