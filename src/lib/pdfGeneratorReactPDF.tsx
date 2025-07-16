import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { ItineraryData } from "./types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#321E5D",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 12,
    color: "#680099",
    letterSpacing: 2,
  },
  tripInfo: {
    backgroundColor: "#4A90E2",
    color: "#ffffff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
  },
  infoCol: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 5,
    fontSize: 14,
  },
  daySection: {
    marginBottom: 40,
  },
  dayHeader: {
    backgroundColor: "#541C9C",
    color: "#ffffff",
    padding: 15,
    borderRadius: "8 8 0 0",
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionContent: {
    border: "1 solid #936FE0",
    borderTop: "none",
    padding: 20,
  },
  sectionTitle: {
    color: "#321E5D",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  itemCard: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 15,
    border: "1 solid #936FE0",
    borderRadius: 8,
    backgroundColor: "#FBF4FF",
  },
  itemContent: {
    flex: 1,
  },
  itemPrice: {
    width: 80,
    alignItems: "flex-end",
  },
  itemTitle: {
    color: "#321E5D",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemDescription: {
    color: "#666666",
    fontSize: 12,
    marginBottom: 8,
  },
  itemDetails: {
    fontSize: 12,
    color: "#666666",
  },
  priceTag: {
    backgroundColor: "#541C9C",
    color: "#ffffff",
    padding: "8 12",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  terms: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#FBF4FF",
    borderRadius: 8,
    border: "1 solid #936FE0",
  },
  footer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#541C9C",
    color: "#ffffff",
    borderRadius: 8,
  },
  footerGrid: {
    flexDirection: "row",
  },
  footerCol: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },
  footerItem: {
    marginBottom: 5,
    fontSize: 12,
  },
  footerBottom: {
    textAlign: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTop: "1 solid #680099",
    fontSize: 12,
  },
});

// Helper functions
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

const ItineraryPDF: React.FC<{ data: ItineraryData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>vigovia</Text>
        <Text style={styles.tagline}>PLAN.PACK.GO</Text>
      </View>

      {/* Trip Information */}
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle}>{data.tripTitle}</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoItem}>Destination: {data.destination}</Text>
            <Text style={styles.infoItem}>
              Duration: {data.numberOfDays} Days
            </Text>
            <Text style={styles.infoItem}>
              Start Date: {formatDate(data.startDate)}
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoItem}>Customer: {data.customerName}</Text>
            <Text style={styles.infoItem}>Email: {data.customerEmail}</Text>
            <Text style={styles.infoItem}>Phone: {data.customerPhone}</Text>
          </View>
        </View>
      </View>

      {/* Daily Itinerary */}
      {data.days.map((day, index) => (
        <View key={index} style={styles.daySection}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>
              Day {day.dayNumber} - {formatDate(day.date)}
            </Text>
          </View>

          {/* Activities */}
          {day.activities.length > 0 && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Activities</Text>
              {day.activities.map((activity, actIndex) => (
                <View key={actIndex} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{activity.name}</Text>
                    <Text style={styles.itemDescription}>
                      {activity.description}
                    </Text>
                    <Text style={styles.itemDetails}>
                      ID: {activity.id} | Location: {activity.location} |
                      Duration: {activity.duration}
                    </Text>
                  </View>
                  <View style={styles.itemPrice}>
                    <Text style={styles.priceTag}>
                      ${activity.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Transfers */}
          {day.transfers && day.transfers.length > 0 && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Transfers</Text>
              {day.transfers.map((transfer, transIndex) => (
                <View key={transIndex} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>
                      {transfer.type} - {transfer.from} to {transfer.to}
                    </Text>
                    <Text style={styles.itemDetails}>
                      ID: {transfer.id} | Pickup:{" "}
                      {formatTime(transfer.pickupTime)} | Dropoff:{" "}
                      {formatTime(transfer.dropoffTime)} | Duration:{" "}
                      {transfer.duration} | Capacity: {transfer.capacity} people
                    </Text>
                  </View>
                  <View style={styles.itemPrice}>
                    <Text style={styles.priceTag}>
                      ${transfer.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Flights */}
          {day.flights && day.flights.length > 0 && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Flights</Text>
              {day.flights.map((flight, flightIndex) => (
                <View key={flightIndex} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>
                      {flight.airline} {flight.flightNumber}
                    </Text>
                    <Text style={styles.itemDetails}>
                      Route: {flight.from} → {flight.to} | Class: {flight.class}{" "}
                      | Departure: {formatDateTime(flight.departure)} | Arrival:{" "}
                      {formatDateTime(flight.arrival)}
                    </Text>
                  </View>
                  <View style={styles.itemPrice}>
                    <Text style={styles.priceTag}>
                      ${flight.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Terms and Conditions */}
      <View style={styles.terms}>
        <Text style={styles.sectionTitle}>Terms and Conditions</Text>
        <Text style={styles.itemDetails}>
          1. All prices are subject to change without prior notice.
        </Text>
        <Text style={styles.itemDetails}>
          2. Cancellation policy applies as per the terms agreed upon booking.
        </Text>
        <Text style={styles.itemDetails}>
          3. Travel insurance is recommended for all travelers.
        </Text>
        <Text style={styles.itemDetails}>
          4. Valid passport and visa requirements must be met by travelers.
        </Text>
        <Text style={styles.itemDetails}>
          5. Vigovia Travel Technologies reserves the right to modify
          itineraries based on local conditions.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerGrid}>
          <View style={styles.footerCol}>
            <Text style={styles.footerTitle}>Contact Information</Text>
            <Text style={styles.footerItem}>Phone: +91-98xxx64641</Text>
            <Text style={styles.footerItem}>Email: contact@vigovia.com</Text>
            <Text style={styles.footerItem}>Website: www.vigovia.com</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerTitle}>Company Address</Text>
            <Text style={styles.footerItem}>
              HD-109 Cinnabar Hills,Links Business Park,{"\n"}
              Bangalore North,Bangalore,Karnataka,{"\n"}
              India-560071
            </Text>
          </View>
        </View>
        <Text style={styles.footerBottom}>
          © 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.
        </Text>
      </View>
    </Page>
  </Document>
);

// Export function to generate PDF
export async function generateItineraryPDFReactPDF(data: ItineraryData) {
  try {
    const blob = await pdf(<ItineraryPDF data={data} />).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.tripTitle.replace(/\s+/g, "_")}_Itinerary.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF with React-PDF:", error);
    throw error;
  }
}
