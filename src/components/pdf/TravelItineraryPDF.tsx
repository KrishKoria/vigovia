import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ItineraryData } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FBF4FF",
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#541C9C",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#936FE0",
    letterSpacing: 3,
  },
  tripHeader: {
    backgroundColor: "#541C9C",
    color: "#FBF4FF",
    padding: 25,
    marginBottom: 20,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tripSubtitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tripDetailColumn: {
    flex: 1,
  },
  tripDetailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  content: {
    flex: 1,
  },
  daySection: {
    marginBottom: 30,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A148C",
    marginBottom: 10,
  },
  activityCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  activityPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#541C9C",
  },
  flightSection: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#541C9C",
    marginBottom: 15,
  },
  flightCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
  },
  flightDate: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  flightDetails: {
    fontSize: 12,
    color: "#666",
  },
  transferCard: {
    backgroundColor: "#e8f4f8",
    padding: 15,
    marginBottom: 10,
  },
  transferTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transferDetails: {
    fontSize: 12,
    color: "#666",
  },
  footer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#541C9C",
    color: "#FBF4FF",
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  companyInfo: {
    marginBottom: 15,
  },
  copyright: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 15,
    paddingTop: 15,
  },
});

interface TravelItineraryPDFProps {
  data: ItineraryData;
}

export const TravelItineraryPDF: React.FC<TravelItineraryPDFProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalPrice = () => {
    let total = 0;
    data.days.forEach((day) => {
      day.activities.forEach((activity) => {
        total += activity.price;
      });
      day.transfers?.forEach((transfer) => {
        total += transfer.price;
      });
      day.flights?.forEach((flight) => {
        total += flight.price;
      });
    });
    return total;
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>vigovia</Text>
        <Text style={styles.subtitle}>PLAN.PACK.GO</Text>
      </View>

      <View style={styles.tripHeader}>
        <Text style={styles.tripTitle}>Hi {data.customerName}!</Text>
        <Text style={styles.tripSubtitle}>{data.tripTitle}</Text>
        <View style={styles.tripDetails}>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailText}>
              Destination: {data.destination}
            </Text>
            <Text style={styles.tripDetailText}>
              Start Date: {formatDate(data.startDate)}
            </Text>
          </View>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailText}>
              Duration: {data.numberOfDays} Days
            </Text>
            <Text style={styles.tripDetailText}>
              End Date: {formatDate(data.endDate)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {data.days.map((day, index) => (
          <View key={index} style={styles.daySection}>
            <Text style={styles.dayTitle}>
              Day {day.dayNumber} - {formatDate(day.date)}
            </Text>

            {day.activities.map((activity, actIndex) => (
              <View key={actIndex} style={styles.activityCard}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityDescription}>
                  📍 {activity.location}
                </Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <Text style={styles.activityDescription}>
                  ⏰ Duration: {activity.duration}
                </Text>
                <Text style={styles.activityPrice}>
                  ₹{activity.price.toLocaleString()}
                </Text>
              </View>
            ))}

            {day.transfers && day.transfers.length > 0 && (
              <View>
                {day.transfers.map((transfer, transferIndex) => (
                  <View key={transferIndex} style={styles.transferCard}>
                    <Text style={styles.transferTitle}>
                      🚗 Transfer: {transfer.from} → {transfer.to}
                    </Text>
                    <Text style={styles.transferDetails}>
                      Vehicle: {transfer.type} | Capacity: {transfer.capacity}{" "}
                      people
                    </Text>
                    <Text style={styles.transferDetails}>
                      Pickup: {transfer.pickupTime} | Dropoff:{" "}
                      {transfer.dropoffTime}
                    </Text>
                    <Text style={styles.transferDetails}>
                      Duration: {transfer.duration} | Price: ₹
                      {transfer.price.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {day.flights && day.flights.length > 0 && (
              <View>
                {day.flights.map((flight, flightIndex) => (
                  <View key={flightIndex} style={styles.flightCard}>
                    <Text style={styles.flightDate}>
                      ✈️ {flight.airline} - {flight.flightNumber}
                    </Text>
                    <Text style={styles.flightDetails}>
                      {flight.from} → {flight.to}
                    </Text>
                    <Text style={styles.flightDetails}>
                      Departure: {flight.departure} | Arrival: {flight.arrival}
                    </Text>
                    <Text style={styles.flightDetails}>
                      Class: {flight.class} | Price: ₹
                      {flight.price.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.flightSection}>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        <Text style={styles.tripDetailText}>
          Total Estimated Cost: ₹{getTotalPrice().toLocaleString()}
        </Text>
        <Text style={styles.tripDetailText}>
          Contact: {data.customerEmail} | {data.customerPhone}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.companyInfo}>
          <Text style={styles.footerTitle}>
            Vigovia Travel Technologies (P) Ltd
          </Text>
          <Text style={styles.footerText}>
            HD-109 Cinnabar Hills, Links Business Park,{"\n"}
            Bangalore North, Bangalore, Karnataka, India - 560071
          </Text>
          <Text style={styles.footerText}>
            Phone: +91-98xxx64641 | Email: contact@vigovia.com
          </Text>
          <Text style={styles.footerText}>Website: www.vigovia.com</Text>
        </View>

        <Text style={styles.footerText}>
          Important Information:{"\n"}• All prices are subject to change without
          notice{"\n"}• Cancellation policy applies as per booking terms{"\n"}•
          Travel insurance is recommended{"\n"}• Valid passport & visa required
        </Text>

        <Text style={styles.copyright}>
          © 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.
        </Text>
      </View>
    </Page>
  );
};
