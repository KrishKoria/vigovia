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
    link.download = `${formData.tripTitle
      .replace(/\s+/g, "-")
      .toLowerCase()}-itinerary.pdf`;

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
