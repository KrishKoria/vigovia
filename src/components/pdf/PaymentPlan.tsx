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
    <div className="mb-8 page-break-before">
      <h2 className="text-2xl font-bold text-black mb-6">
        Payment <span className="text-purple-600">Plan</span>
      </h2>

      <div className="relative mb-4">
        <div className="flex items-center">
          <div className="bg-purple-200 px-6 py-3 rounded-l-lg relative">
            <span className="text-black font-medium">Total Amount</span>
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-l-[20px] border-l-purple-200 translate-x-full"></div>
          </div>
          <div className="flex-1 bg-gray-100 px-6 py-3 rounded-r-lg ml-5">
            <span className="text-black font-bold">₹ {totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="flex items-center">
          <div className="bg-purple-200 px-6 py-3 rounded-l-lg relative">
            <span className="text-black font-medium">TCS</span>
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-l-[20px] border-l-purple-200 translate-x-full"></div>
          </div>
          <div className="flex-1 bg-gray-100 px-6 py-3 rounded-r-lg ml-5">
            <span className="text-black">{tcs}</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg">
        <div className="grid grid-cols-3 bg-purple-800 text-white font-semibold">
          <div className="px-6 py-4 text-center rounded-tl-lg">Installment</div>
          <div className="px-6 py-4 text-center">Amount</div>
          <div className="px-6 py-4 text-center rounded-tr-lg">Due Date</div>
        </div>

        {installments.map((installment, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 ${
              index % 2 === 0 ? "bg-purple-50" : "bg-white"
            }`}
          >
            <div className="px-6 py-4 text-center text-gray-700">
              {installment.installment}
            </div>
            <div className="px-6 py-4 text-center text-black font-medium">
              {installment.amount}
            </div>
            <div className="px-6 py-4 text-center text-gray-700">
              {installment.dueDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
