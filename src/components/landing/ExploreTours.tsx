import { ChevronRight } from "lucide-react";

const ExploreMoreSection = () => {
  const destinations = [
    {
      name: "MALAYSIA",
      image: "/explore/malaysia.jpg",
    },
    {
      name: "SRILANKA",
      image: "/explore/sri_lanka.jpg",
    },
    {
      name: "PARIS",
      image: "/explore/paris.jpg",
    },
    {
      name: "BARCELONA",
      image: "/explore/barcelona.jpg",
    },
    {
      name: "ROME",
      image: "/explore/rome.jpg",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            Explore <span className="text-primary">More</span>
          </h2>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>

        <div className="flex justify-center space-x-8 overflow-x-auto">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 min-w-[120px]"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                {destination.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMoreSection;
