import Image from "next/image";

interface FixedFooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export function FixedFooter({
  companyName = "Vigovia Tech Pvt. Ltd",
  address = "Registered Office: Hd-109 Cinnabar Hills, Links Business Park, Karnataka, India.",
  phone = "+91-9999999999",
  email = "Contact@Vigovia.Com",
}: FixedFooterProps) {
  return (
    <div className="fixed-footer">
      <div className="flex justify-between items-center">
        <div className="text-vigovia-dark flex-1">
          <h4 className="font-bold mb-1 text-sm">{companyName}</h4>
          <p className="text-xs mb-1 leading-tight">{address}</p>
          <div className="text-xs space-y-0">
            <span className="font-medium">Phone:</span> {phone} |{" "}
            <span className="font-medium">Email:</span> {email}
          </div>
        </div>
        <div className="flex items-center ml-4">
          <div className="h-12 w-auto flex items-center">
            <Image
              src="/final-logo-2.png"
              alt="Vigovia Logo"
              width={60}
              height={60}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
