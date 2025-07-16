"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Plane,
  Car,
  Camera,
} from "lucide-react";
import { generateItineraryPDF } from "@/lib/pdfGenerator";
import VigloviaLogo from "./VigloviaLogo";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Header from "./Header";
import TransferCard from "./TransferCard";
import FlightCard from "./FlightCard";
import ActivityCard from "./ActivityCard";

// Zod schema for form validation
const activitySchema = z.object({
  id: z.string().min(1, "Activity ID is required"),
  name: z.string().min(1, "Activity name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  image: z.string().optional(),
  location: z.string().min(1, "Location is required"),
});

const transferSchema = z.object({
  id: z.string().min(1, "Transfer ID is required"),
  type: z.string().min(1, "Vehicle type is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  dropoffTime: z.string().min(1, "Dropoff time is required"),
  from: z.string().min(1, "From location is required"),
  to: z.string().min(1, "To location is required"),
});

const flightSchema = z.object({
  id: z.string().min(1, "Flight ID is required"),
  airline: z.string().min(1, "Airline is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  departure: z.string().min(1, "Departure time is required"),
  arrival: z.string().min(1, "Arrival time is required"),
  from: z.string().min(1, "From airport is required"),
  to: z.string().min(1, "To airport is required"),
  price: z.number().min(0, "Price must be positive"),
  class: z.string().min(1, "Class is required"),
});

const daySchema = z.object({
  dayNumber: z.number().min(1),
  date: z.string().min(1, "Date is required"),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required"),
  transfers: z.array(transferSchema).optional(),
  flights: z.array(flightSchema).optional(),
});

const itinerarySchema = z.object({
  tripTitle: z.string().min(1, "Trip title is required"),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  numberOfDays: z.number().min(1, "Number of days must be at least 1"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  days: z.array(daySchema),
});

type ItineraryFormData = z.infer<typeof itinerarySchema>;

export default function ItineraryForm() {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      tripTitle: "",
      destination: "",
      startDate: "",
      endDate: "",
      numberOfDays: 1,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      days: [
        {
          dayNumber: 1,
          date: "",
          activities: [
            {
              id: "",
              name: "",
              description: "",
              price: 0,
              duration: "",
              image: "",
              location: "",
            },
          ],
          transfers: [],
          flights: [],
        },
      ],
    },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const watchedDays = form.watch("numberOfDays");

  // Update days array when number of days changes
  const handleDaysChange = (days: number) => {
    const currentDays = form.getValues("days");

    if (days > currentDays.length) {
      // Add new days
      for (let i = currentDays.length; i < days; i++) {
        appendDay({
          dayNumber: i + 1,
          date: "",
          activities: [
            {
              id: "",
              name: "",
              description: "",
              price: 0,
              duration: "",
              image: "",
              location: "",
            },
          ],
          transfers: [],
          flights: [],
        });
      }
    } else if (days < currentDays.length) {
      // Remove excess days
      for (let i = currentDays.length - 1; i >= days; i--) {
        removeDay(i);
      }
    }
  };

  const onSubmit = async (data: ItineraryFormData) => {
    setIsGenerating(true);
    try {
      await generateItineraryPDF(data);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF4FF] to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Header />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Trip Information */}
          <Card className="border-[#936FE0] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#541C9C] to-[#680099] text-white">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="tripTitle"
                    className="text-[#321E5D] font-medium"
                  >
                    Trip Title
                  </Label>
                  <Input
                    id="tripTitle"
                    {...form.register("tripTitle")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                    placeholder="e.g., Singapore Adventure"
                  />
                  {form.formState.errors.tripTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.tripTitle.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="destination"
                    className="text-[#321E5D] font-medium"
                  >
                    Destination
                  </Label>
                  <Input
                    id="destination"
                    {...form.register("destination")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                    placeholder="e.g., Singapore"
                  />
                  {form.formState.errors.destination && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.destination.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="startDate"
                    className="text-[#321E5D] font-medium"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...form.register("startDate")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="endDate"
                    className="text-[#321E5D] font-medium"
                  >
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...form.register("endDate")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                  />
                  {form.formState.errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="numberOfDays"
                    className="text-[#321E5D] font-medium"
                  >
                    Number of Days
                  </Label>
                  <Input
                    id="numberOfDays"
                    type="number"
                    min="1"
                    max="30"
                    {...form.register("numberOfDays", {
                      valueAsNumber: true,
                      onChange: (e) =>
                        handleDaysChange(parseInt(e.target.value) || 1),
                    })}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                  />
                  {form.formState.errors.numberOfDays && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.numberOfDays.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="customerName"
                    className="text-[#321E5D] font-medium"
                  >
                    Customer Name
                  </Label>
                  <Input
                    id="customerName"
                    {...form.register("customerName")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.customerName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="customerEmail"
                    className="text-[#321E5D] font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...form.register("customerEmail")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.customerEmail.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="customerPhone"
                    className="text-[#321E5D] font-medium"
                  >
                    Phone
                  </Label>
                  <Input
                    id="customerPhone"
                    {...form.register("customerPhone")}
                    className="border-[#936FE0] focus:border-[#541C9C]"
                    placeholder="+1234567890"
                  />
                  {form.formState.errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.customerPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Itinerary */}
          {dayFields.map((day, dayIndex) => (
            <DayCard
              key={day.id}
              dayIndex={dayIndex}
              form={form}
              dayNumber={day.dayNumber}
            />
          ))}

          {/* Generate Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isGenerating}
              className="bg-[#541C9C] hover:bg-[#680099] text-white px-8 py-3 text-lg font-semibold min-w-[200px]"
            >
              {isGenerating ? "Generating PDF..." : "Generate Itinerary"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DayCard({
  dayIndex,
  form,
  dayNumber,
}: {
  dayIndex: number;
  form: any;
  dayNumber: number;
}) {
  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.activities`,
  });

  const {
    fields: transferFields,
    append: appendTransfer,
    remove: removeTransfer,
  } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.transfers`,
  });

  const {
    fields: flightFields,
    append: appendFlight,
    remove: removeFlight,
  } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.flights`,
  });

  return (
    <Card className="border-[#936FE0] shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#321E5D] to-[#541C9C] text-white">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Day {dayNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Day Date */}
        <div className="mb-6">
          <Label
            htmlFor={`days.${dayIndex}.date`}
            className="text-[#321E5D] font-medium"
          >
            Date
          </Label>
          <Input
            id={`days.${dayIndex}.date`}
            type="date"
            {...form.register(`days.${dayIndex}.date`)}
            className="border-[#936FE0] focus:border-[#541C9C] max-w-xs"
          />
        </div>

        {/* Activities Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#321E5D] flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Activities
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendActivity({
                  id: "",
                  name: "",
                  description: "",
                  price: 0,
                  duration: "",
                  image: "",
                  location: "",
                })
              }
              className="border-[#541C9C] text-[#541C9C] hover:bg-[#FBF4FF]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {activityFields.map((activity, activityIndex) => (
            <ActivityCard
              key={activity.id}
              dayIndex={dayIndex}
              activityIndex={activityIndex}
              form={form}
              onRemove={() => removeActivity(activityIndex)}
              canRemove={activityFields.length > 1}
            />
          ))}
        </div>

        {/* Transfers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#321E5D] flex items-center gap-2">
              <Car className="h-5 w-5" />
              Transfers
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendTransfer({
                  id: "",
                  type: "",
                  price: 0,
                  duration: "",
                  capacity: 1,
                  pickupTime: "",
                  dropoffTime: "",
                  from: "",
                  to: "",
                })
              }
              className="border-[#541C9C] text-[#541C9C] hover:bg-[#FBF4FF]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transfer
            </Button>
          </div>

          {transferFields.map((transfer, transferIndex) => (
            <TransferCard
              key={transfer.id}
              dayIndex={dayIndex}
              transferIndex={transferIndex}
              form={form}
              onRemove={() => removeTransfer(transferIndex)}
            />
          ))}
        </div>

        {/* Flights Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#321E5D] flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flights
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendFlight({
                  id: "",
                  airline: "",
                  flightNumber: "",
                  departure: "",
                  arrival: "",
                  from: "",
                  to: "",
                  price: 0,
                  class: "",
                })
              }
              className="border-[#541C9C] text-[#541C9C] hover:bg-[#FBF4FF]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Flight
            </Button>
          </div>

          {flightFields.map((flight, flightIndex) => (
            <FlightCard
              key={flight.id}
              dayIndex={dayIndex}
              flightIndex={flightIndex}
              form={form}
              onRemove={() => removeFlight(flightIndex)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
