import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  service: string;
  details: string;
}

interface ScopeOfServiceProps {
  services: Service[];
}

export function ScopeOfService({ services }: ScopeOfServiceProps) {
  return (
    <Card className="mb-8 page-break-before">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Scope Of <span className="text-vigovia-cta">Service</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-4 p-4 bg-vigovia-dark text-vigovia-light font-medium">
          <div>Service</div>
          <div>Details</div>
        </div>

        {services.map((service, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0 bg-vigovia-light/30"
          >
            <div className="text-vigovia-dark font-medium">
              {service.service}
            </div>
            <div className="text-vigovia-dark text-sm">{service.details}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
