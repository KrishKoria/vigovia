import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

export default function TransferCard({
  dayIndex,
  transferIndex,
  form,
  onRemove,
}: {
  dayIndex: number;
  transferIndex: number;
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
            Transfer {transferIndex + 1}
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
              Transfer ID
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.id`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="TRF001"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Vehicle Type
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue(
                  `days.${dayIndex}.transfers.${transferIndex}.type`,
                  value
                )
              }
            >
              <SelectTrigger className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="taxi">Taxi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              From
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.from`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="Hotel"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              To
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.to`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="Airport"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Pickup Time
            </Label>
            <Input
              type="time"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.pickupTime`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Dropoff Time
            </Label>
            <Input
              type="time"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.dropoffTime`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Duration
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.duration`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="45 minutes"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Capacity
            </Label>
            <Input
              type="number"
              min="1"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.capacity`,
                { valueAsNumber: true }
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="4"
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
                `days.${dayIndex}.transfers.${transferIndex}.price`,
                { valueAsNumber: true }
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="25.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
