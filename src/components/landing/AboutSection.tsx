import { MapPin } from "lucide-react";
import wineImage from "../../../public/wine-tasting.jpg";
// import adventureImage from "@/assets/adventure.jpg";
// import natureImage from "@/assets/nature.jpg";
import Image from "next/image";

const AboutSection = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-icon-purple" />,
      title: "Food and Wine Tours",
      description:
        "Embark on a culinary journey through New Zealand's renowned wine regions. Taste our fermented grapes, dive into farm-to-table dining experiences at Hawke's Bay. Indulge in farm-to-table dining experiences and discover stunning vineyards and rolling hills.",
      image: wineImage,
    },
    {
      icon: <MapPin className="h-8 w-8 text-icon-purple" />,
      title: "Adventure Activities",
      description:
        "Feel the rush in the adventure capital of the world! Go bungeejumping in Queenstown, hike the rugged trails of Tongariro, or try white-water rafting in the untamed rivers.",
      // image: adventureImage,
    },
    {
      icon: <MapPin className="h-8 w-8 text-icon-purple" />,
      title: "Nature Escapades",
      description:
        "Discover nature at its finest. Visit Fiordland National Park's magical Milford Sound, hike through the lush greenery of Abel Tasman, or explore Rotorua's geothermal wonders and serene lakes.",
      // image: natureImage,
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-8">
            About <span className="text-primary">New Zealand</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <Image
              src={wineImage}
              alt="New Zealand Adventure"
              className="w-full h-[600px] object-cover rounded-lg"
            />
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Your Gateway to New Zealand Adventures
              </h3>
              <p className="text-muted-foreground">
                Welcome to New Zealand, a paradise of majestic mountains,
                pristine beaches, and vibrant culture. From adrenaline-pumping
                activities to tranquil natural wonders, this land offers
                unforgettable experiences for every traveler. Explore, indulge,
                and let New Zealand leave you awestruck.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
