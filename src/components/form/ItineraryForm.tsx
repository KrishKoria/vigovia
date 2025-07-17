"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Header from "./Header";
import DayCard from "./DayCard";
import { ItineraryFormData, itinerarySchema } from "@/lib/schema";

const generateItineraryPDF = async (data: ItineraryFormData) => {
  try {
    const { generateItineraryPDF } = await import("../../lib/pdfGenerator");
    return await generateItineraryPDF(data);
  } catch (error) {
    console.error("PDF generator failed:", error);
  }
};

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

  const handleDaysChange = (days: number) => {
    const currentDays = form.getValues("days");

    if (days > currentDays.length) {
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
        <Header />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-[#936FE0] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#541C9C] to-[#680099] text-white">
              <CardTitle className="flex items-center gap-2 p-1.5">
                <MapPin className="h-5 w-5" />
                Trip Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
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
                <div className="space-y-2">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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

          {dayFields.map((day, dayIndex) => (
            <DayCard
              key={day.id}
              dayIndex={dayIndex}
              form={form}
              dayNumber={day.dayNumber}
            />
          ))}

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
