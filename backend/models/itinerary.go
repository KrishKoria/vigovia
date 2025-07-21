package models

import "time"

type ItineraryRequest struct {
	Customer       Customer         `json:"customer" validate:"required"`
	Trip           Trip             `json:"trip" validate:"required"`
	Itinerary      Itinerary        `json:"itinerary" validate:"required"`
	Flights        []Flight         `json:"flights"`
	Hotels         []Hotel          `json:"hotels"`
	Payment        Payment          `json:"payment"`
	Config         PDFConfig        `json:"config"`
	CompanyInfo    CompanyInfo      `json:"companyInfo"`
	ImportantNotes []ImportantNote  `json:"importantNotes"`
	ScopeOfService []ServiceScope   `json:"scopeOfService"`
	Inclusions     []Inclusion      `json:"inclusions"`
	VisaDetails    VisaDetails      `json:"visaDetails"`
}

// Customer represents customer information
type Customer struct {
	Name  string `json:"name" validate:"required,min=2,max=100"`
	Email string `json:"email" validate:"required,email"`
	Phone string `json:"phone" validate:"required"`
}

// Trip represents trip details
type Trip struct {
	Title         string `json:"title" validate:"required"`
	Destination   string `json:"destination" validate:"required"`
	StartDate     string `json:"startDate" validate:"required"`
	EndDate       string `json:"endDate" validate:"required"`
	Duration      string `json:"duration" validate:"required"`
	Travelers     int    `json:"travelers" validate:"required,min=1"`
	DepartureFrom string `json:"departureFrom"`
}

// Itinerary represents the complete itinerary with days
type Itinerary struct {
	Days []Day `json:"days" validate:"required,min=1"`
}

// Day represents a single day in the itinerary
type Day struct {
	DayNumber  int        `json:"dayNumber" validate:"required,min=1"`
	Date       string     `json:"date" validate:"required"`
	Title      string     `json:"title" validate:"required"`
	Activities []Activity `json:"activities" validate:"required,min=1"`
	Transfers  []Transfer `json:"transfers"`
	Flights    []Flight   `json:"flights"`
	Image      string     `json:"image"`
	Timeline   []Timeline `json:"timeline"`
}

type Activity struct {
	ID          string  `json:"id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description" validate:"required"`
	Location    string  `json:"location" validate:"required"`
	Duration    string  `json:"duration" validate:"required"`
	Price       float64 `json:"price" validate:"min=0"`
	Image       string  `json:"image"`
	Type        string  `json:"type"`
	Time        string  `json:"time"`
}

// Transfer represents a transfer/transportation detail
type Transfer struct {
	ID          string  `json:"id" validate:"required"`
	Type        string  `json:"type" validate:"required"`
	From        string  `json:"from" validate:"required"`
	To          string  `json:"to" validate:"required"`
	PickupTime  string  `json:"pickupTime" validate:"required"`
	DropoffTime string  `json:"dropoffTime" validate:"required"`
	Duration    string  `json:"duration" validate:"required"`
	Price       float64 `json:"price" validate:"min=0"`
	Capacity    int     `json:"capacity" validate:"min=1"`
}

// Flight represents flight information
type Flight struct {
	ID           string  `json:"id" validate:"required"`
	Date         string  `json:"date" validate:"required"`
	Airline      string  `json:"airline" validate:"required"`
	FlightNumber string  `json:"flightNumber" validate:"required"`
	Route        string  `json:"route" validate:"required"`
	From         string  `json:"from" validate:"required"`
	To           string  `json:"to" validate:"required"`
	Departure    string  `json:"departure" validate:"required"`
	Arrival      string  `json:"arrival" validate:"required"`
	Class        string  `json:"class" validate:"required"`
	Price        float64 `json:"price" validate:"min=0"`
}

// Hotel represents hotel booking information
type Hotel struct {
	City         string  `json:"city" validate:"required"`
	CheckIn      string  `json:"checkIn" validate:"required"`
	CheckOut     string  `json:"checkOut" validate:"required"`
	Nights       int    `json:"nights" validate:"min=1"`
	HotelName    string  `json:"hotelName" validate:"required"`
	RoomType     string  `json:"roomType"`
	PricePerNight float64 `json:"pricePerNight" validate:"min=0"`
}

type Payment struct {
	TotalAmount   string        `json:"totalAmount" validate:"required"`
	TCS           string        `json:"tcs"`
	AdvanceAmount string        `json:"advanceAmount,omitempty"`
	BalanceAmount string        `json:"balanceAmount,omitempty"`
	Status        string        `json:"status,omitempty"`
	Installments  []Installment `json:"installments" validate:"required,min=1"`
}

// Installment represents a payment installment
type Installment struct {
	InstallmentName string `json:"installment" validate:"required"`
	Amount          string `json:"amount" validate:"required"`
	DueDate         string `json:"dueDate" validate:"required"`
}

// Timeline represents timeline activities for a day
type Timeline struct {
	Time       string   `json:"time" validate:"required"`
	Activities []string `json:"activities" validate:"required,min=1"`
}

// PDFConfig represents PDF generation configuration
type PDFConfig struct {
	IncludeFlights    bool          `json:"includeFlights"`
	IncludeHotels     bool          `json:"includeHotels"`
	IncludeActivities bool          `json:"includeActivities"`
	IncludePayments   bool          `json:"includePayments"`
	PageFormat        string        `json:"pageFormat"`
	Orientation       string        `json:"orientation"`
	CustomBranding    CustomBranding `json:"customBranding"`
}

// CustomBranding represents custom branding options
type CustomBranding struct {
	PrimaryColor string `json:"primaryColor"`
	AccentColor  string `json:"accentColor"`
	LogoURL      string `json:"logoUrl"`
	CompanyName  string `json:"companyName"`
}

// TemplateData represents data passed to HTML templates
type TemplateData struct {
	Customer       Customer       `json:"customer"`
	Trip           Trip           `json:"trip"`
	Days           []Day          `json:"days"`
	Flights        []Flight       `json:"flights"`
	Hotels         []Hotel        `json:"hotels"`
	Payment        Payment        `json:"payment"`
	Config         PDFConfig      `json:"config"`
	ImportantNotes []ImportantNote `json:"importantNotes"`
	ScopeOfService []ServiceScope  `json:"scopeOfService"`
	Inclusions     []Inclusion     `json:"inclusions"`
	VisaDetails    VisaDetails     `json:"visaDetails"`
	CompanyInfo    CompanyInfo     `json:"companyInfo"`
	ContactInfo    ContactInfo     `json:"contactInfo"`
	CompanyLogo    string          `json:"companyLogo"`
	GeneratedAt    time.Time      `json:"generatedAt"`
}

// CompanyInfo represents company information for footer
type CompanyInfo struct {
	Name             string           `json:"name"`
	RegisteredOffice RegisteredOffice `json:"registeredOffice"`
	Contact          ContactInfo      `json:"contact"`
	Logo             string           `json:"logo"`
}

// RegisteredOffice represents company registered office address
type RegisteredOffice struct {
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	Country string `json:"country"`
}

// ContactInfo represents contact information
type ContactInfo struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
}

// ImportantNote represents important notes in the PDF
type ImportantNote struct {
	Point   string `json:"point"`
	Details string `json:"details"`
}

// ServiceScope represents scope of service
type ServiceScope struct {
	Service string `json:"service"`
	Details string `json:"details"`
}

// Inclusion represents inclusions in the package
type Inclusion struct {
	Category string `json:"category"`
	Count    int    `json:"count"`
	Details  string `json:"details"`
	Status   string `json:"status"`
}

// VisaDetails represents visa information
type VisaDetails struct {
	VisaType       string `json:"visaType"`
	Validity       string `json:"validity"`
	ProcessingDate string `json:"processingDate"`
}
