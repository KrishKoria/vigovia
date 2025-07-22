# 🏔️ Vigovia - Travel Itinerary Generator

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library

### PDF Processing

- **[Puppeteer Core](https://pptr.dev/)** - Headless Chrome automation
- **[@sparticuz/chromium](https://github.com/Sparticuz/chromium)** - Chrome binary for serverless

### DevOps & Deployment

- **[Docker](https://www.docker.com/)** - Containerization platform
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container Docker applications

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KrishKoria/vigovia.git
   cd vigovia-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

### Docker Development

You can also run the application using Docker Compose:

```bash
# Run both frontend and backend
docker-compose up --build

# Run only the backend
cd backend
docker-compose up --build
```

---

## 🔌 API Documentation

### POST `/api/generate-pdf`

Generates a PDF from itinerary form data using Puppeteer.

#### Request Body

```typescript
interface ItineraryFormData {
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  numberOfTravellers: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  days: Day[];
}
```

#### Response

- **Success**: PDF file with appropriate headers
- **Error**: JSON error response with details

---

## 📖 Usage Guide

### Creating an Itinerary

1. **Landing Page**: Start from the homepage and click "Generate Itinerary"
2. **Trip Information**: Fill in basic trip details

   - Trip title and destination
   - Start and end dates
   - Number of days and travelers
   - Customer contact information

3. **Day Planning**: For each day, add:

   - **Activities**: Name, description, location, duration, price
   - **Transfers**: Vehicle type, pickup/dropoff times, locations
   - **Flights**: Airline, flight number, departure/arrival times

4. **Generate PDF**: Click "Generate Itinerary" to create PDF
5. **Download**: PDF automatically downloads with descriptive filename

### Form Validation

The application uses Zod schemas for comprehensive validation:

- Required field validation
- Email format validation
- Number range validation
- Date format validation
- Custom error messages

### Dynamic Content Management

- **Add Days**: Automatically creates new day cards
- **Remove Days**: Safely removes days and associated data
- **Add Activities/Transfers/Flights**: Dynamic field management
- **Remove Items**: Confirmation-based removal

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Development settings
NODE_ENV=development

# Add any API keys or external service configurations here
```

### Next.js Configuration

Key configurations in `next.config.ts`:

- TypeScript strict mode
- Experimental features for latest Next.js
- Image optimization settings
- Custom webpack configurations if needed

### Docker Deployment

The application is fully dockerized and can be run using Docker Compose. This setup includes both the frontend and backend services.

#### Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

#### Running with Docker Compose

1. **Run both frontend and backend services**:

   ```bash
   docker-compose up --build
   ```

   This will:

   - Build and start the frontend service (available at http://localhost:3000)
   - Build and start the backend service (available at http://localhost:8080)
   - Set up the necessary network for communication between services

2. **Run only the backend service**:

   ```bash
   docker-compose -f docker-compose.backend.yml up --build
   ```

   This is useful when you want to run the backend independently.

#### Environment Variables

The Docker setup uses the following environment variables:

- Frontend:

  - `NEXT_PUBLIC_BACKEND_URL`: URL of the backend service (default: http://localhost:8080)

- Backend:
  - `SERVER_PORT`: Port on which the backend server runs (default: 8080)
  - `SERVER_HOST`: Host on which the backend server runs (default: 0.0.0.0)
  - `LOGGING_LEVEL`: Logging level (default: info)
  - `LOGGING_FORMAT`: Logging format (default: json)

#### Docker Files

- `docker-compose.yml`: Configuration for running both frontend and backend
- `Dockerfile.frontend`: Dockerfile for building the frontend application
- `backend/Dockerfile`: Dockerfile for building the backend service

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🐛 Troubleshooting

### Common Issues

#### PDF Generation Fails

```text
Error: PDF generation failed
```

**Solution**: Ensure Puppeteer can access the preview URL and all dependencies are installed.

#### Form Validation Errors

```text
Error: Invalid input data
```

**Solution**: Check Zod schema requirements and ensure all required fields are filled.

#### Build Errors

```text
Error: Module not found
```

**Solution**: Verify all dependencies are installed and import paths are correct.

### Development Issues

#### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### Node Version Issues

```bash
# Use Node Version Manager
nvm use 22
nvm install 22
```

### Production Issues

#### Memory Issues with PDF Generation

- Increase memory limits for Puppeteer
- Implement PDF generation queue
- Use external PDF service for scale

---
