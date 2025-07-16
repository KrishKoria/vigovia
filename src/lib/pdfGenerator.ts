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
      width: 800,
      height: pdfContainer.scrollHeight,
      windowWidth: 800,
      windowHeight: pdfContainer.scrollHeight,
      ignoreElements: (element) => {
        return element.classList?.contains("skip-pdf") || false;
      },
      onclone: (clonedDoc) => {
        const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && (href.includes("tailwind") || href.includes("css"))) {
            link.remove();
          }
        });

        const style = clonedDoc.createElement("style");
        style.textContent = `
          * {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .page-break {
            page-break-before: always;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    });
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    let remainingHeight = imgHeight;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      10,
      yPosition,
      imgWidth,
      imgHeight
    );

    while (remainingHeight > pdfHeight - 20) {
      remainingHeight -= pdfHeight - 20;
      pdf.addPage();
      yPosition = -(imgHeight - remainingHeight) + 10;
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        10,
        yPosition,
        imgWidth,
        imgHeight
      );
    }

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
    pdf.save(fileName);
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

  const formatSimpleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  const getTimeOfDay = (index: number) => {
    if (index === 0) return "Morning";
    if (index === 1) return "Afternoon";
    if (index === 2) return "Evening";
    return "Night";
  };

  const getTotalPrice = () => {
    let total = 0;
    data.days.forEach((day) => {
      day.activities.forEach((activity) => (total += activity.price));
      if (day.transfers)
        day.transfers.forEach((transfer) => (total += transfer.price));
      if (day.flights) day.flights.forEach((flight) => (total += flight.price));
    });
    return total;
  };

  const footerHTML = `
    <div style="margin-top: 40px; padding: 20px; background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; font-size: 12px; page-break-inside: avoid;">
      <div style="display: table; width: 100%;">
        <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">Vigovia Travel Technologies (P) Ltd</h4>
          <p style="margin: 5px 0; line-height: 1.4;">
            HD-109 Cinnabar Hills, Links Business Park,<br/>
            Bangalore North, Bangalore, Karnataka, India - 560071
          </p>
          <p style="margin: 10px 0 5px 0;"><strong>Phone:</strong> +91-98xxx64641</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> contact@vigovia.com</p>
          <p style="margin: 5px 0;"><strong>Website:</strong> www.vigovia.com</p>
        </div>
        <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">Important Information</h4>
          <p style="margin: 5px 0; line-height: 1.4;">
            • All prices are subject to change without notice<br/>
            • Cancellation policy applies as per booking terms<br/>
            • Travel insurance is recommended<br/>
            • Valid passport & visa required
          </p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
        <p style="margin: 0; font-size: 11px;">© 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.</p>
      </div>
    </div>
  `;

  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 0; background: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      
      <!-- Header -->
      <div style="text-align: center; padding: 30px 20px; background: white;">
        <div style="margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #4A148C; letter-spacing: 1px;">vigovia</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #2196F3; font-weight: 600; letter-spacing: 3px;">PLAN.PACK.GO</p>
        </div>
      </div>

      <!-- Trip Header -->
      <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 25px; margin: 0 20px; border-radius: 12px;">
        <h2 style="margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">Hi ${
          data.customerName
        }!</h2>
        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: normal;">${
          data.tripTitle
        }</h3>
        <div style="display: table; width: 100%; font-size: 14px;">
          <div style="display: table-cell; width: 50%;">
            <p style="margin: 5px 0;"><strong>Destination:</strong> ${
              data.destination
            }</p>
            <p style="margin: 5px 0;"><strong>Start Date:</strong> ${formatSimpleDate(
              data.startDate
            )}</p>
          </div>
          <div style="display: table-cell; width: 50%;">
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${
              data.numberOfDays
            } Days</p>
            <p style="margin: 5px 0;"><strong>End Date:</strong> ${formatSimpleDate(
              data.endDate
            )}</p>
          </div>
        </div>
      </div>

      <!-- Daily Itinerary Timeline -->
      <div style="padding: 20px;">
        ${data.days
          .map(
            (day, dayIndex) => `
          <div style="margin-bottom: 50px; page-break-inside: avoid;">
            <div style="display: table; width: 100%; margin-bottom: 30px;">
              <!-- Day Timeline Circle -->
              <div style="display: table-cell; width: 80px; vertical-align: top; padding-right: 20px;">
                <div style="position: relative;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; text-align: center; margin: 0 auto;">
                    Day<br/>${day.dayNumber}
                  </div>
                  ${
                    dayIndex < data.days.length - 1
                      ? '<div style="width: 2px; height: 100px; background: linear-gradient(to bottom, #4A148C, #2196F3); margin: 0 auto; position: absolute; top: 60px; left: 29px;"></div>'
                      : ""
                  }
                </div>
              </div>

              <!-- Day Content -->
              <div style="display: table-cell; vertical-align: top;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #4A148C;">${formatDate(
                    day.date
                  )}</h3>
                  <p style="margin: 0; color: #666; font-size: 14px;">Day ${
                    day.dayNumber
                  } of your ${data.destination} adventure</p>
                </div>

                <!-- Activities -->
                ${day.activities
                  .map(
                    (activity, activityIndex) => `
                  <div style="display: table; width: 100%; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Activity Image -->
                    <div style="display: table-cell; width: 120px; vertical-align: top;">
                      <div style="width: 120px; height: 90px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); display: flex; align-items: center; justify-content: center; color: #1976d2; font-size: 12px; text-align: center; font-weight: bold;">
                        ${
                          activity.image
                            ? `<img src="${activity.image}" style="width: 100%; height: 100%; object-fit: cover;">`
                            : "Activity<br/>Image"
                        }
                      </div>
                    </div>

                    <!-- Activity Details -->
                    <div style="display: table-cell; vertical-align: top; padding: 15px;">
                      <div style="display: table; width: 100%;">
                        <div style="display: table-cell; width: 70%; vertical-align: top;">
                          <div style="margin-bottom: 8px;">
                            <span style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                              ${getTimeOfDay(activityIndex)}
                            </span>
                          </div>
                          <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">${
                            activity.name
                          }</h4>
                          <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; line-height: 1.4;">${
                            activity.description
                          }</p>
                          <div style="font-size: 12px; color: #999;">
                            <span style="margin-right: 15px;"><strong>ID:</strong> ${
                              activity.id
                            }</span>
                            <span style="margin-right: 15px;"><strong>Duration:</strong> ${
                              activity.duration
                            }</span>
                            <span><strong>Location:</strong> ${
                              activity.location
                            }</span>
                          </div>
                        </div>
                        <div style="display: table-cell; width: 30%; text-align: right; vertical-align: top;">
                          <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: bold; text-align: center;">
                            ₹${activity.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `
                  )
                  .join("")}

                <!-- Transfers -->
                ${
                  day.transfers && day.transfers.length > 0
                    ? `
                  <div style="margin-top: 20px;">
                    <h4 style="margin: 0 0 15px 0; color: #4A148C; font-size: 16px; font-weight: bold;">Transfers</h4>
                    ${day.transfers
                      .map(
                        (transfer) => `
                      <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #2196F3;">
                        <div style="display: table; width: 100%;">
                          <div style="display: table-cell; width: 70%; vertical-align: top;">
                            <h5 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #333;">${
                              transfer.type
                            }</h5>
                            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${
                              transfer.from
                            } → ${transfer.to}</p>
                            <div style="font-size: 11px; color: #999;">
                              <span style="margin-right: 10px;">Pickup: ${formatTime(
                                transfer.pickupTime
                              )}</span>
                              <span style="margin-right: 10px;">Drop: ${formatTime(
                                transfer.dropoffTime
                              )}</span>
                              <span>Duration: ${transfer.duration}</span>
                            </div>
                          </div>
                          <div style="display: table-cell; width: 30%; text-align: right; vertical-align: top;">
                            <div style="background: #2196F3; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                              ₹${transfer.price.toLocaleString()}
                            </div>
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
                  <div style="margin-top: 20px;">
                    <h4 style="margin: 0 0 15px 0; color: #4A148C; font-size: 16px; font-weight: bold;">Flights</h4>
                    ${day.flights
                      .map(
                        (flight) => `
                      <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #ff9800;">
                        <div style="display: table; width: 100%;">
                          <div style="display: table-cell; width: 70%; vertical-align: top;">
                            <h5 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #333;">${
                              flight.airline
                            } ${flight.flightNumber}</h5>
                            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${
                              flight.from
                            } → ${flight.to}</p>
                            <div style="font-size: 11px; color: #999;">
                              <span style="margin-right: 10px;">Class: ${
                                flight.class
                              }</span>
                              <span style="margin-right: 10px;">Departure: ${new Date(
                                flight.departure
                              ).toLocaleString()}</span>
                              <span>Arrival: ${new Date(
                                flight.arrival
                              ).toLocaleString()}</span>
                            </div>
                          </div>
                          <div style="display: table-cell; width: 30%; text-align: right; vertical-align: top;">
                            <div style="background: #ff9800; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                              ₹${flight.price.toLocaleString()}
                            </div>
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
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <!-- Flight Summary -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Flight Summary</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="display: table; width: 100%; font-size: 14px; border-collapse: collapse;">
            <div style="display: table-row; font-weight: bold; background: #f8f9fa;">
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Date</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Flight</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">From</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">To</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Departure</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Arrival</div>
            </div>
            ${data.days
              .filter((day) => day.flights && day.flights.length > 0)
              .map((day) =>
                day
                  .flights!.map(
                    (flight) => `
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${formatSimpleDate(
                      day.date
                    )}</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${
                      flight.airline
                    } ${flight.flightNumber}</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${
                      flight.from
                    }</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${
                      flight.to
                    }</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${new Date(
                      flight.departure
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${new Date(
                      flight.arrival
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</div>
                  </div>
                `
                  )
                  .join("")
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Hotel Bookings -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Hotel Bookings</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="display: table; width: 100%; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: table-cell; width: 120px; vertical-align: top;">
              <div style="width: 120px; height: 90px; background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); display: flex; align-items: center; justify-content: center; color: #4caf50; font-size: 12px; text-align: center; font-weight: bold;">
                Hotel<br/>Image
              </div>
            </div>
            <div style="display: table-cell; vertical-align: top; padding: 15px;">
              <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">Sample Hotel - ${
                data.destination
              }</h4>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Standard Room | Double Occupancy</p>
              <div style="font-size: 12px; color: #999;">
                <span style="margin-right: 15px;"><strong>Check-in:</strong> ${formatSimpleDate(
                  data.startDate
                )}</span>
                <span style="margin-right: 15px;"><strong>Check-out:</strong> ${formatSimpleDate(
                  data.endDate
                )}</span>
                <span><strong>Nights:</strong> ${data.numberOfDays - 1}</span>
              </div>
            </div>
            <div style="display: table-cell; width: 120px; text-align: right; vertical-align: top; padding: 15px;">
              <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: bold; text-align: center;">
                ₹${Math.round(getTotalPrice() * 0.3).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Important Notes -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Important Notes</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">📋 Before You Travel</h4>
            <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
              <li>Ensure your passport is valid for at least 6 months</li>
              <li>Check visa requirements for ${data.destination}</li>
              <li>Travel insurance is highly recommended</li>
              <li>Carry copies of important documents</li>
            </ul>
          </div>
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #155724; font-size: 14px; font-weight: bold;">✈️ Travel Tips</h4>
            <ul style="margin: 0; padding-left: 20px; color: #155724; font-size: 13px; line-height: 1.6;">
              <li>Arrive at airport 2-3 hours before international flights</li>
              <li>Check weather conditions before packing</li>
              <li>Keep emergency contact numbers handy</li>
              <li>Inform banks about your travel plans</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Scope of Service -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Scope of Service</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="display: table; width: 100%; margin-bottom: 20px;">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #4A148C; font-size: 14px; font-weight: bold;">✅ Included</h4>
              <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 13px; line-height: 1.8;">
                <li>All mentioned activities and tours</li>
                <li>Accommodation as per itinerary</li>
                <li>Airport transfers</li>
                <li>Breakfast at hotels</li>
                <li>Professional tour guide</li>
                <li>All entrance fees</li>
              </ul>
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #d32f2f; font-size: 14px; font-weight: bold;">❌ Not Included</h4>
              <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 13px; line-height: 1.8;">
                <li>International flights</li>
                <li>Lunch and dinner (unless specified)</li>
                <li>Personal expenses</li>
                <li>Travel insurance</li>
                <li>Visa fees</li>
                <li>Tips and gratuities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Inclusion Summary -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Inclusion Summary</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="display: table; width: 100%; font-size: 14px; border-collapse: collapse;">
            <div style="display: table-row; font-weight: bold; background: #f8f9fa;">
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Category</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Details</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Amount</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Activities</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">All scheduled activities and tours</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd; text-align: right;">₹${Math.round(
                getTotalPrice() * 0.6
              ).toLocaleString()}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Accommodation</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Hotel stays for ${
                data.numberOfDays - 1
              } nights</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd; text-align: right;">₹${Math.round(
                getTotalPrice() * 0.3
              ).toLocaleString()}</div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Transfers</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">All ground transportation</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd; text-align: right;">₹${Math.round(
                getTotalPrice() * 0.1
              ).toLocaleString()}</div>
            </div>
            <div style="display: table-row; font-weight: bold; background: #f8f9fa;">
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Total</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd;">Complete package</div>
              <div style="display: table-cell; padding: 12px; border: 1px solid #ddd; text-align: right;">₹${getTotalPrice().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Table -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Activity Table</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="display: table; width: 100%; font-size: 13px; border-collapse: collapse;">
            <div style="display: table-row; font-weight: bold; background: #f8f9fa;">
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Day</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Activity</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Duration</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Location</div>
              <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Price</div>
            </div>
            ${data.days
              .map((day) =>
                day.activities
                  .map(
                    (activity) => `
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">Day ${
                      day.dayNumber
                    }</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${
                      activity.name
                    }</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${
                      activity.duration
                    }</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd;">${
                      activity.location
                    }</div>
                    <div style="display: table-cell; padding: 10px; border: 1px solid #ddd; text-align: right;">₹${activity.price.toLocaleString()}</div>
                  </div>
                `
                  )
                  .join("")
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Payment Plan -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Payment Plan</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="display: table; width: 100%; margin-bottom: 20px;">
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 20px;">
              <div style="background: #e8f5e8; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 14px; font-weight: bold;">💳 Total Amount</h4>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2e7d32;">₹${getTotalPrice().toLocaleString()}</p>
              </div>
              <div style="background: #fff3cd; border-radius: 8px; padding: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">⏰ Payment Terms</h4>
                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
                  <li>50% advance payment to confirm booking</li>
                  <li>Remaining 50% due 15 days before travel</li>
                  <li>Payment methods: Bank transfer, Card, UPI</li>
                </ul>
              </div>
            </div>
            <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 20px;">
              <div style="background: #e3f2fd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #1976d2; font-size: 14px; font-weight: bold;">📋 Cancellation Policy</h4>
                <ul style="margin: 0; padding-left: 20px; color: #1976d2; font-size: 13px; line-height: 1.6;">
                  <li>45+ days: 10% cancellation fee</li>
                  <li>30-44 days: 25% cancellation fee</li>
                  <li>15-29 days: 50% cancellation fee</li>
                  <li>0-14 days: 100% cancellation fee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Visa Details -->
      <div style="padding: 20px; margin-top: 30px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #4A148C 0%, #2196F3 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">Visa Details</h3>
        </div>
        <div style="background: white; border: 1px solid #ddd; border-top: none; padding: 20px;">
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
            <h4 style="margin: 0 0 15px 0; color: #4A148C; font-size: 16px; font-weight: bold;">📍 ${
              data.destination
            } Visa Information</h4>
            <div style="display: table; width: 100%; margin-bottom: 15px;">
              <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 20px;">
                <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">Visa Type</h5>
                <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">Tourist Visa</p>
                
                <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">Processing Time</h5>
                <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">5-7 working days</p>
              </div>
              <div style="display: table-cell; width: 50%; vertical-align: top; padding-left: 20px;">
                <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">Validity</h5>
                <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">30 days from date of entry</p>
                
                <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">Entry Type</h5>
                <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">Single/Multiple Entry</p>
              </div>
            </div>
            <div style="background: #fff3cd; border-radius: 6px; padding: 15px; margin-top: 15px;">
              <h5 style="margin: 0 0 8px 0; color: #856404; font-size: 14px; font-weight: bold;">📋 Required Documents</h5>
              <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
                <li>Original passport with 6 months validity</li>
                <li>Completed visa application form</li>
                <li>Recent passport-size photographs</li>
                <li>Flight booking confirmation</li>
                <li>Hotel booking confirmation</li>
                <li>Bank statements (last 3 months)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      ${footerHTML}
    </div>
  `;
}
