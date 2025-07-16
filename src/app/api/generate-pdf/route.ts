import { NextRequest, NextResponse } from "next/server";
import { generateCleanPDFHTML } from "@/lib/pdfGeneratorAlternative";
import { ItineraryData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const data: ItineraryData = await request.json();

    const html = generateCleanPDFHTML(data);

    const response = new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${data.tripTitle.replace(
          /\s+/g,
          "_"
        )}_Itinerary.html"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
