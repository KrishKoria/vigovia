import { Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
export default function ActivityCard({
  dayIndex,
  activityIndex,
  form,
  onRemove,
  canRemove,
}: {
  dayIndex: number;
  activityIndex: number;
  form: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <Card className="mb-4 border-[#936FE0]/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="border-[#936FE0] text-[#541C9C]">
            Activity {activityIndex + 1}
          </Badge>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Activity ID</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.id`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="ACT001"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Activity Name</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.name`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="Gardens by the Bay"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Location</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.location`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="Singapore"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Duration</Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.duration`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="2 hours"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.price`,
                { valueAsNumber: true }
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="50.00"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#321E5D] font-medium">
              Image URL (optional)
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.image`
              )}
              className="border-[#936FE0] focus:border-[#541C9C]"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label className="text-[#321E5D] font-medium">Description</Label>
          <Textarea
            {...form.register(
              `days.${dayIndex}.activities.${activityIndex}.description`
            )}
            className="border-[#936FE0] focus:border-[#541C9C]"
            placeholder="Explore the iconic Gardens by the Bay..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
