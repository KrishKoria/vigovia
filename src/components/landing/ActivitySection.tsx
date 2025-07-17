"use client";
import { useState } from "react";
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
    { id: "wine", name: "Wine Tasting", image: "🍷" },
    { id: "safari", name: "Wildlife Safari", image: "🦁" },
    { id: "bungee", name: "Bungee Jumping", image: "🪂" },
    { id: "coromandel", name: "Coromandel", image: "🏖️" },
    { id: "tongariro", name: "Tongariro", image: "🏔️" },
    { id: "wanaka", name: "Wanaka", image: "🏞️" },
    { id: "aoraki", name: "Aoraki", image: "🗻" },
    { id: "tekapo", name: "Lake Tekapo", image: "🌊" },
    { id: "rotorua", name: "Rotorua", image: "♨️" },
    { id: "waitomo", name: "Waitomo", image: "💎" },
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
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Top <span className="text-primary">Activities And Attractions</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity.id)}
              className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {activity.image}
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {activity.name}
              </h3>
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
