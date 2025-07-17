import { Badge } from "@/components/ui/badge";

interface ItineraryHeaderProps {
  customerName: string;
  destination: string;
  duration: string;
  price: string;
  planCode?: string;
}

export function ItineraryHeader({
  customerName,
  destination,
  duration,
  price,
  planCode = "PLAN.PACK.GO",
}: ItineraryHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-vigovia-cta to-vigovia-accent p-8 rounded-t-lg text-vigovia-light">
      {/* Price Badge */}
      <div className="absolute top-4 right-4">
        <Badge
          variant="secondary"
          className="bg-vigovia-light text-vigovia-dark font-bold px-3 py-1"
        >
          ₹{price}
        </Badge>
      </div>

      {/* Logo/Plan Code */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-vigovia-light rounded-full flex items-center justify-center">
            <span className="text-vigovia-cta font-bold text-sm">V</span>
          </div>
          <span className="text-sm font-medium">{planCode}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Hi, {customerName}!</h1>
        <h2 className="text-3xl font-bold mb-2">{destination}</h2>
        <p className="text-lg opacity-90">{duration}</p>

        {/* Activity Icons */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center">
            ✈️
          </div>
          <div className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center">
            🏨
          </div>
          <div className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center">
            🚗
          </div>
          <div className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center">
            🎯
          </div>
          <div className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center">
            🎪
          </div>
        </div>
      </div>
    </div>
  );
}
