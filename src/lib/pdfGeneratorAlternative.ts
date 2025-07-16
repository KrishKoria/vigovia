import { ItineraryData } from "./types";

export async function generateItineraryPDFAlternative(data: ItineraryData) {
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.tripTitle.replace(/\s+/g, "_")}_Itinerary.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

export function generateCleanPDFHTML(data: ItineraryData): string {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #000; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #321E5D; margin-bottom: 5px; }
        .tagline { font-size: 12px; color: #680099; font-weight: 500; letter-spacing: 2px; }
        .trip-info { background: #4A90E2; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .trip-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; }
        .info-grid { display: table; width: 100%; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; }
        .info-item { margin: 5px 0; }
        .day-section { margin-bottom: 40px; page-break-inside: avoid; }
        .day-header { background: #541C9C; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .day-title { font-size: 18px; font-weight: bold; }
        .section-content { border: 1px solid #936FE0; border-top: none; padding: 20px; }
        .section-title { color: #321E5D; font-size: 16px; font-weight: bold; margin-bottom: 15px; }
        .item-card { display: table; width: 100%; margin-bottom: 20px; padding: 15px; border: 1px solid #936FE0; border-radius: 8px; background: #FBF4FF; }
        .item-content { display: table-cell; width: 80%; vertical-align: top; }
        .item-price { display: table-cell; width: 20%; text-align: right; vertical-align: top; }
        .item-title { color: #321E5D; font-size: 14px; font-weight: bold; margin-bottom: 8px; }
        .item-description { color: #666; font-size: 12px; margin-bottom: 8px; }
        .item-details { font-size: 12px; color: #666; }
        .price-tag { background: #541C9C; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .terms { margin-top: 40px; padding: 20px; background: #FBF4FF; border-radius: 8px; border: 1px solid #936FE0; }
        .footer { margin-top: 40px; padding: 20px; background: #541C9C; color: white; border-radius: 8px; }
        .footer-grid { display: table; width: 100%; }
        .footer-col { display: table-cell; width: 50%; vertical-align: top; }
        .footer-title { font-size: 14px; margin-bottom: 10px; }
        .footer-item { margin: 5px 0; }
        .footer-bottom { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #680099; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">vigovia</div>
          <div class="tagline">PLAN.PACK.GO</div>
        </div>

        <!-- Trip Information -->
        <div class="trip-info">
          <div class="trip-title">${data.tripTitle}</div>
          <div class="info-grid">
            <div class="info-col">
              <div class="info-item"><strong>Destination:</strong> ${
                data.destination
              }</div>
              <div class="info-item"><strong>Duration:</strong> ${
                data.numberOfDays
              } Days</div>
              <div class="info-item"><strong>Start Date:</strong> ${formatDate(
                data.startDate
              )}</div>
            </div>
            <div class="info-col">
              <div class="info-item"><strong>Customer:</strong> ${
                data.customerName
              }</div>
              <div class="info-item"><strong>Email:</strong> ${
                data.customerEmail
              }</div>
              <div class="info-item"><strong>Phone:</strong> ${
                data.customerPhone
              }</div>
            </div>
          </div>
        </div>

        <!-- Daily Itinerary -->
        ${data.days
          .map(
            (day) => `
          <div class="day-section">
            <div class="day-header">
              <div class="day-title">Day ${day.dayNumber} - ${formatDate(
              day.date
            )}</div>
            </div>

            ${
              day.activities.length > 0
                ? `
              <div class="section-content">
                <div class="section-title">Activities</div>
                ${day.activities
                  .map(
                    (activity) => `
                  <div class="item-card">
                    <div class="item-content">
                      <div class="item-title">${activity.name}</div>
                      <div class="item-description">${
                        activity.description
                      }</div>
                      <div class="item-details">
                        <strong>ID:</strong> ${activity.id} | 
                        <strong>Location:</strong> ${activity.location} | 
                        <strong>Duration:</strong> ${activity.duration}
                      </div>
                    </div>
                    <div class="item-price">
                      <div class="price-tag">$${activity.price.toFixed(2)}</div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }

            ${
              day.transfers && day.transfers.length > 0
                ? `
              <div class="section-content">
                <div class="section-title">Transfers</div>
                ${day.transfers
                  .map(
                    (transfer) => `
                  <div class="item-card">
                    <div class="item-content">
                      <div class="item-title">${transfer.type} - ${
                      transfer.from
                    } to ${transfer.to}</div>
                      <div class="item-details">
                        <strong>ID:</strong> ${transfer.id} | 
                        <strong>Pickup:</strong> ${formatTime(
                          transfer.pickupTime
                        )} | 
                        <strong>Dropoff:</strong> ${formatTime(
                          transfer.dropoffTime
                        )} | 
                        <strong>Duration:</strong> ${transfer.duration} | 
                        <strong>Capacity:</strong> ${transfer.capacity} people
                      </div>
                    </div>
                    <div class="item-price">
                      <div class="price-tag">$${transfer.price.toFixed(2)}</div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }

            ${
              day.flights && day.flights.length > 0
                ? `
              <div class="section-content">
                <div class="section-title">Flights</div>
                ${day.flights
                  .map(
                    (flight) => `
                  <div class="item-card">
                    <div class="item-content">
                      <div class="item-title">${flight.airline} ${
                      flight.flightNumber
                    }</div>
                      <div class="item-details">
                        <strong>Route:</strong> ${flight.from} → ${flight.to} | 
                        <strong>Class:</strong> ${flight.class} | 
                        <strong>Departure:</strong> ${formatDateTime(
                          flight.departure
                        )} | 
                        <strong>Arrival:</strong> ${formatDateTime(
                          flight.arrival
                        )}
                      </div>
                    </div>
                    <div class="item-price">
                      <div class="price-tag">$${flight.price.toFixed(2)}</div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        `
          )
          .join("")}

        <!-- Terms and Conditions -->
        <div class="terms">
          <div class="section-title">Terms and Conditions</div>
          <div style="font-size: 12px; color: #666;">
            <p>1. All prices are subject to change without prior notice.</p>
            <p>2. Cancellation policy applies as per the terms agreed upon booking.</p>
            <p>3. Travel insurance is recommended for all travelers.</p>
            <p>4. Valid passport and visa requirements must be met by travelers.</p>
            <p>5. Vigovia Travel Technologies reserves the right to modify itineraries based on local conditions.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-grid">
            <div class="footer-col">
              <div class="footer-title">Contact Information</div>
              <div class="footer-item"><strong>Phone:</strong> +91-98xxx64641</div>
              <div class="footer-item"><strong>Email:</strong> contact@vigovia.com</div>
              <div class="footer-item"><strong>Website:</strong> www.vigovia.com</div>
            </div>
            <div class="footer-col">
              <div class="footer-title">Company Address</div>
              <div class="footer-item">
                HD-109 Cinnabar Hills,Links Business Park,<br/>
                Bangalore North,Bangalore,Karnataka,<br/>
                India-560071
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div style="font-size: 12px;">© 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
