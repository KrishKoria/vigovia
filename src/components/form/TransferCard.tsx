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
    <Card className="mb-4 border-[#936FE0]/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="border-[#936FE0] text-[#541C9C]">
            Transfer {transferIndex + 1}
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
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Transfer ID</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.id`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="TRF001"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Vehicle Type</Label>
            <Select
              onValueChange={(value) =>
                form.setValue(
                  `days.${dayIndex}.transfers.${transferIndex}.type`,
                  value
                )
              }
            >
              <SelectTrigger className="border-[#936FE0] focus:border-[#541C9C]">
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
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">From</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.from`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="Hotel"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">To</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.to`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="Airport"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Pickup Time</Label>
            <Input
              type="time"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.pickupTime`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Dropoff Time</Label>
            <Input
              type="time"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.dropoffTime`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Duration</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.duration`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="45 minutes"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Capacity</Label>
            <Input
              type="number"
              min="1"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.capacity`,
                { valueAsNumber: true }
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="4"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register(
                `days.${dayIndex}.transfers.${transferIndex}.price`,
                { valueAsNumber: true }
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="25.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
