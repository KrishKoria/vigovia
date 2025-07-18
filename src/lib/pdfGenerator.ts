import type { ItineraryFormData } from "./schema";

export async function generateItineraryPDF(
  formData: ItineraryFormData
): Promise<void> {
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "PDF generation failed");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        link.download = filenameMatch[1];
      }
    } else {
      const destination =
        formData.destination?.replace(/[^a-zA-Z0-9-_]/g, "-") || "destination";
      const startDate = formData.startDate
        ? new Date(formData.startDate).toISOString().split("T")[0]
        : "";
      const endDate = formData.endDate
        ? new Date(formData.endDate).toISOString().split("T")[0]
        : "";
      const customerName =
        formData.customerName?.replace(/[^a-zA-Z0-9-_]/g, "-") || "customer";
      const numberOfTravellers = formData.numberOfTravellers || 1;

      let filename = `${destination}-itinerary`;
      if (startDate && endDate) {
        filename = `${destination}-${startDate}-to-${endDate}-${numberOfTravellers}pax-${customerName}`;
      } else if (startDate) {
        filename = `${destination}-${startDate}-${numberOfTravellers}pax-${customerName}`;
      } else {
        filename = `${destination}-${numberOfTravellers}pax-${customerName}-itinerary`;
      }
      filename = filename.toLowerCase().replace(/--+/g, "-") + ".pdf";
      link.download = filename;
    }

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
