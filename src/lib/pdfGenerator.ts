import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ItineraryData } from "./types";

export async function generateItineraryPDF(data: ItineraryData) {
  const pdfContainer = document.createElement("div");
  pdfContainer.style.position = "absolute";
  pdfContainer.style.left = "-9999px";
  pdfContainer.style.top = "0";
  pdfContainer.style.width = "800px";
  pdfContainer.style.backgroundColor = "#ffffff";
  pdfContainer.style.fontFamily = "Arial, Helvetica, sans-serif";
  pdfContainer.style.fontSize = "12px";
  pdfContainer.style.lineHeight = "1.4";
  pdfContainer.style.color = "#000000";

  document.body.appendChild(pdfContainer);

  try {
    pdfContainer.innerHTML = generatePDFHTML(data);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: pdfContainer.offsetWidth,
      height: pdfContainer.offsetHeight,
      ignoreElements: (element) => {
        return element.classList?.contains("skip-pdf") || false;
      },
      onclone: async (clonedDoc) => {
        const { sanitizeDocumentStyles } = await import("./cssUtils");
        sanitizeDocumentStyles(clonedDoc);

        const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && (href.includes("tailwind") || href.includes("css"))) {
            link.remove();
          }
        });
      },
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${data.tripTitle.replace(/\s+/g, "_")}_Itinerary.pdf`);
  } finally {
    document.body.removeChild(pdfContainer);
  }
}

function generatePDFHTML(data: ItineraryData): string {
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
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; background: #ffffff; font-family: Arial, Helvetica, sans-serif;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; margin-bottom: 20px;">
          <div style="display: inline-block; vertical-align: middle;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #321E5D;">vigovia</h1>
            <p style="margin: 0; font-size: 12px; color: #680099; font-weight: 500; letter-spacing: 2px;">PLAN.PACK.GO</p>
          </div>
          <div style="display: inline-block; vertical-align: middle; margin-left: 10px;">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <path d="M35 12L40 8L35 4" stroke="#321E5D" stroke-width="2" stroke-linecap="round"/>
              <path d="M0 8H38" stroke="#321E5D" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Trip Information -->
      <div style="background: #4A90E2; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">${
          data.tripTitle
        }</h2>
        <div style="display: table; width: 100%; font-size: 14px;">
          <div style="display: table-cell; width: 50%; vertical-align: top;">
            <p style="margin: 5px 0;"><strong>Destination:</strong> ${
              data.destination
            }</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${
              data.numberOfDays
            } Days</p>
            <p style="margin: 5px 0;"><strong>Start Date:</strong> ${formatDate(
              data.startDate
            )}</p>
          </div>
          <div style="display: table-cell; width: 50%; vertical-align: top;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${
              data.customerName
            }</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${
              data.customerEmail
            }</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${
              data.customerPhone
            }</p>
          </div>
        </div>
      </div>

      <!-- Daily Itinerary -->
      ${data.days
        .map(
          (day) => `
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <!-- Day Header -->
          <div style="background: #541C9C; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0;">
            <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Day ${
              day.dayNumber
            } - ${formatDate(day.date)}</h3>
          </div>

          <!-- Activities -->
          ${
            day.activities.length > 0
              ? `
            <div style="border: 1px solid #936FE0; border-top: none; padding: 20px;">
              <h4 style="margin: 0 0 15px 0; color: #321E5D; font-size: 16px; font-weight: bold;">Activities</h4>
              ${day.activities
                .map(
                  (activity) => `
                <div style="display: table; width: 100%; margin-bottom: 20px; padding: 15px; border: 1px solid #936FE0; border-radius: 8px; background: #FBF4FF;">
                  <div style="display: table-cell; width: 80%; vertical-align: top;">
                    <h5 style="margin: 0 0 8px 0; color: #321E5D; font-size: 14px; font-weight: bold;">${
                      activity.name
                    }</h5>
                    <p style="margin: 0 0 8px 0; color: #666666; font-size: 12px; line-height: 1.4;">${
                      activity.description
                    }</p>
                    <div style="font-size: 12px; color: #666666;">
                      <span style="margin-right: 15px;"><strong>ID:</strong> ${
                        activity.id
                      }</span>
                      <span style="margin-right: 15px;"><strong>Location:</strong> ${
                        activity.location
                      }</span>
                      <span><strong>Duration:</strong> ${
                        activity.duration
                      }</span>
                    </div>
                  </div>
                  <div style="display: table-cell; width: 20%; text-align: right; vertical-align: top;">
                    <div style="background: #541C9C; color: #ffffff; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                      $${activity.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }

          <!-- Transfers -->
          ${
            day.transfers && day.transfers.length > 0
              ? `
            <div style="border: 1px solid #936FE0; border-top: none; padding: 20px;">
              <h4 style="margin: 0 0 15px 0; color: #321E5D; font-size: 16px; font-weight: bold;">Transfers</h4>
              ${day.transfers
                .map(
                  (transfer) => `
                <div style="display: table; width: 100%; margin-bottom: 15px; padding: 15px; border: 1px solid #936FE0; border-radius: 8px; background: #FBF4FF;">
                  <div style="display: table-cell; width: 80%; vertical-align: top;">
                    <h5 style="margin: 0 0 8px 0; color: #321E5D; font-size: 14px; font-weight: bold;">${
                      transfer.type
                    } - ${transfer.from} to ${transfer.to}</h5>
                    <div style="font-size: 12px; color: #666666;">
                      <span style="margin-right: 15px;"><strong>ID:</strong> ${
                        transfer.id
                      }</span>
                      <span style="margin-right: 15px;"><strong>Pickup:</strong> ${formatTime(
                        transfer.pickupTime
                      )}</span>
                      <span style="margin-right: 15px;"><strong>Dropoff:</strong> ${formatTime(
                        transfer.dropoffTime
                      )}</span>
                      <span style="margin-right: 15px;"><strong>Duration:</strong> ${
                        transfer.duration
                      }</span>
                      <span><strong>Capacity:</strong> ${
                        transfer.capacity
                      } people</span>
                    </div>
                  </div>
                  <div style="display: table-cell; width: 20%; text-align: right; vertical-align: top;">
                    <div style="background: #541C9C; color: #ffffff; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                      $${transfer.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }

          <!-- Flights -->
          ${
            day.flights && day.flights.length > 0
              ? `
            <div style="border: 1px solid #936FE0; border-top: none; padding: 20px;">
              <h4 style="margin: 0 0 15px 0; color: #321E5D; font-size: 16px; font-weight: bold;">Flights</h4>
              ${day.flights
                .map(
                  (flight) => `
                <div style="display: table; width: 100%; margin-bottom: 15px; padding: 15px; border: 1px solid #936FE0; border-radius: 8px; background: #FBF4FF;">
                  <div style="display: table-cell; width: 80%; vertical-align: top;">
                    <h5 style="margin: 0 0 8px 0; color: #321E5D; font-size: 14px; font-weight: bold;">${
                      flight.airline
                    } ${flight.flightNumber}</h5>
                    <div style="font-size: 12px; color: #666666;">
                      <span style="margin-right: 15px;"><strong>Route:</strong> ${
                        flight.from
                      } → ${flight.to}</span>
                      <span style="margin-right: 15px;"><strong>Class:</strong> ${
                        flight.class
                      }</span>
                      <span style="margin-right: 15px;"><strong>Departure:</strong> ${formatDateTime(
                        flight.departure
                      )}</span>
                      <span><strong>Arrival:</strong> ${formatDateTime(
                        flight.arrival
                      )}</span>
                    </div>
                  </div>
                  <div style="display: table-cell; width: 20%; text-align: right; vertical-align: top;">
                    <div style="background: #541C9C; color: #ffffff; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                      $${flight.price.toFixed(2)}
                    </div>
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
      <div style="margin-top: 40px; padding: 20px; background: #FBF4FF; border-radius: 8px; border: 1px solid #936FE0;">
        <h3 style="margin: 0 0 15px 0; color: #321E5D; font-size: 16px; font-weight: bold;">Terms and Conditions</h3>
        <div style="font-size: 12px; color: #666666; line-height: 1.5;">
          <p>1. All prices are subject to change without prior notice.</p>
          <p>2. Cancellation policy applies as per the terms agreed upon booking.</p>
          <p>3. Travel insurance is recommended for all travelers.</p>
          <p>4. Valid passport and visa requirements must be met by travelers.</p>
          <p>5. Vigovia Travel Technologies reserves the right to modify itineraries based on local conditions.</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding: 20px; background: #541C9C; color: #ffffff; border-radius: 8px;">
        <div style="display: table; width: 100%; font-size: 12px;">
          <div style="display: table-cell; width: 50%; vertical-align: top;">
            <h4 style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">Contact Information</h4>
            <p style="margin: 5px 0;"><strong>Phone:</strong> +91-98xxx64641</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> contact@vigovia.com</p>
            <p style="margin: 5px 0;"><strong>Website:</strong> www.vigovia.com</p>
          </div>
          <div style="display: table-cell; width: 50%; vertical-align: top;">
            <h4 style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">Company Address</h4>
            <p style="margin: 5px 0; line-height: 1.4;">
              HD-109 Cinnabar Hills,Links Business Park,<br/>
              Bangalore North,Bangalore,Karnataka,<br/>
              India-560071
            </p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #680099;">
          <p style="margin: 0; font-size: 12px;">© 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
}
