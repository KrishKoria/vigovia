import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VisaDetailsProps {
  visaType: string;
  validity: string;
  processingDate: string;
}

export function VisaDetails({
  visaType,
  validity,
  processingDate,
}: VisaDetailsProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Visa <span className="text-vigovia-cta">Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-vigovia-light/50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-vigovia-dark/70 text-sm mb-1">Visa Type :</p>
              <p className="text-vigovia-dark font-medium">{visaType}</p>
            </div>
            <div>
              <p className="text-vigovia-dark/70 text-sm mb-1">Validity:</p>
              <p className="text-vigovia-dark font-medium">{validity}</p>
            </div>
            <div>
              <p className="text-vigovia-dark/70 text-sm mb-1">
                Processing Date :
              </p>
              <p className="text-vigovia-dark font-medium">{processingDate}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-vigovia-dark mb-6">
            PLAN.PACK.GO!
          </h3>
          <Button variant="vigovia" size="lg" className="px-12 py-3 text-lg">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
