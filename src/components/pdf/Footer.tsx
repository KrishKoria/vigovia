import Image from "next/image";

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
    <div className="p-6 rounded-b-lg">
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
            <div className="h-16 w-auto flex items-center mb-2">
              <Image
                src="/final-logo-2.png"
                alt="Vigovia Logo"
                width={90}
                height={90}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
