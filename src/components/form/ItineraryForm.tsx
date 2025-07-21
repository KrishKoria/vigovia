"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MapPin, Download, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Header from "./Header";
import DayCard from "./DayCard";
import { ItineraryFormData, itinerarySchema } from "@/lib/schema";
import { transformToBackendFormat } from "@/lib/dataTransformer";
import { backendPdfService } from "@/lib/backendPdfService";
import {
  ErrorHandler,
  ErrorRecovery,
  handlePdfGenerationError,
  shouldShowFallback,
  canRetryOperation,
  ErrorInfo,
  ErrorCategory,
} from "@/lib/errorHandler";
import {
  ErrorDisplay,
  SimpleErrorDisplay,
  SuccessDisplay,
} from "@/components/ui/ErrorDisplay";
import {
  validateItineraryForm,
  convertToErrorHandlerFormat,
} from "@/lib/formValidation";

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
  const [error, setError] = useState<string | null>(null);

  const [isGeneratingBackend, setIsGeneratingBackend] = useState(false);
  const [backendError, setBackendError] = useState<ErrorInfo | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      tripTitle: "",
      destination: "",
      startDate: "",
      endDate: "",
      numberOfDays: 1,
      numberOfTravellers: 1,
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
    setError(null);
    try {
      await generateItineraryPDF(data);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate PDF. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackendPdfGeneration = async (data: ItineraryFormData) => {
    setIsGeneratingBackend(true);
    setBackendError(null);
    setSuccessMessage(null);

    try {
      console.log("Starting backend PDF generation...");

      const validation = validateItineraryForm(data);
      if (!validation.isValid) {
        const validationErrorInfo = convertToErrorHandlerFormat(validation);
        setBackendError(validationErrorInfo);
        return;
      }

      const backendData = transformToBackendFormat(data);
      console.log("Data transformed for backend:", backendData);

      const context = {
        formData: data,
        retryAttempt: 0,
        timestamp: new Date(),
      };

      const pdfBlob = await backendPdfService.generatePDF(backendData);

      const filename = backendPdfService.generateFilename({
        destination: data.destination,
        customerName: data.customerName,
        startDate: data.startDate,
      });

      backendPdfService.downloadPdf(pdfBlob, filename);

      console.log("Backend PDF generation completed successfully");
      setSuccessMessage(`PDF generated successfully! File: ${filename}`);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Backend PDF generation failed:", error);

      ErrorHandler.logError(error, "Backend PDF Generation");

      const errorInfo = handlePdfGenerationError(error);

      if (errorInfo.category === ErrorCategory.NETWORK) {
        errorInfo.suggestions.unshift(
          "Your internet connection may be unstable",
          "The backend server might be temporarily unavailable"
        );
      }

      setBackendError(errorInfo);
    } finally {
      setIsGeneratingBackend(false);
    }
  };

  const handleRetryBackendGeneration = async () => {
    if (!backendError || !canRetryOperation(backendError)) {
      return;
    }

    setIsRetrying(true);
    setBackendError(null);

    try {
      const formData = form.getValues();

      const recoveryResult = await ErrorRecovery.attemptRecovery(
        backendError,
        () => handleBackendPdfGeneration(formData)
      );

      if (!recoveryResult.success && recoveryResult.error) {
        setBackendError(recoveryResult.error);
      }
    } catch (error) {
      const errorInfo = handlePdfGenerationError(error);
      setBackendError(errorInfo);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleFallbackToClient = async () => {
    setBackendError(null);
    const formData = form.getValues();
    await onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF4FF] via-white to-[#F8F4FF] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Header />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <Card className="border-2 border-[#936FE0]/30 shadow-xl backdrop-blur-sm bg-white/95 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#541C9C] via-[#680099] to-[#936FE0] text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#541C9C]/90 to-[#680099]/90"></div>
              <CardTitle className="flex items-center gap-4 p-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <MapPin className="h-8 w-8" />
                </div>
                <span className="text-2xl font-bold">Trip Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10 bg-gradient-to-b from-white to-[#FBF4FF]/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label
                    htmlFor="tripTitle"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Trip Title
                  </Label>
                  <Input
                    id="tripTitle"
                    {...form.register("tripTitle")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                    placeholder="e.g., Singapore Adventure"
                  />
                  {form.formState.errors.tripTitle && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.tripTitle.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <Label
                    htmlFor="destination"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Destination
                  </Label>
                  <Input
                    id="destination"
                    {...form.register("destination")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                    placeholder="e.g., Singapore"
                  />
                  {form.formState.errors.destination && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.destination.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label
                    htmlFor="startDate"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...form.register("startDate")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <Label
                    htmlFor="endDate"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...form.register("endDate")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                  />
                  {form.formState.errors.endDate && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label
                    htmlFor="numberOfDays"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
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
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                  />
                  {form.formState.errors.numberOfDays && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.numberOfDays.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <Label
                    htmlFor="numberOfTravellers"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Number of Travellers
                  </Label>
                  <Input
                    id="numberOfTravellers"
                    type="number"
                    min="1"
                    max="20"
                    {...form.register("numberOfTravellers", {
                      valueAsNumber: true,
                    })}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                    placeholder="e.g., 2"
                  />
                  {form.formState.errors.numberOfTravellers && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.numberOfTravellers.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-[#936FE0]/30"></div>
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-6 py-2 bg-white text-[#680099] font-bold rounded-lg border border-[#936FE0]/30">
                    Customer Details
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Label
                    htmlFor="customerName"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Customer Name
                  </Label>
                  <Input
                    id="customerName"
                    {...form.register("customerName")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.customerName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <Label
                    htmlFor="customerEmail"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Email
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...form.register("customerEmail")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {form.formState.errors.customerEmail.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <Label
                    htmlFor="customerPhone"
                    className="text-[#321E5D] font-semibold text-base flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-[#541C9C] rounded-full"></span>
                    Phone
                  </Label>
                  <Input
                    id="customerPhone"
                    {...form.register("customerPhone")}
                    className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-14 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg px-4"
                    placeholder="+1234567890"
                  />
                  {form.formState.errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
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

          <div className="text-center bg-gradient-to-r from-white via-[#FBF4FF]/50 to-white p-8 rounded-2xl border border-[#936FE0]/20">
            {successMessage && (
              <SuccessDisplay
                message={successMessage}
                onDismiss={() => setSuccessMessage(null)}
                className="mb-6"
              />
            )}

            {error && (
              <SimpleErrorDisplay
                message={error}
                onRetry={() => {
                  setError(null);
                  const formData = form.getValues();
                  onSubmit(formData);
                }}
                onDismiss={() => setError(null)}
                className="mb-6"
              />
            )}

            {backendError && (
              <ErrorDisplay
                errorInfo={backendError}
                onRetry={
                  canRetryOperation(backendError)
                    ? handleRetryBackendGeneration
                    : undefined
                }
                onFallback={
                  shouldShowFallback(backendError)
                    ? handleFallbackToClient
                    : undefined
                }
                onDismiss={() => setBackendError(null)}
                showRetryButton={!isRetrying}
                className="mb-6"
              />
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                type="submit"
                disabled={isGenerating || isGeneratingBackend}
                className="bg-gradient-to-r from-[#541C9C] via-[#680099] to-[#936FE0] hover:from-[#680099] hover:via-[#541C9C] hover:to-[#680099] text-white px-12 py-6 text-lg font-bold min-w-[280px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg">Generating PDF...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5" />
                    <span className="text-lg">Generate PDF (Client)</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  const formData = form.getValues();
                  form.handleSubmit((data) =>
                    handleBackendPdfGeneration(data)
                  )();
                }}
                disabled={isGenerating || isGeneratingBackend}
                className="bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#1e40af] hover:from-[#1d4ed8] hover:via-[#2563eb] hover:to-[#1d4ed8] text-white px-12 py-6 text-lg font-bold min-w-[280px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGeneratingBackend ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg">Generating PDF...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5" />
                    <span className="text-lg">Generate PDF (Backend)</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Help text */}
            <div className="mt-4 text-sm text-[#680099]/70">
              <p>Choose your preferred PDF generation method:</p>
              <p className="mt-1">
                <span className="font-medium">Client:</span> Generated in your
                browser (faster, works offline) |
                <span className="font-medium ml-2">Backend:</span> Generated on
                server (more features, requires connection)
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
