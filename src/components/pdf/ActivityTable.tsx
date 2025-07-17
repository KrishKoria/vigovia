import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  city: string;
  activity: string;
  type: string;
  timeRequired: string;
}

interface ActivityTableProps {
  activities: Activity[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Activity <span className="text-vigovia-cta">Table</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-vigovia-dark text-vigovia-light font-medium">
          <div>City</div>
          <div>Activity</div>
          <div>Type</div>
          <div>Time Required</div>
        </div>

        {/* Data Rows */}
        {activities.map((activity, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0 bg-vigovia-light/30"
          >
            <div className="text-vigovia-dark">{activity.city}</div>
            <div className="text-vigovia-dark">{activity.activity}</div>
            <div className="text-vigovia-dark">{activity.type}</div>
            <div className="text-vigovia-dark">{activity.timeRequired}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
