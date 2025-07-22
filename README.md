# 🏔️ Vigovia - New Zealand Travel Itinerary Generator

## Your Gateway to New Zealand Adventures

A comprehensive travel itinerary generator for creating personalized New Zealand travel experiences with professional PDF output.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)](https://tailwindcss.com/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.60.0-EC5990)](https://react-hook-form.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [API Documentation](#api-documentation)
- [Design System](#design-system)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

### Key Highlights

- **🎨 Modern UI/UX**: Beautiful gradient-based design with Vigovia's purple brand theme
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **📄 PDF Generation**: High-quality PDF output using Puppeteer with custom styling
- **🔧 Type-Safe**: Built with TypeScript and Zod validation for robust data handling
- **⚡ Performance**: Next.js 15 with Turbopack for fast development and production builds
- **🎯 User-Friendly**: Intuitive form design with dynamic field management

---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library

### Form Management

- **[React Hook Form 7](https://react-hook-form.com/)** - Performant form library
- **[Zod 4](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers

### PDF Processing

- **[Puppeteer Core](https://pptr.dev/)** - Headless Chrome automation
- **[@sparticuz/chromium](https://github.com/Sparticuz/chromium)** - Chrome binary for serverless

### UI Components

- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide React](https://lucide.dev/)** - Beautiful SVG icons
- **[Class Variance Authority](https://cva.style/)** - Component variant management

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
docker-compose -f docker-compose.backend.yml up --build
```

This is especially useful for ensuring consistent development environments across team members.

---

## 📁 Project Structure

```text
vigovia-assignment/
├── public/                     # Static assets
│   ├── activities/            # Activity images
│   ├── explore/              # Exploration images
│   ├── final-logo-2.png      # Main logo
│   └── nz-hero.jpeg          # Hero background
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   └── generate-pdf/ # PDF generation endpoint
│   │   ├── form/             # Itinerary form page
│   │   ├── preview-itinerary/ # PDF preview page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── comman/           # Common components
│   │   ├── form/             # Form-related components
│   │   ├── landing/          # Landing page components
│   │   ├── pdf/              # PDF template components
│   │   └── ui/               # UI component library
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── pdfGenerator.ts   # PDF generation logic
│   │   ├── schema.ts         # Zod validation schemas
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── utils.ts          # Utility functions
├── components.json           # shadcn/ui configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

---

## 🧩 Core Components

### Landing Page Components

#### Header.tsx

- Navigation with Vigovia branding
- User authentication placeholder
- Generate Itinerary CTA button
- Responsive mobile menu

#### Hero.tsx

- Full-screen hero section with New Zealand imagery
- Compelling headline and description
- Background image optimization

#### AboutSection.tsx

- Interactive feature showcase
- Dynamic image switching
- Three main features: Food & Wine, Adventure, Nature

#### ActivitySection.tsx

- Modal-based activity exploration
- 10 different New Zealand activities
- Detailed descriptions and pricing
- Image gallery with fallback colors

### Form Components

#### ItineraryForm.tsx

- Main form component with React Hook Form
- Zod validation integration
- Dynamic day management
- Customer information collection
- PDF generation trigger

#### DayCard.tsx

- Individual day planning interface
- Activity, transfer, and flight management
- Add/remove functionality for dynamic content

#### ActivityCard.tsx, TransferCard.tsx, FlightCard.tsx

- Specialized input cards for different content types
- Consistent styling and validation
- Remove functionality with confirmation

### PDF Components

#### TravelItinerary.tsx

- Main PDF template component
- Structured layout for professional output
- Integration with all sub-components

#### PDF Sub-components

- `ItineraryHeader.tsx` - PDF header with branding
- `DayItinerary.tsx` - Daily schedule layout
- `FlightSummary.tsx` - Flight information table
- `HotelBookings.tsx` - Accommodation details
- `PaymentPlan.tsx` - Payment schedule
- `Footer.tsx` - PDF footer with contact info

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

#### Features

- Headless Chrome rendering
- Print-optimized CSS injection
- Intelligent filename generation
- Error handling and logging
- Development/production environment detection

---

## 🎨 Design System

### Color Palette

```css
/* Vigovia Brand Colors */
--vigovia-cta: #541C9C      /* Primary CTA color */
--vigovia-accent: #936FE0   /* Accent purple */
--vigovia-hover: #680099    /* Hover states */
--vigovia-light: #FBF4FF    /* Light background */
--vigovia-dark: #321E5D     /* Dark text */
```

### Typography

- **Primary Font**: Geist Sans (Vercel's font family)
- **Monospace**: Geist Mono
- **Fallbacks**: System font stack for reliability

### Button Variants

```typescript
// Custom Vigovia button variants
"vigovia"; // Primary brand button
"vigovia-outline"; // Outlined version
"vigovia-accent"; // Accent color button
"vigovia-gradient"; // Gradient background
```

### Spacing & Layout

- **Container**: Max-width 7xl (1280px) with centered layout
- **Spacing**: Consistent 8px base unit system
- **Breakpoints**: Mobile-first responsive design
- **Grid**: CSS Grid and Flexbox for modern layouts

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

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Set production environment variables
3. **Deploy**: Automatic deployment on every push to main branch

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
- `docker-compose.backend.yml`: Configuration for running only the backend
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

## 🤝 Contributing

### Code Standards

- **TypeScript**: Use strict typing throughout
- **ESLint**: Follow configured linting rules
- **Prettier**: Code formatting consistency
- **Component Structure**: Follow established patterns
- **Naming Conventions**: Use descriptive, consistent names

### Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm run test
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

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Vercel** for hosting and deployment platform
- **shadcn** for the beautiful UI component library
- **Tailwind CSS** for the utility-first CSS framework
- **New Zealand Tourism** for inspiration and imagery

---
