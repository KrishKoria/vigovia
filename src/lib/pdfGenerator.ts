import React from "react";
import { pdf, Document } from "@react-pdf/renderer";
import { ItineraryData } from "./types";
import { TravelItineraryPDF } from "../components/pdf/TravelItineraryPDF";

export async function generateItineraryPDF(data: ItineraryData) {
  try {
    // Create PDF document using react-pdf
    const documentElement = React.createElement(
      Document,
      {
        title: `${data.tripTitle} - ${data.destination} Itinerary`,
        author: "Vigovia Travel Technologies",
        subject: `Travel Itinerary for ${data.customerName}`,
        creator: "Vigovia Travel Technologies",
      },
      React.createElement(TravelItineraryPDF, { data })
    );

    const pdfBlob = await pdf(documentElement).toBlob();

    // Generate filename
    const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "_");
    const currentDate = new Date().toISOString().split("T")[0];

    let fileName = "";
    if (data.tripTitle && data.tripTitle !== data.destination) {
      fileName = `${sanitizeFilename(data.tripTitle)}_${sanitizeFilename(
        data.destination
      )}_Itinerary_${currentDate}.pdf`;
    } else {
      fileName = `${sanitizeFilename(
        data.destination
      )}_Itinerary_${currentDate}.pdf`;
    }

    if (data.customerName) {
      fileName = `${sanitizeFilename(data.customerName)}_${fileName}`;
    }

    // Create download link and trigger download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
