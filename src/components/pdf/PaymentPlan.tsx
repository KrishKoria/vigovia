import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentInstallment {
  installment: string;
  amount: string;
  dueDate: string;
}

interface PaymentPlanProps {
  totalAmount: string;
  tcs: string;
  installments: PaymentInstallment[];
}

export function PaymentPlan({
  totalAmount,
  tcs,
  installments,
}: PaymentPlanProps) {
  return (
    <Card className="mb-8 page-break-before">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Payment <span className="text-vigovia-cta">Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4 p-3 bg-vigovia-light/50 rounded-lg">
          <div className="bg-vigovia-accent/20 px-3 py-2 rounded min-w-32">
            <span className="text-vigovia-dark font-medium">Total Amount</span>
          </div>
          <div className="flex-1 text-vigovia-dark font-bold">
            {`$${totalAmount}`}
          </div>
        </div>

        {/* TCS */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-vigovia-light/50 rounded-lg">
          <div className="bg-vigovia-accent/20 px-3 py-2 rounded min-w-32">
            <span className="text-vigovia-dark font-medium">TCS</span>
          </div>
          <div className="flex-1 text-vigovia-dark">{tcs}</div>
        </div>

        {/* Installments Table */}
        <div className="mb-6">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-vigovia-dark text-vigovia-light font-medium rounded-t-lg">
            <div>Installment</div>
            <div>Amount</div>
            <div>Due Date</div>
          </div>

          {/* Rows */}
          {installments.map((installment, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0 bg-vigovia-light/30"
            >
              <div className="text-vigovia-dark">{installment.installment}</div>
              <div className="text-vigovia-dark font-medium">
                {installment.amount}
              </div>
              <div className="text-vigovia-dark">{installment.dueDate}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
