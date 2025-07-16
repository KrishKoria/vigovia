import VigloviaLogo from "./VigloviaLogo";
export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <VigloviaLogo />
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
