import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ItineraryData } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  // Header Section (White background with logo)
  headerSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#541C9C",
    marginRight: 8,
  },
  tagline: {
    fontSize: 10,
    color: "#680099",
    letterSpacing: 1.5,
    marginRight: 8,
  },
  airplaneIcon: {
    fontSize: 16,
    color: "#541C9C",
  },

  // Hero Section (Purple gradient background)
  heroSection: {
    backgroundColor: "#541C9C",
    padding: 40,
    textAlign: "center",
    color: "#FFFFFF",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  destinationTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  duration: {
    fontSize: 18,
    marginBottom: 20,
    opacity: 0.9,
  },
  activityIconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  activityIconBox: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  activityIcon: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },

  // Trip Details Table
  tripDetailsSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tripDetailsTable: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tripDetailColumn: {
    flex: 1,
    padding: 8,
  },
  tripDetailLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "bold",
  },
  tripDetailValue: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "bold",
  },

  // Day Itinerary Layout
  dayContainer: {
    flexDirection: "row",
    marginBottom: 40,
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },

  // Day Number Circle (Left side)
  dayNumberContainer: {
    width: 80,
    height: 120,
    marginRight: 20,
  },
  dayNumberCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#321E5D",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dayNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    transform: "rotate(-90deg)",
    paddingTop: 2,
  },

  // Center Image and Date
  dayImageContainer: {
    width: 120,
    marginRight: 24,
    alignItems: "center",
  },
  dayImageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#936FE0",
  },
  dayImagePlaceholder: {
    fontSize: 32,
    color: "#936FE0",
  },
  dayDate: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  dayDescription: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 1.3,
  },

  // Timeline (Right side)
  timelineContainer: {
    flex: 1,
    position: "relative",
  },
  timelineVerticalLine: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#936FE0",
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#936FE0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    zIndex: 2,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
  },
  timelineActivity: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 3,
    paddingLeft: 8,
    lineHeight: 1.4,
  },

  // Activity Cards Section
  activitiesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#321E5D",
    marginBottom: 16,
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
  },
  activityLocation: {
    fontSize: 10,
    color: "#936FE0",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityDuration: {
    fontSize: 9,
    color: "#9CA3AF",
  },
  activityPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#541C9C",
  },

  // Flight Summary Section
  flightSection: {
    padding: 20,
  },
  flightCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  flightDateBox: {
    backgroundColor: "#936FE0",
    color: "#FFFFFF",
    padding: 8,
    borderRadius: 4,
    marginRight: 16,
    minWidth: 60,
    textAlign: "center",
  },
  flightDateText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  flightDetails: {
    flex: 1,
  },
  flightTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  flightRoute: {
    fontSize: 10,
    color: "#6B7280",
  },

  // Summary Section
  summarySection: {
    backgroundColor: "#321E5D",
    color: "#FFFFFF",
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  totalCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#936FE0",
    textAlign: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },

  // Footer
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 20,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
  },
  companyAddress: {
    fontSize: 9,
    color: "#6B7280",
    lineHeight: 1.3,
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 2,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerBrand: {
    textAlign: "right",
    marginRight: 12,
  },
  footerBrandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#541C9C",
    marginBottom: 2,
  },
  footerBrandTagline: {
    fontSize: 8,
    color: "#936FE0",
    letterSpacing: 1,
  },
  footerIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#541C9C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerIconText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  copyright: {
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
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

  // Group activities by day for timeline display
  const getTimelineActivities = (day: any) => {
    const timeSlots = [
      { label: "Morning", activities: [] as string[] },
      { label: "Afternoon", activities: [] as string[] },
      { label: "Evening", activities: [] as string[] },
    ];

    // Distribute activities across time slots
    day.activities.forEach((activity: any, index: number) => {
      const slotIndex = index % 3;
      timeSlots[slotIndex].activities.push(activity.name);
      if (activity.location) {
        timeSlots[slotIndex].activities.push(`Location: ${activity.location}`);
      }
    });

    // Add transfers to appropriate slots
    day.transfers?.forEach((transfer: any) => {
      timeSlots[0].activities.push(
        `Transfer: ${transfer.from} → ${transfer.to}`
      );
    });

    return timeSlots.filter((slot) => slot.activities.length > 0);
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <Text style={styles.logoText}>vigovia</Text>
          <Text style={styles.tagline}>PLAN.PACK.GO</Text>
          <Text style={styles.airplaneIcon}>✈</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.greeting}>Hi, {data.customerName}!</Text>
        <Text style={styles.destinationTitle}>{data.destination}</Text>
        <Text style={styles.duration}>
          {data.numberOfDays} Days {data.numberOfDays - 1} Nights
        </Text>

        <View style={styles.activityIconsRow}>
          <View style={styles.activityIconBox}>
            <Text style={styles.activityIcon}>✈</Text>
          </View>
          <View style={styles.activityIconBox}>
            <Text style={styles.activityIcon}>🏨</Text>
          </View>
          <View style={styles.activityIconBox}>
            <Text style={styles.activityIcon}>🚗</Text>
          </View>
          <View style={styles.activityIconBox}>
            <Text style={styles.activityIcon}>📍</Text>
          </View>
          <View style={styles.activityIconBox}>
            <Text style={styles.activityIcon}>🎯</Text>
          </View>
        </View>
      </View>

      {/* Trip Details Table */}
      <View style={styles.tripDetailsSection}>
        <View style={styles.tripDetailsTable}>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailLabel}>Departure From</Text>
            <Text style={styles.tripDetailValue}>{data.destination}</Text>
          </View>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailLabel}>Departure</Text>
            <Text style={styles.tripDetailValue}>
              {formatShortDate(data.startDate)}
            </Text>
          </View>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailLabel}>Arrival</Text>
            <Text style={styles.tripDetailValue}>
              {formatShortDate(data.endDate)}
            </Text>
          </View>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailLabel}>Destination</Text>
            <Text style={styles.tripDetailValue}>{data.destination}</Text>
          </View>
          <View style={styles.tripDetailColumn}>
            <Text style={styles.tripDetailLabel}>No. Of Travellers</Text>
            <Text style={styles.tripDetailValue}>1</Text>
          </View>
        </View>
      </View>

      {/* Day-by-Day Itinerary */}
      {data.days.map((day, index) => {
        const timelineActivities = getTimelineActivities(day);

        return (
          <View key={index} style={styles.dayContainer}>
            {/* Day Number Circle */}
            <View style={styles.dayNumberContainer}>
              <View style={styles.dayNumberCircle}>
                <Text style={styles.dayNumberText}>Day {day.dayNumber}</Text>
              </View>
            </View>

            {/* Center Image and Date */}
            <View style={styles.dayImageContainer}>
              <View style={styles.dayImageCircle}>
                <Text style={styles.dayImagePlaceholder}>🌴</Text>
              </View>
              <Text style={styles.dayDate}>{formatShortDate(day.date)}</Text>
              <Text style={styles.dayDescription}>
                {day.activities.length > 0
                  ? `${day.activities[0].name
                      .split(" ")
                      .slice(0, 3)
                      .join(" ")}...`
                  : "Day Activities"}
              </Text>
            </View>

            {/* Timeline */}
            <View style={styles.timelineContainer}>
              <View style={styles.timelineVerticalLine} />

              {timelineActivities.map((timeSlot, timeIndex) => (
                <View key={timeIndex} style={styles.timelineItem}>
                  <View style={styles.timelineDot}>
                    <View style={styles.timelineDotInner} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>{timeSlot.label}</Text>
                    {timeSlot.activities.map((activity, actIndex) => (
                      <Text key={actIndex} style={styles.timelineActivity}>
                        • {activity}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {/* Activities Detail Section */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Day Activities</Text>
        {data.days.map((day) =>
          day.activities.map((activity, actIndex) => (
            <View
              key={`${day.dayNumber}-${actIndex}`}
              style={styles.activityCard}
            >
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityLocation}>
                📍 {activity.location}
              </Text>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              <View style={styles.activityMeta}>
                <Text style={styles.activityDuration}>
                  ⏰Duration: {activity.duration}
                </Text>
                <Text style={styles.activityPrice}>
                  {activity.price.toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Flight Summary */}
      {data.days.some((day) => day.flights && day.flights.length > 0) && (
        <View style={styles.flightSection}>
          <Text style={styles.sectionTitle}>Flight Summary</Text>
          {data.days.map((day) =>
            day.flights?.map((flight, flightIndex) => (
              <View key={flightIndex} style={styles.flightCard}>
                <View style={styles.flightDateBox}>
                  <Text style={styles.flightDateText}>
                    {formatShortDate(day.date)}
                  </Text>
                </View>
                <View style={styles.flightDetails}>
                  <Text style={styles.flightTitle}>
                    {flight.airline} - {flight.flightNumber}
                  </Text>
                  <Text style={styles.flightRoute}>
                    {flight.from} → {flight.to} | {flight.departure} -{" "}
                    {flight.arrival}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Activities:</Text>
          <Text style={styles.summaryValue}>
            {data.days.reduce((total, day) => total + day.activities.length, 0)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration:</Text>
          <Text style={styles.summaryValue}>{data.numberOfDays} Days</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Contact:</Text>
          <Text style={styles.summaryValue}>{data.customerEmail}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phone:</Text>
          <Text style={styles.summaryValue}>{data.customerPhone}</Text>
        </View>

        <Text style={styles.totalCost}>
          Total Estimated Cost: {getTotalPrice().toLocaleString()}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLeft}>
            <Text style={styles.companyName}>Vigovia Tech Pvt. Ltd</Text>
            <Text style={styles.companyAddress}>
              Registered Office: HD-109 Cinnabar Hills, Links Business Park,
              {"\n"}
              Karnataka, India.
            </Text>
            <Text style={styles.contactInfo}>Phone: +91-9999999999</Text>
            <Text style={styles.contactInfo}>
              Email ID: Contact@Vigovia.Com
            </Text>
          </View>

          <View style={styles.footerRight}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerBrandName}>vigovia</Text>
              <Text style={styles.footerBrandTagline}>PLAN.PACK.GO</Text>
            </View>
            <View style={styles.footerIcon}>
              <Text style={styles.footerIconText}>✈</Text>
            </View>
          </View>
        </View>

        <Text style={styles.copyright}>
          © 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.
        </Text>
      </View>
    </Page>
  );
};
