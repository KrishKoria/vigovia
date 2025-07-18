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
    <Card className="mb-6 border-2 border-[#936FE0]/30 shadow-lg rounded-xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Badge
            variant="outline"
            className="border-2 border-[#936FE0] text-[#541C9C] font-semibold text-sm px-4 py-2 rounded-lg"
          >
            Activity {activityIndex + 1}
          </Badge>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 p-3 rounded-xl"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Activity ID
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.id`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="ACT001"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Activity Name
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.name`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="Gardens by the Bay"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Location
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.location`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="Singapore"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Duration
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.duration`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="2 hours"
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
                `days.${dayIndex}.activities.${activityIndex}.price`,
                { valueAsNumber: true }
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="50.00"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
              <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
              Image URL (optional)
            </Label>
            <Input
              {...form.register(
                `days.${dayIndex}.activities.${activityIndex}.image`
              )}
              className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl h-12 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base px-4"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Label className="text-[#321E5D] font-semibold text-base flex items-center gap-2">
            <span className="w-2 h-2 bg-[#541C9C] rounded-full"></span>
            Description
          </Label>
          <Textarea
            {...form.register(
              `days.${dayIndex}.activities.${activityIndex}.description`
            )}
            className="border-2 border-[#936FE0]/40 focus:border-[#541C9C] focus:ring-2 focus:ring-[#541C9C]/20 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm text-base p-4 min-h-[120px]"
            placeholder="Explore the iconic Gardens by the Bay..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
