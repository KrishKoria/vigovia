import { Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    <Card className="mb-6 border-2 border-[#936FE0]/30 shadow-lg rounded-xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Badge
            variant="outline"
            className="border-2 border-[#936FE0] text-[#541C9C] font-semibold text-sm px-4 py-2 rounded-lg"
          >
            Flight {flightIndex + 1}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 p-3 rounded-xl"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Flight ID
            </Label>
            <Input
              {...form.register(`days.${dayIndex}.flights.${flightIndex}.id`)}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="FLT001"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Airline
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.airline`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="Singapore Airlines"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Flight Number
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.flightNumber`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="SQ123"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Class
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue(
                  `days.${dayIndex}.flights.${flightIndex}.class`,
                  value
                )
              }
            >
              <SelectTrigger className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base">
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
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              From Airport
            </Label>
            <Input
              {...form.register(`days.${dayIndex}.flights.${flightIndex}.from`)}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="JFK"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              To Airport
            </Label>
            <Input
              {...form.register(`days.${dayIndex}.flights.${flightIndex}.to`)}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="SIN"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Departure Time
            </Label>
            <Input
              type="datetime-local"
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.departure`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Arrival Time
            </Label>
            <Input
              type="datetime-local"
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.arrival`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Price ($)
            </Label>
            <Input
              type="number"
              step="0.01"
              {...form.register(
                `days.${dayIndex}.flights.${flightIndex}.price`,
                { valueAsNumber: true }
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="800.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
