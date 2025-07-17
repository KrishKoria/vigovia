interface FooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export function Footer({
  companyName = "Vigovia Tech Pvt. Ltd",
  address = "Registered Office: Hd-109 Cinnabar Hills, Links Business Park, Karnataka, India.",
  phone = "+91-9999999999",
  email = "Contact@Vigovia.Com",
}: FooterProps) {
  return (
    <div className="bg-vigovia-light p-6 rounded-b-lg">
      <div className="flex justify-between items-end">
        <div className="text-vigovia-dark">
          <h4 className="font-bold mb-2">{companyName}</h4>
          <p className="text-sm mb-1">{address}</p>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Phone:</span> {phone}
            </p>
            <p>
              <span className="font-medium">Email ID:</span> {email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-vigovia-dark">
            <div className="text-2xl font-bold text-vigovia-cta mb-1">
              vigovia
            </div>
            <div className="text-xs text-vigovia-dark/70">PLAN.PACK.GO</div>
          </div>
          <div className="w-8 h-8 bg-vigovia-cta rounded-full flex items-center justify-center">
            <span className="text-vigovia-light font-bold">✈</span>
          </div>
        </div>
      </div>
    </div>
  );
}
