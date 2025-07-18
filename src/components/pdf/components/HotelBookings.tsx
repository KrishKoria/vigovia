import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Hotel {
  city: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelName: string;
}

interface HotelBookingsProps {
  hotels: Hotel[];
}

export function HotelBookings({ hotels }: HotelBookingsProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Hotel <span className="text-vigovia-cta">Bookings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-5 gap-4 p-4 bg-vigovia-dark text-vigovia-light font-medium text-sm">
          <div>City</div>
          <div>Check In</div>
          <div>Check Out</div>
          <div>Nights</div>
          <div>Hotel Name</div>
        </div>

        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0 bg-vigovia-light/30"
          >
            <div className="text-vigovia-dark">{hotel.city}</div>
            <div className="text-vigovia-dark">{hotel.checkIn}</div>
            <div className="text-vigovia-dark">{hotel.checkOut}</div>
            <div className="text-vigovia-dark text-center">{hotel.nights}</div>
            <div className="text-vigovia-dark font-medium">
              {hotel.hotelName}
            </div>
          </div>
        ))}

        <div className="p-4 text-xs text-vigovia-dark/60 space-y-1">
          <p>1. All Hotels Are Tentative And Can Be Replaced With Similar</p>
          <p>2. Breakfast Included For All Hotel Stays</p>
          <p>3. All Hotels Will Be 4* And Above Category</p>
          <p>
            4. A maximum occupancy of 2 people/room is allowed in most hotels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
