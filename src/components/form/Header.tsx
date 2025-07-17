import Image from "next/image";
export default function Header() {
  return (
    <div className="text-center mb-4">
      <div className="flex items-center justify-center ">
        <div className="h-32 w-auto flex items-center">
          <Image
            src="/final-logo-2.png"
            alt="Viglovia Logo"
            width={150}
            height={150}
            className="object-contain h-full w-auto"
            priority
          />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-[#321E5D] mb-2">
        Create Your Itinerary
      </h2>
      <p className="text-gray-600">
        Fill in the details below to generate your travel itinerary
      </p>
    </div>
  );
}
