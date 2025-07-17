"use client";

import { useEffect, useState } from "react";
import { TravelItinerary } from "@/components/pdf/TravelItinerary";
import {
  TravelItineraryProps,
  transformFormDataToTravelItinerary,
} from "@/lib/types";
import type { ItineraryFormData } from "@/lib/schema";

export default function PreviewItineraryPage() {
  const [itineraryData, setItineraryData] =
    useState<TravelItineraryProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleItineraryDataReady = (event: CustomEvent) => {
      try {
        const formData = event.detail as ItineraryFormData;
        const transformedData = transformFormDataToTravelItinerary(formData);
        setItineraryData(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error transforming data:", err);
        setError("Failed to transform itinerary data");
        setIsLoading(false);
      }
    };

    window.addEventListener(
      "itineraryDataReady",
      handleItineraryDataReady as EventListener
    );

    // Check if data is already available
    if ((window as any).ITINERARY_DATA) {
      try {
        const formData = (window as any).ITINERARY_DATA as ItineraryFormData;
        const transformedData = transformFormDataToTravelItinerary(formData);
        setItineraryData(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error transforming existing data:", err);
        setError("Failed to transform itinerary data");
        setIsLoading(false);
      }
    } else {
      // If no data is available after 5 seconds, show error
      const timeoutId = setTimeout(() => {
        setIsLoading((currentLoading) => {
          if (currentLoading) {
            setError("No itinerary data received");
            return false;
          }
          return currentLoading;
        });
      }, 5000);

      // Clean up timeout if component unmounts
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener(
          "itineraryDataReady",
          handleItineraryDataReady as EventListener
        );
      };
    }
  }, []);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-state"
      >
        <div className="text-lg">Loading itinerary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="error-state"
      >
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">No itinerary data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TravelItinerary data={itineraryData} />
    </div>
  );
}
