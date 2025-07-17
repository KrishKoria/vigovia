import {
  Building2Icon,
  CarTaxiFrontIcon,
  IdCardIcon,
  PlaneIcon,
} from "lucide-react";
import Image from "next/image";

interface ItineraryHeaderProps {
  customerName: string;
  destination: string;
  duration: string;
  planCode?: string;
}

export function ItineraryHeader({
  customerName,
  destination,
  duration,
}: ItineraryHeaderProps) {
  return (
    <div className="rounded-t-lg overflow-hidden">
      <div className="bg-white text-center py-6">
        <div className="flex flex-col items-center">
          <div className="h-16 w-auto flex items-center mb-2">
            <Image
              src="/final-logo-2.png"
              alt="Vigovia Logo"
              width={120}
              height={120}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div
        className="relative bg-gradient-to-r from-vigovia-cta to-vigovia-accent p-8 text-vigovia-light"
        style={{
          background: "linear-gradient(to right, #541C9C, #936FE0)",
          color: "#FBF4FF",
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#FBF4FF" }}>
            Hi, {customerName}!
          </h1>
          <h2 className="text-3xl font-bold mb-2" style={{ color: "#FBF4FF" }}>
            {destination}
          </h2>
          <p className="text-lg opacity-90 mb-6" style={{ color: "#FBF4FF" }}>
            {duration}
          </p>

          <div className="flex justify-center gap-4">
            <div
              className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(251, 244, 255, 0.2)" }}
            >
              <PlaneIcon />
            </div>
            <div
              className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(251, 244, 255, 0.2)" }}
            >
              <Building2Icon />
            </div>
            <div
              className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(251, 244, 255, 0.2)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="104"
                height="104"
                viewBox="0 0 104 104"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M103.595 58.802C100.411 84.1951 78.6299 103.844 52.2341 103.844C25.8382 103.844 4.05702 84.1951 0.873047 58.802H30.6668C32.8301 58.802 34.8503 57.7266 36.0503 55.9369L44.2283 43.7371L50.1654 79.1636C51.1299 84.9174 58.6776 86.5287 61.9312 81.6753L77.2642 58.802H103.595ZM0.873047 45.9328C4.05702 20.5399 25.8382 0.890625 52.2341 0.890625C78.6299 0.890625 100.411 20.5399 103.595 45.9328H73.8014C71.6382 45.9328 69.6178 47.0082 68.4178 48.7979L60.2399 60.9975L54.3028 25.5712C53.3383 19.8173 45.7907 18.2062 42.5371 23.0597L27.2041 45.9328H0.873047Z"
                  fill="white"
                />
              </svg>
            </div>
            <div
              className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(251, 244, 255, 0.2)" }}
            >
              <CarTaxiFrontIcon />
            </div>
            <div
              className="w-8 h-8 bg-vigovia-light/20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(251, 244, 255, 0.2)" }}
            >
              <IdCardIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
