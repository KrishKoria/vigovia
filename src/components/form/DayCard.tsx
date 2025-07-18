import { useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Camera, Car, Plane, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ActivityCard from "./ActivityCard";
import TransferCard from "./TransferCard";
import FlightCard from "./FlightCard";

export default function DayCard({
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
    <Card className="border-2 border-[#936FE0]/30 shadow-xl rounded-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-[#321E5D] to-[#541C9C] text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-3 p-2 text-xl">
          <Calendar className="h-6 w-6" />
          Day {dayNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-8 space-y-3">
          <Label
            htmlFor={`days.${dayIndex}.date`}
            className="text-[#321E5D] font-semibold text-base flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
            Date
          </Label>
          <Input
            id={`days.${dayIndex}.date`}
            type="date"
            {...form.register(`days.${dayIndex}.date`)}
            className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4 max-w-xs"
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#321E5D] flex items-center gap-3">
              <Camera className="h-6 w-6" />
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
              className="border-2 border-[#541C9C] text-[#541C9C] hover:bg-[#FBF4FF] hover:text-[#321E5D] transition-all duration-200 px-4 py-2 rounded-xl font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
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

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#321E5D] flex items-center gap-3">
              <Car className="h-6 w-6" />
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
              className="border-2 border-[#541C9C] text-[#541C9C] hover:bg-[#FBF4FF] hover:text-[#321E5D] transition-all duration-200 px-4 py-2 rounded-xl font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
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

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#321E5D] flex items-center gap-3">
              <Plane className="h-6 w-6" />
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
              className="border-2 border-[#541C9C] text-[#541C9C] hover:bg-[#FBF4FF] hover:text-[#321E5D] transition-all duration-200 px-4 py-2 rounded-xl font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
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
