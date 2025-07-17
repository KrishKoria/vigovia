import { Crown } from "lucide-react";

const ToursSection = () => {
  const tours = [
    {
      name: "Milford Sound Discovery",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: false,
    },
    {
      name: "Queenstown Adventure",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: false,
    },
    {
      name: "Bay of Islands Explorer",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: true,
    },
    {
      name: "Rotorua Cultural Experience",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: false,
    },
    {
      name: "Abel Tasman Coastal Trek",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: false,
    },
    {
      name: "Franz Josef Glacier Tour",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: false,
    },
    {
      name: "Wellington City & Wineries",
      duration: "7 Days 8 Nights",
      rate: "₹50,000",
      isPremium: false,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          All <span className="text-primary">Tours</span>
        </h2>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-primary text-white">
            <div className="px-6 py-4 text-center font-semibold">Tour Name</div>
            <div className="px-6 py-4 text-center font-semibold">Duration</div>
            <div className="px-6 py-4 text-center font-semibold">Rates</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {tours.map((tour, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-chat-color"
                }`}
              >
                <div className="px-6 py-4 text-center flex items-center justify-center space-x-2">
                  {tour.isPremium && <Crown className="h-5 w-5 text-primary" />}
                  <span className="text-foreground">{tour.name}</span>
                </div>
                <div className="px-6 py-4 text-center text-muted-foreground">
                  {tour.duration}
                </div>
                <div className="px-6 py-4 text-center text-foreground font-semibold">
                  {tour.rate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
