"use client";
import { useState } from "react";
import { Leaf, Sun, TreePine, Snowflake, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SeasonalSection = () => {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  const seasons = [
    {
      id: "spring",
      name: "SPRING",
      icon: <Leaf className="h-8 w-8 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "summer",
      name: "SUMMER",
      icon: <Sun className="h-8 w-8 text-white" />,
      color: "bg-yellow-500",
    },
    {
      id: "autumn",
      name: "AUTUMN",
      icon: <TreePine className="h-8 w-8 text-white" />,
      color: "bg-orange-500",
    },
    {
      id: "winter",
      name: "WINTER",
      icon: <Snowflake className="h-8 w-8 text-white" />,
      color: "bg-blue-500",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Special <span className="text-primary">Seasonal Info</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {seasons.map((season) => (
            <div key={season.id} className="text-center">
              <div
                onClick={() => setSelectedSeason(season.id)}
                className={`w-24 h-24 ${season.color} rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform shadow-lg`}
              >
                {season.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {season.name}
              </h3>
              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-hover-purple text-white px-6 py-2 rounded-full"
                onClick={() => setSelectedSeason(season.id)}
              >
                Read More
              </Button>
            </div>
          ))}
        </div>

        {/* Seasonal Info Modal - Replicating the design from the image */}
        <Dialog
          open={selectedSeason === "spring"}
          onOpenChange={() => setSelectedSeason(null)}
        >
          <DialogContent className="sm:max-w-[500px] p-0">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">SPRING</h2>
                </div>
                <button
                  onClick={() => setSelectedSeason(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Visa Validity Period:
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    • How Long The Visa Is Valid From The Date Of Issue.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • The Difference Between Single-Entry, Double-Entry, And
                    Multiple-Entry Visas.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Duration Of Stay:
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    • Maximum Length Of Stay Per Visit (E.g., 90 Days Within A
                    180-Day Period For Some Visas).
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Rules For Short Stays, Long Stays, And Temporary Residence
                    Visas.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Permitted Activities:
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    • What Activities Are Allowed Under The Visa (E.g., Work,
                    Study, Tourism).
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Restrictions On Working On Tourist Or Student Visas.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Entry Ban Or Restrictions:
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    • Certain Nationalities Or Individuals May Face
                    Restrictions, Including Travel Bans.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Conditions For Transit Visas And Whether They Allow
                    Temporary Entry Into The Country.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Other seasonal modals with similar structure but different content */}
        {["summer", "autumn", "winter"].map((season) => (
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
