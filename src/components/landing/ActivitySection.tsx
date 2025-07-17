"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ActivitiesSection = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const activities = [
    {
      id: "wine",
      name: "Wine Tasting",
      image: "/activities/wine-tasting.jpg",
      fallbackColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      icon: "🍷",
    },
    {
      id: "safari",
      name: "Wildlife Safari",
      image: "/activities/wildlife-safari.jpg",
      fallbackColor: "bg-gradient-to-br from-yellow-500 to-orange-500",
      icon: "🦁",
    },
    {
      id: "bungee",
      name: "Bungee Jumping",
      image: "/activities/bungee-jumping.jpg",
      fallbackColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
      icon: "🪂",
    },
    {
      id: "coromandel",
      name: "Coromandel",
      image: "/activities/coromandel.jpg",
      fallbackColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      icon: "🏖️",
    },
    {
      id: "tongariro",
      name: "Tongariro",
      image: "/activities/tongariro.jpg",
      fallbackColor: "bg-gradient-to-br from-gray-500 to-gray-700",
      icon: "🏔️",
    },
    {
      id: "wanaka",
      name: "Wanaka",
      image: "/activities/wanaka.jpg",
      fallbackColor: "bg-gradient-to-br from-blue-300 to-blue-500",
      icon: "🏞️",
    },
    {
      id: "aoraki",
      name: "Aoraki",
      image: "/activities/aoraki.jpg",
      fallbackColor: "bg-gradient-to-br from-gray-400 to-gray-600",
      icon: "🗻",
    },
    {
      id: "tekapo",
      name: "Lake Tekapo",
      image: "/activities/lake-tekapo.jpg",
      fallbackColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      icon: "🌊",
    },
    {
      id: "rotorua",
      name: "Rotorua",
      image: "/activities/rotorua.jpg",
      fallbackColor: "bg-gradient-to-br from-green-500 to-green-700",
      icon: "♨️",
    },
    {
      id: "waitomo",
      name: "Waitomo",
      image: "/activities/waitomo.jpg",
      fallbackColor: "bg-gradient-to-br from-teal-500 to-teal-700",
      icon: "💎",
    },
  ];

  const activityDetails = {
    wine: {
      title: "Wine Tasting Experience",
      description:
        "Discover New Zealand's world-renowned wine regions. Experience guided tastings at premium vineyards, learn about the winemaking process, and enjoy scenic views of rolling vine-covered hills. Perfect for wine enthusiasts and newcomers alike.",
      duration: "Half Day (4 hours)",
      price: "From ₹8,500 per person",
      highlights: [
        "Premium wine tastings",
        "Vineyard tours",
        "Cheese pairings",
        "Scenic landscapes",
      ],
    },
    safari: {
      title: "Wildlife Safari Adventure",
      description:
        "Explore New Zealand's unique wildlife in their natural habitat. Spot native birds, marine life, and endemic species while learning about conservation efforts.",
      duration: "Full Day (8 hours)",
      price: "From ₹12,000 per person",
      highlights: [
        "Native bird watching",
        "Marine wildlife",
        "Conservation education",
        "Photography opportunities",
      ],
    },
    bungee: {
      title: "Bungee Jumping Experience",
      description:
        "Take the ultimate leap of faith at one of New Zealand's iconic bungee jumping sites. Experience the thrill of freefall with stunning scenery all around.",
      duration: "2 hours",
      price: "From ₹15,000 per person",
      highlights: [
        "Professional instructors",
        "Safety certified",
        "Video recording",
        "Certificate of courage",
      ],
    },
    coromandel: {
      title: "Coromandel Peninsula",
      description:
        "Explore the stunning Coromandel Peninsula with its pristine beaches, ancient kauri forests, and charming coastal towns. Perfect for nature lovers and beach enthusiasts.",
      duration: "Full Day (8 hours)",
      price: "From ₹10,500 per person",
      highlights: [
        "Cathedral Cove",
        "Hot Water Beach",
        "Kauri forests",
        "Coastal scenery",
      ],
    },
    tongariro: {
      title: "Tongariro National Park",
      description:
        "Experience New Zealand's oldest national park, featuring active volcanoes, alpine lakes, and diverse landscapes. Home to the famous Tongariro Alpine Crossing.",
      duration: "Full Day (10 hours)",
      price: "From ₹14,000 per person",
      highlights: [
        "Alpine crossing",
        "Emerald Lakes",
        "Volcanic landscapes",
        "Mount Doom filming location",
      ],
    },
    wanaka: {
      title: "Wanaka Lake District",
      description:
        "Discover the tranquil beauty of Lake Wanaka, surrounded by mountains and offering year-round outdoor activities. Perfect for relaxation and adventure.",
      duration: "Full Day (8 hours)",
      price: "From ₹11,000 per person",
      highlights: [
        "Lake activities",
        "Mountain views",
        "That Wanaka Tree",
        "Outdoor adventures",
      ],
    },
    aoraki: {
      title: "Aoraki Mount Cook",
      description:
        "Visit New Zealand's highest peak and explore the surrounding national park. Experience stunning alpine scenery and unique glacial formations.",
      duration: "Full Day (10 hours)",
      price: "From ₹16,000 per person",
      highlights: [
        "Mount Cook views",
        "Glacial lakes",
        "Alpine hiking",
        "Stargazing opportunities",
      ],
    },
    tekapo: {
      title: "Lake Tekapo",
      description:
        "Marvel at the turquoise waters of Lake Tekapo and visit the famous Church of the Good Shepherd. Known for its stunning lupins and dark sky reserve.",
      duration: "Half Day (6 hours)",
      price: "From ₹9,500 per person",
      highlights: [
        "Turquoise lake",
        "Church of Good Shepherd",
        "Lupin flowers",
        "Dark Sky Reserve",
      ],
    },
    rotorua: {
      title: "Rotorua Geothermal",
      description:
        "Experience the geothermal wonders of Rotorua, including hot springs, geysers, and mud pools. Learn about Maori culture and traditions.",
      duration: "Full Day (8 hours)",
      price: "From ₹13,000 per person",
      highlights: [
        "Geothermal features",
        "Maori cultural experience",
        "Hot springs",
        "Te Puia geyser",
      ],
    },
    waitomo: {
      title: "Waitomo Caves",
      description:
        "Explore the magical underground world of Waitomo Caves, famous for thousands of glowworms creating a starry ceiling in the darkness.",
      duration: "Half Day (5 hours)",
      price: "From ₹8,000 per person",
      highlights: [
        "Glowworm caves",
        "Underground boat ride",
        "Limestone formations",
        "Unique ecosystem",
      ],
    },
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Top <span className="text-primary">Activities And Attractions</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity.id)}
              className="relative overflow-hidden rounded-3xl cursor-pointer hover:scale-105 transition-transform duration-300 group aspect-square"
            >
              {/* Background Image or Gradient */}
              <div className={`absolute inset-0 ${activity.fallbackColor}`}>
                <Image
                  src={activity.image}
                  alt={activity.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    // Show the fallback icon
                    const parent = target.parentElement;
                    if (parent) {
                      const iconEl = parent.querySelector(".fallback-icon");
                      if (iconEl) {
                        (iconEl as HTMLElement).style.display = "flex";
                      }
                    }
                  }}
                />

                {/* Fallback Icon (hidden by default) */}
                <div
                  className="fallback-icon absolute inset-0 items-center justify-center text-6xl"
                  style={{ display: "none" }}
                >
                  {activity.icon}
                </div>
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Text Content */}
              <div className="absolute inset-0 flex items-end p-4">
                <h3 className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
                  {activity.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Detail Modal */}
        <Dialog
          open={!!selectedActivity}
          onOpenChange={() => setSelectedActivity(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                {selectedActivity &&
                  activityDetails[
                    selectedActivity as keyof typeof activityDetails
                  ]?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedActivity &&
              activityDetails[
                selectedActivity as keyof typeof activityDetails
              ] && (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    {
                      activityDetails[
                        selectedActivity as keyof typeof activityDetails
                      ].description
                    }
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Duration
                      </h4>
                      <p className="text-muted-foreground">
                        {
                          activityDetails[
                            selectedActivity as keyof typeof activityDetails
                          ].duration
                        }
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Price
                      </h4>
                      <p className="text-primary font-semibold">
                        {
                          activityDetails[
                            selectedActivity as keyof typeof activityDetails
                          ].price
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Highlights
                    </h4>
                    <ul className="space-y-2">
                      {activityDetails[
                        selectedActivity as keyof typeof activityDetails
                      ].highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1 bg-primary hover:bg-hover-purple">
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedActivity(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ActivitiesSection;
