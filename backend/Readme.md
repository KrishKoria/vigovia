# Vigovia PDF Generation API

## 🚀 Features

- **PDF Generation**: Convert travel itineraries to professional PDF documents
- **Template Engine**: Flexible HTML templating with Go templates
- **ChromeDP Integration**: Headless Chrome for high-quality PDF rendering
- **Configurable Branding**: Custom colors, logos, and company information
- **Comprehensive Data Support**: Flights, hotels, activities, payments, and more
- **Validation**: Request validation with detailed error messages
- **Logging**: Structured logging with Logrus
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: Built-in health monitoring endpoints

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Examples](#examples)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🛠 Installation

### Prerequisites

- Go 1.24.1 or higher
- Chrome/Chromium browser (for PDF generation)
- Git

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/KrishKoria/Vigovia.git
cd Vigovia/backend
```

2. **Install dependencies**

```bash
go mod download
```

3. **Run the application**

```bash
go run main.go
```

The server will start on `http://localhost:8080`

## ⚙️ Configuration

The application uses a YAML configuration file (`config.yaml`). Here's the default configuration:

```yaml
server:
  port: "8080"
  host: "0.0.0.0"
  template_dir: "./templates"

pdf:
  storage_path: "./storage/pdfs"
  max_file_age: "168h" # 7 days
  page_format: "A4"
  orientation: "portrait"
  margin:
    top: "0.5in"
    bottom: "0.5in"
    left: "0.5in"
    right: "0.5in"

chromedp:
  timeout: "30s"
  disable_web_security: true
  headless: true

logging:
  level: "info" # debug, info, warn, error
  format: "json" # json, text
```

## 🔌 API Endpoints

### Health Check

```
GET /api/v1/health
```

**Response:**

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

### Generate PDF

```
POST /api/v1/generate-pdf
```

**Content-Type:** `application/json`

## 📝 Request Format

### Complete Request Structure

```json
{
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123"
  },
  "trip": {
    "title": "Amazing Adventure",
    "destination": "New Zealand",
    "startDate": "2024-12-15",
    "endDate": "2024-12-22",
    "duration": "7 Days 6 Nights",
    "travelers": 2,
    "departureFrom": "Mumbai"
  },
  "itinerary": {
    "days": [
      {
        "dayNumber": 1,
        "date": "2024-12-15",
        "title": "Arrival Day",
        "image": "/static/activities/arrival.jpg",
        "activities": [
          {
            "id": "act001",
            "name": "Airport Transfer",
            "description": "Private transfer from airport to hotel",
            "location": "Auckland Airport",
            "duration": "1 hour",
            "price": 5000.0,
            "type": "Transfer",
            "time": "Morning"
          }
        ],
        "transfers": [
          {
            "id": "trans001",
            "type": "Private Car",
            "from": "Auckland Airport",
            "to": "Hotel",
            "pickupTime": "14:00",
            "dropoffTime": "14:45",
            "duration": "45 minutes",
            "price": 5000.0,
            "capacity": 4
          }
        ],
        "timeline": [
          {
            "time": "14:00",
            "activities": ["Airport pickup", "Transfer to hotel"]
          }
        ]
      }
    ]
  },
  "flights": [
    {
      "id": "flight001",
      "date": "2024-12-15",
      "airline": "Air New Zealand",
      "flightNumber": "NZ132",
      "route": "Mumbai to Auckland",
      "from": "Mumbai",
      "to": "Auckland",
      "departure": "09:30",
      "arrival": "23:30",
      "class": "Economy",
      "price": 85000.0
    }
  ],
  "hotels": [
    {
      "city": "Auckland",
      "checkIn": "2024-12-15",
      "checkOut": "2024-12-17",
      "nights": 2,
      "hotelName": "Auckland Harbour Hotel",
      "roomType": "Superior Room",
      "pricePerNight": 9000.0
    }
  ],
  "payment": {
    "totalAmount": "275000.0",
    "tcs": "13750.0",
    "installments": [
      {
        "installment": "Advance Payment",
        "amount": "82500.0",
        "dueDate": "2024-12-01"
      },
      {
        "installment": "Balance Payment",
        "amount": "192500.0",
        "dueDate": "2024-12-15"
      }
    ]
  },
  "config": {
    "includeFlights": true,
    "includeHotels": true,
    "includeActivities": true,
    "includePayments": true,
    "pageFormat": "A4",
    "orientation": "portrait",
    "customBranding": {
      "primaryColor": "#007bff",
      "accentColor": "#28a745",
      "logoUrl": "/static/final-logo-2.png",
      "companyName": "Vigovia Travel"
    }
  },
  "companyInfo": {
    "name": "Vigovia Tech Pvt. Ltd",
    "registeredOffice": {
      "address": "Hd-109 Cinnabar Hills, Links Business Park",
      "city": "Karnataka",
      "state": "Karnataka",
      "country": "India"
    },
    "contact": {
      "phone": "+91-99X9999999",
      "email": "Contact@Vigovia.Com"
    },
    "logo": "/static/final-logo-2.png"
  },
  "importantNotes": [
    {
      "point": "Passport Validity",
      "details": "Ensure your passport is valid for at least 6 months beyond your travel dates."
    }
  ],
  "scopeOfService": [
    {
      "service": "Itinerary Planning",
      "details": "Custom itinerary based on your preferences"
    }
  ],
  "inclusions": [
    {
      "category": "Accommodation",
      "count": 2,
      "details": "Hotel bookings as per itinerary",
      "status": "Included"
    }
  ],
  "visaDetails": {
    "visaType": "Tourist Visa",
    "validity": "30 Days",
    "processingDate": "2024-11-15"
  }
}
```

### Required Fields

- `customer.name` (string, 2-100 chars)
- `customer.email` (valid email)
- `customer.phone` (string)
- `trip.title` (string)
- `trip.destination` (string)
- `trip.startDate` (string, YYYY-MM-DD)
- `trip.endDate` (string, YYYY-MM-DD)
- `trip.duration` (string)
- `trip.travelers` (integer, min: 1)
- `itinerary.days` (array, min: 1 day)

## 📤 Response Format

### Success Response

```json
{
  "success": true,
  "message": "PDF generated successfully",
  "data": {
    "file_path": "./storage/pdfs/New_Zealand_2024-12-15_to_2024-12-22_2pax_John_Doe.pdf",
    "file_name": "New_Zealand_2024-12-15_to_2024-12-22_2pax_John_Doe.pdf",
    "file_size": "2.3 MB",
    "generated_at": "2024-01-01T12:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "customer.email",
      "message": "Must be a valid email address",
      "code": "VALIDATION_ERROR"
    }
  ]
}
```

## 🧪 Examples

### Basic Example

```bash
curl -X POST http://localhost:8080/api/v1/generate-pdf \
  -H "Content-Type: application/json" \
  -d @test_samples/test_sample.json
```

### Using Sample Data

The repository includes sample JSON files in `test_samples/`:

- `test_sample.json` - Basic New Zealand trip
- `europe_honeymoon.json` - Complex European honeymoon tour
- `japan_tour_complex.json` - Detailed Japan cultural tour

```bash
# Test with sample data
curl -X POST http://localhost:8080/api/v1/generate-pdf \
  -H "Content-Type: application/json" \
  -d @test_samples/europe_honeymoon.json
```

## 🏗 Development

### Project Structure

```
backend/
├── config/           # Configuration management
├── handlers/         # HTTP request handlers
├── middleware/       # HTTP middleware
├── models/          # Data models and structures
├── services/        # Business logic services
├── storage/         # File storage (PDFs)
├── static/          # Static assets (images, logos)
├── templates/       # HTML templates
│   └── partials/    # Template partials
├── test_samples/    # Sample JSON files
├── utils/           # Utility functions
├── config.yaml      # Configuration file
└── main.go         # Application entry point
```

### Key Components

1. **PDF Service** (`services/pdf_service.go`)

   - Orchestrates PDF generation process
   - Handles HTML to PDF conversion using ChromeDP
   - Manages file operations

2. **Template Service** (`services/template_service.go`)

   - Loads and renders HTML templates
   - Provides template functions for formatting
   - Caches compiled templates

3. **File Service** (`services/file_service.go`)

   - Handles PDF file storage
   - Manages file system operations

4. **Validation** (`utils/validator.go`)
   - Request validation using go-playground/validator
   - Custom validation messages

### Building

```bash
# Build for current platform
go build -o vigovia-api main.go

# Build for Linux
GOOS=linux GOARCH=amd64 go build -o vigovia-api-linux main.go

# Build for Windows
GOOS=windows GOARCH=amd64 go build -o vigovia-api.exe main.go
```

## 🚀 Deployment

### Docker Compose Deployment

1. **Create a `docker-compose.yml` file**

```yaml
services:
  api:
    build: .
    ports:
      - "8080:8080" # Maps container port 8080 to host port 8080
    volumes:
      - ./storage/pdfs:/root/storage/pdfs # Maps the container's PDF storage to local ./pdfs directory
    restart: unless-stopped # Automatically restarts the container if it crashes
```

2. **Build and run with Docker Compose**

```bash
docker-compose up -d

docker-compose logs -f
```

3. **Access Generated PDFs**

All PDFs generated by the application will be automatically saved to the `./storage/pdfs` directory on your host machine. You can:

- Open these files directly with any PDF viewer
- Share them with clients
- Process them with other applications

> **Verifying PDF Access**: After generating a PDF through the API, check the `./storage/pdfs` directory on your host machine. The files will appear with names like `New_Zealand_2024-12-15_to_2024-12-22_2pax_John_Doe.pdf`.

5. **Managing the Service**

```bash
# Stop the service
docker-compose down

# Restart the service
docker-compose restart

# View service status
docker-compose ps
```

## 🔧 Troubleshooting

### Common Issues

1. **ChromeDP Timeout**

   - Increase timeout in config: `chromedp.timeout: "60s"`
   - Check Chrome installation
   - Verify system resources

2. **Template Not Found**

   - Check `template_dir` path in config
   - Ensure all template files exist
   - Verify file permissions

3. **PDF Generation Fails**

   - Check ChromeDP logs
   - Verify static file paths
   - Ensure sufficient disk space

4. **Memory Issues**
   - Monitor memory usage during PDF generation
   - Consider implementing request queuing
   - Optimize template complexity

### Debug Mode

Enable debug logging:

```yaml
logging:
  level: "debug"
  format: "text"
```

### Health Monitoring

Monitor the health endpoint:

```bash
curl http://localhost:8080/api/v1/health
```
