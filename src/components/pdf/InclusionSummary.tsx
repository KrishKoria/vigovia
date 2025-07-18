import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Inclusion {
  category: string;
  count: number;
  details: string;
  status: string;
}

interface InclusionSummaryProps {
  inclusions: Inclusion[];
}

export function InclusionSummary({ inclusions }: InclusionSummaryProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Inclusion <span className="text-vigovia-cta">Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-4 gap-4 p-4 bg-vigovia-dark text-vigovia-light font-medium text-sm">
          <div>Category</div>
          <div>Count</div>
          <div>Details</div>
          <div>Status / Comments</div>
        </div>

        {inclusions.map((inclusion, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0 bg-vigovia-light/30"
          >
            <div className="text-vigovia-dark font-medium">
              {inclusion.category}
            </div>
            <div className="text-vigovia-dark text-center">
              {inclusion.count}
            </div>
            <div className="text-vigovia-dark text-sm">{inclusion.details}</div>
            <div className="text-vigovia-dark text-sm">{inclusion.status}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
