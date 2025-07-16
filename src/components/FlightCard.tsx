import { Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function FlightCard({
  dayIndex,
  flightIndex,
  form,
  onRemove,
}: {
  dayIndex: number;
  flightIndex: number;
  form: any;
  onRemove: () => void;
}) {
  return (
    <Card className="mb-4 border-[#936FE0]/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="border-[#936FE0] text-[#541C9C]">
            Flight {flightIndex + 1}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#321E5D] font-medium">Flight ID</Label>
            <Input
              {...form.register(`days.${dayIndex}.flights.${flightIndex}.id`)}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="FLT001"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">Airline</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.airline`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="Singapore Airlines"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">Flight Number</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.flightNumber`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="SQ123"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">Class</Label>
            <Select
              onValueChange={(value) =>
                form.setValue(
                  `days.${dayIndex}.flights.${flightIndex}.class`,
                  value
                )
              }
            >
              <SelectTrigger className="border-[#936FE0] focus:border-[#541C9C]">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">From Airport</Label>
            <Input
              {...form.register(`days.${dayIndex}.flights.${flightIndex}.from`)}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="JFK"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">To Airport</Label>
            <Input
              {...form.register(`days.${dayIndex}.flights.${flightIndex}.to`)}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="SIN"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">Departure Time</Label>
            <Input
              type="datetime-local"
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.departure`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">Arrival Time</Label>
            <Input
              type="datetime-local"
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.arrival`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
            />
          </div>
          <div>
            <Label className="text-[#321E5D] font-medium">Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.price`,
                { valueAsNumber: true }
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="800.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
