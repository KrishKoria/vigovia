"use client";
import { MapPin } from "lucide-react";
import wineImage from "../../../public/wine-tasting.jpg";
import bungeejumpingImage from "../../../public/activities/bungee-jumping.jpg";
import rotoruaImage from "../../../public/activities/rotorua.jpg";
import Image from "next/image";
import { useState } from "react";

const AboutSection = () => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Food and Wine Tours",
      description:
        "Embark on a culinary journey through New Zealand's renowned wine regions like Marlborough and Hawke's Bay. Indulge in farm-to-table dining experiences amidst stunning vineyards and rolling hills.",
      image: wineImage,
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Adventure Activities",
      description:
        "Feel the rush in the adventure capital of the world! Go bungeejumping in Queenstown, hike the rugged trails of Tongariro, or try white-water rafting in the untamed rivers.",
      image: bungeejumpingImage,
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Nature Escapades",
      description:
        "Discover nature at its finest. Visit Fiordland National Park's magical Milford Sound, hike through the lush greenery of Abel Tasman, or explore Rotorua's geothermal wonders and serene lakes.",
      image: rotoruaImage,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-8">
            About <span className="text-primary">New Zealand</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="relative">
            <Image
              src={features[selectedFeature].image}
              alt={features[selectedFeature].title}
              className="w-full min-h-[620px] object-cover rounded-3xl shadow-lg transition-all duration-500 ease-in-out"
            />
            {selectedFeature === 0 && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                <p className="font-semibold">
                  {features[selectedFeature].title}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full relative">
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Your Gateway to New Zealand Adventures
              </h3>
              <p className="text-muted-foreground text-center max-w-lg mx-auto">
                Welcome to New Zealand, a paradise of majestic mountains,
                pristine beaches, and vibrant culture. From adrenaline-pumping
                activities to tranquil natural wonders, this land offers
                unforgettable experiences for every traveler. Explore, indulge,
                and let New Zealand leave you awestruck.
              </p>
            </div>

            {/* Feature cards in horizontal grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFeature(index)}
                  className={`border-2 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative min-h-[200px] ${
                    selectedFeature === index
                      ? "bg-primary/5 border-primary shadow-lg pb-12"
                      : "bg-white border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <div className="text-center space-y-3 h-full flex flex-col">
                    <div className="flex justify-center">{feature.icon}</div>
                    <h4
                      className={`font-semibold text-sm transition-colors ${
                        selectedFeature === index
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </div>
                  {selectedFeature === index && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                      <p className="text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                        Currently Viewing
                      </p>
                    </div>
                  )}
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
