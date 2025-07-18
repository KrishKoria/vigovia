import Image from "next/image";
export default function Header() {
  return (
    <div className="text-center mb-12 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FBF4FF]/0 via-[#FBF4FF]/80 to-[#FBF4FF]/0 rounded-3xl"></div>
      <div className="relative z-10 py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="h-32 w-auto flex items-center p-4 bg-white/90 rounded-2xl shadow-lg backdrop-blur-sm border border-[#936FE0]/20">
            <Image
              src="/final-logo-2.png"
              alt="Vigovia Logo"
              width={180}
              height={180}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#541C9C] via-[#680099] to-[#936FE0] bg-clip-text text-transparent">
            Create Your Itinerary
          </h2>
          <div className="flex items-center justify-center gap-3 text-[#680099] font-medium">
            <p className="text-xl">
              Fill in the details below to generate your travel itinerary
            </p>
          </div>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#541C9C] to-[#936FE0] rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
