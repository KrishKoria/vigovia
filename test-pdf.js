// Test script to verify PDF generation with data injection
const fs = require("fs");
const path = require("path");

async function testPDFGeneration() {
  // Data in the expected ItineraryData format
  const testData = {
    tripTitle: "New Zealand Adventure Tour",
    destination: "New Zealand",
    startDate: "2024-07-15",
    endDate: "2024-07-24",
    numberOfDays: 10,
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    customerPhone: "+1-555-0123",
    days: [
      {
        dayNumber: 1,
        date: "2024-07-15",
        activities: [
          {
            id: "act1",
            name: "Airport Transfer",
            description: "Private transfer from Auckland Airport to hotel",
            price: 120,
            duration: "45 minutes",
            location: "Auckland",
            image:
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format",
          },
          {
            id: "act2",
            name: "City Orientation Tour",
            description: "Explore downtown Auckland highlights",
            price: 85,
            duration: "3 hours",
            location: "Auckland",
            image:
              "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop&auto=format",
          },
        ],
        transfers: [
          {
            id: "trans1",
            type: "Airport Transfer",
            price: 120,
            duration: "45 minutes",
            capacity: 4,
            pickupTime: "06:00 AM",
            dropoffTime: "06:45 AM",
            from: "Auckland Airport",
            to: "Sofitel Auckland Viaduct Harbour",
          },
        ],
      },
      {
        dayNumber: 2,
        date: "2024-07-16",
        activities: [
          {
            id: "act3",
            name: "Waitomo Glowworm Caves Tour",
            description: "Experience magical glowworm caves",
            price: 145,
            duration: "4 hours",
            location: "Waitomo",
            image:
              "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&auto=format",
          },
          {
            id: "act4",
            name: "Hobbiton Movie Set",
            description: "Visit the famous movie set from Lord of the Rings",
            price: 89,
            duration: "2.5 hours",
            location: "Matamata",
            image:
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format",
          },
        ],
      },
    ],
  };

  try {
    console.log("🔄 Testing PDF generation with data injection...");

    const response = await fetch("http://localhost:3000/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    // Save the PDF to verify it was generated correctly
    const outputPath = path.join(__dirname, "test-output.pdf");
    fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));

    console.log("✅ PDF generated successfully!");
    console.log(`📄 PDF saved to: ${outputPath}`);
    console.log(`📊 PDF size: ${(pdfBuffer.byteLength / 1024).toFixed(2)} KB`);

    // Basic validation - check if PDF is not too small (which would indicate an error page)
    if (pdfBuffer.byteLength < 10000) {
      console.log(
        "⚠️  Warning: PDF size is very small, might contain error content"
      );
    } else {
      console.log("✨ PDF size looks good - likely contains actual content");
    }
  } catch (error) {
    console.error("❌ PDF generation failed:", error.message);
    console.error(error);
  }
}

testPDFGeneration();
