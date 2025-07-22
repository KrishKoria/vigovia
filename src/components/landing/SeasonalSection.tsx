"use client";
import { useState } from "react";
import { Leaf, Sun, TreePine, Snowflake } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";

const SeasonalSection = () => {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  const seasons = [
    {
      id: "spring",
      name: "SPRING",
      icon: <Leaf className="h-16 w-16 text-white" />,
    },
    {
      id: "summer",
      name: "SUMMER",
      icon: <Sun className="h-16 w-16 text-white" />,
    },
    {
      id: "autumn",
      name: "AUTUMN",
      icon: <TreePine className="h-16 w-16 text-white" />,
    },
    {
      id: "winter",
      name: "WINTER",
      icon: <Snowflake className="h-16 w-16 text-white" />,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Special <span className="text-primary">Seasonal Info</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {seasons.map((season) => (
            <div key={season.id} className="text-center relative">
              <div className="w-40 h-40 bg-[#321e5d] rounded-full flex items-center justify-center mx-auto relative z-10 mb-[-80px]">
                <div className="w-16 h-16 flex items-center justify-center text-white">
                  {season.icon}
                </div>
              </div>

              <Card className="bg-white rounded-4xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 pt-12">
                <CardContent className="mt-4 flex flex-col justify-end min-h-24">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {season.name}
                  </h3>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-hover-purple text-white rounded-full w-full"
                    onClick={() => setSelectedSeason(season.id)}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {["spring", "summer", "autumn", "winter"].map((season) => (
          <Dialog
            key={season}
            open={selectedSeason === season}
            onOpenChange={() => setSelectedSeason(null)}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary capitalize">
                  {season} Season Information
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Discover the best activities and travel tips for visiting New
                  Zealand during {season} season.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Best Activities:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Season-specific outdoor activities</li>
                    <li>• Weather-appropriate attractions</li>
                    <li>• Local festivals and events</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Travel Tips:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ideal clothing recommendations</li>
                    <li>• Peak season considerations</li>
                    <li>• Booking advice</li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-hover-purple"
                  onClick={() => setSelectedSeason(null)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
};

export default SeasonalSection;
