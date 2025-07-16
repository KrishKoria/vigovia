import { useFieldArray } from "react-hook-form";
import FlightCard from "./FlightCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Camera, Car, Plane, Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ActivityCard from "./ActivityCard";
import TransferCard from "./TransferCard";

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
