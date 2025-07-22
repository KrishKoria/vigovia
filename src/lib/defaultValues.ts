export interface Payment {
  totalAmount: string;
  tcs: string;
  advanceAmount?: string;
  balanceAmount?: string;
  status?: string;
  installments: Installment[];
}

export interface Installment {
  installment: string;
  amount: string;
  dueDate: string;
}

export interface PDFConfig {
  includeFlights: boolean;
  includeHotels: boolean;
  includeActivities: boolean;
  includePayments: boolean;
  pageFormat: string;
  orientation: string;
  customBranding: CustomBranding;
}

export interface CustomBranding {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  companyName: string;
}

export interface CompanyInfo {
  name: string;
  registeredOffice: RegisteredOffice;
  contact: ContactInfo;
  logo: string;
}

export interface RegisteredOffice {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface ImportantNote {
  point: string;
  details: string;
}

export interface ServiceScope {
  service: string;
  details: string;
}

export interface Inclusion {
  category: string;
  count: number;
  details: string;
  status: string;
}

export interface VisaDetails {
  visaType: string;
  validity: string;
  processingDate: string;
}

export interface Hotel {
  city: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelName: string;
  roomType: string;
  pricePerNight: number;
}

export function getDefaultPayment(): Payment {
  return {
    totalAmount: "0.00",
    tcs: "0.00",
    advanceAmount: "0.00",
    balanceAmount: "0.00",
    status: "pending",
    installments: [
      {
        installment: "Advance Payment",
        amount: "0.00",
        dueDate: new Date().toISOString().split("T")[0],
      },
    ],
  };
}

export function getDefaultPDFConfig(): PDFConfig {
  return {
    includeFlights: true,
    includeHotels: true,
    includeActivities: true,
    includePayments: true,
    pageFormat: "A4",
    orientation: "portrait",
    customBranding: {
      primaryColor: "#541C9C",
      accentColor: "#936FE0",
      logoUrl: "",
      companyName: "Travel Agency",
    },
  };
}

export function getDefaultCompanyInfo(): CompanyInfo {
  return {
    name: "Travel Agency",
    registeredOffice: {
      address: "123 Business Street",
      city: "Business City",
      state: "Business State",
      country: "Country",
    },
    contact: {
      phone: "+1-234-567-8900",
      email: "info@travelagency.com",
    },
    logo: "",
  };
}

export function getDefaultImportantNotes(): ImportantNote[] {
  return [
    {
      point: "Travel Documents",
      details: "Please ensure all travel documents are valid and up to date.",
    },
    {
      point: "Weather Conditions",
      details: "Check weather conditions before travel and pack accordingly.",
    },
    {
      point: "Local Customs",
      details: "Respect local customs and traditions during your visit.",
    },
    {
      point: "Emergency Contacts",
      details: "Keep emergency contact numbers readily available.",
    },
  ];
}

export function getDefaultScopeOfService(): ServiceScope[] {
  return [
    {
      service: "Accommodation",
      details: "Hotel bookings and accommodation arrangements",
    },
    {
      service: "Transportation",
      details: "Airport transfers and local transportation",
    },
    {
      service: "Activities",
      details: "Sightseeing tours and activity bookings",
    },
    {
      service: "Support",
      details: "24/7 customer support during travel",
    },
  ];
}

export function getDefaultInclusions(): Inclusion[] {
  return [
    {
      category: "Accommodation",
      count: 1,
      details: "Hotel stay as per itinerary",
      status: "included",
    },
    {
      category: "Meals",
      count: 1,
      details: "Breakfast included",
      status: "included",
    },
    {
      category: "Transportation",
      count: 1,
      details: "Airport transfers",
      status: "included",
    },
    {
      category: "Activities",
      count: 1,
      details: "Sightseeing tours as mentioned",
      status: "included",
    },
  ];
}

export function getDefaultVisaDetails(): VisaDetails {
  return {
    visaType: "Tourist Visa",
    validity: "30 days",
    processingDate: "5-7 working days",
  };
}

export function getDefaultHotels(): Hotel[] {
  return [];
}

export function getDefaultDepartureFrom(destination?: string): string {
  if (!destination) {
    return "Not specified";
  }

  const departureMappings: Record<string, string> = {
    singapore: "New Delhi",
    thailand: "Mumbai",
    malaysia: "Chennai",
    indonesia: "Kolkata",
    japan: "Delhi",
    "south korea": "Mumbai",
    vietnam: "Chennai",
    philippines: "Delhi",
    dubai: "Mumbai",
    uae: "Delhi",
    turkey: "Mumbai",
    europe: "Delhi",
    usa: "Mumbai",
    canada: "Delhi",
    australia: "Mumbai",
    "new zealand": "Delhi",
  };

  const destinationLower = destination.toLowerCase();

  if (departureMappings[destinationLower]) {
    return departureMappings[destinationLower];
  }

  for (const [key, value] of Object.entries(departureMappings)) {
    if (destinationLower.includes(key) || key.includes(destinationLower)) {
      return value;
    }
  }

  return "Delhi";
}

export function getDefaultActivityType(
  activityName?: string,
  description?: string
): string {
  if (!activityName && !description) {
    return "sightseeing";
  }

  const text = `${activityName || ""} ${description || ""}`.toLowerCase();

  if (
    text.includes("museum") ||
    text.includes("gallery") ||
    text.includes("heritage")
  ) {
    return "cultural";
  }
  if (
    text.includes("adventure") ||
    text.includes("trek") ||
    text.includes("climb")
  ) {
    return "adventure";
  }
  if (
    text.includes("food") ||
    text.includes("dining") ||
    text.includes("restaurant")
  ) {
    return "dining";
  }
  if (
    text.includes("shopping") ||
    text.includes("market") ||
    text.includes("mall")
  ) {
    return "shopping";
  }
  if (
    text.includes("beach") ||
    text.includes("water") ||
    text.includes("swim")
  ) {
    return "leisure";
  }
  if (
    text.includes("temple") ||
    text.includes("church") ||
    text.includes("mosque")
  ) {
    return "religious";
  }
  if (
    text.includes("park") ||
    text.includes("garden") ||
    text.includes("nature")
  ) {
    return "nature";
  }

  return "sightseeing";
}

export function getDefaultActivityTime(activityType?: string): string {
  const timeMappings: Record<string, string> = {
    cultural: "10:00",
    adventure: "08:00",
    dining: "19:00",
    shopping: "14:00",
    leisure: "11:00",
    religious: "09:00",
    nature: "08:30",
    sightseeing: "09:00",
  };

  return timeMappings[activityType || "sightseeing"] || "09:00";
}

export function generateAllDefaults() {
  return {
    payment: getDefaultPayment(),
    config: getDefaultPDFConfig(),
    companyInfo: getDefaultCompanyInfo(),
    importantNotes: getDefaultImportantNotes(),
    scopeOfService: getDefaultScopeOfService(),
    inclusions: getDefaultInclusions(),
    visaDetails: getDefaultVisaDetails(),
    hotels: getDefaultHotels(),
  };
}
