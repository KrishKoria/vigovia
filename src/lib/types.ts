export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image?: string;
  location: string;
}

export interface Transfer {
  id: string;
  type: string;
  price: number;
  duration: string;
  capacity: number;
  pickupTime: string;
  dropoffTime: string;
  from: string;
  to: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  from: string;
  to: string;
  price: number;
  class: string;
}

export interface Day {
  dayNumber: number;
  date: string;
  activities: Activity[];
  transfers?: Transfer[];
  flights?: Flight[];
}

export interface ItineraryData {
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  days: Day[];
}

export interface TravelItineraryProps {
  header: {
    customerName: string;
    destination: string;
    duration: string;
  };
  tripDetails: {
    departureFrom: string;
    departureDate: string;
    arrivalDate: string;
    destination: string;
    travelers: number;
  };
  itinerary: {
    day: number;
    date: string;
    title: string;
    image: string;
    timeline: {
      time: string;
      activities: string[];
    }[];
  }[];
  flights: {
    date: string;
    airline: string;
    route: string;
  }[];
  hotels: {
    city: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    hotelName: string;
  }[];
  importantNotes: {
    point: string;
    details: string;
  }[];
  scopeOfService: {
    service: string;
    details: string;
  }[];
  inclusions: {
    category: string;
    count: number;
    details: string;
    status: string;
  }[];
  paymentPlan: {
    totalAmount: string;
    tcs: string;
    installments: {
      installment: string;
      amount: string;
      dueDate: string;
    }[];
  };
  visaDetails: {
    visaType: string;
    validity: string;
    processingDate: string;
  };
  activities: {
    city: string;
    activity: string;
    type: string;
    timeRequired: string;
  }[];
}

export function transformFormDataToTravelItinerary(
  formData: ItineraryData
): TravelItineraryProps {
  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);
  const duration = `${formData.numberOfDays} Days ${
    formData.numberOfDays - 1
  } Nights`;

  return {
    header: {
      customerName: formData.customerName,
      destination: `${formData.destination} Itinerary`,
      duration: duration,
    },
    tripDetails: {
      departureFrom: "Not specified",
      departureDate: startDate.toLocaleDateString(),
      arrivalDate: endDate.toLocaleDateString(),
      destination: formData.destination,
      travelers: 1,
    },
    itinerary: formData.days.map((day) => ({
      day: day.dayNumber,
      date: new Date(day.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      }),
      title: day.activities[0]?.name || `Day ${day.dayNumber} Activities`,
      image:
        day.activities[0]?.image ||
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format",
      timeline: [
        {
          time: "Full Day",
          activities: day.activities.map(
            (activity) =>
              `${activity.name} at ${activity.location} (${activity.duration})`
          ),
        },
      ],
    })),
    flights: formData.days
      .filter((day) => day.flights && day.flights.length > 0)
      .flatMap((day) =>
        day.flights!.map((flight) => ({
          date: new Date(day.date).toLocaleDateString(),
          airline: flight.airline,
          route: `From ${flight.from} To ${flight.to}`,
        }))
      ),
    hotels: [
      {
        city: formData.destination,
        checkIn: startDate.toLocaleDateString(),
        checkOut: endDate.toLocaleDateString(),
        nights: formData.numberOfDays - 1,
        hotelName: "Hotel To Be Confirmed",
      },
    ],
    importantNotes: [
      {
        point: "General Information",
        details: "Please carry valid identification and travel documents.",
      },
      {
        point: "Booking Confirmation",
        details: "All bookings are subject to availability and confirmation.",
      },
    ],
    scopeOfService: [
      {
        service: "Itinerary Planning",
        details: "Custom itinerary based on your preferences",
      },
      {
        service: "Activity Bookings",
        details: "Assistance with booking selected activities",
      },
    ],
    inclusions: [
      {
        category: "Activities",
        count: formData.days.reduce(
          (total, day) => total + day.activities.length,
          0
        ),
        details: "All activities mentioned in the itinerary",
        status: "Included",
      },
    ],
    paymentPlan: {
      totalAmount: `₹ ${formData.days
        .reduce(
          (total, day) =>
            total +
            day.activities.reduce(
              (dayTotal, activity) => dayTotal + activity.price,
              0
            ),
          0
        )
        .toLocaleString()} (Inclusive Of GST)`,
      tcs: "As Applicable",
      installments: [
        {
          installment: "Installment 1",
          amount: "50%",
          dueDate: "Upon Booking",
        },
        {
          installment: "Installment 2",
          amount: "Remaining 50%",
          dueDate: "7 Days Before Departure",
        },
      ],
    },
    visaDetails: {
      visaType: "Tourist",
      validity: "As per destination requirements",
      processingDate: "To be advised",
    },
    activities: formData.days.flatMap((day) =>
      day.activities.map((activity) => ({
        city: activity.location,
        activity: activity.name,
        type: "Activity",
        timeRequired: activity.duration,
      }))
    ),
  };
}
