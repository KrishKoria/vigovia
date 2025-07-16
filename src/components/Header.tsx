import Image from "next/image";
import logo from "@public/final-logo.png";
export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Image src={logo} alt="Vigovia" className="h-8" />
        <div>
          <h1 className="text-3xl font-bold text-[#321E5D]">vigovia</h1>
          <p className="text-sm text-[#680099] font-medium">PLAN.PACK.GO</p>
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
