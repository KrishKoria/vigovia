"use client";
import { useState } from "react";
import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

const InfoSection = () => {
  const [activeTab, setActiveTab] = useState("important");

  const tabs = [
    { id: "important", label: "Important Info", active: true },
    { id: "documents", label: "Documents Required" },
    { id: "guidelines", label: "Airline Guidelines" },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Must-Know <span className="text-primary">Information</span>
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border hover:bg-hover-purple hover:text-white"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Plane className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Visa Validity Period:
                </h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• How long the visa is valid from the date of issue.</li>
                  <li>
                    • The difference between single-entry, double-entry, and
                    multiple-entry visas.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Duration of Stay:
                </h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    • Maximum length of stay per visit (e.g., 90 days within a
                    180-day period for some visas).
                  </li>
                  <li>
                    • Rules for short stays, long stays, and temporary residence
                    visas.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Permitted Activities:
                </h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    • What activities are allowed under the visa (e.g., work,
                    study, tourism).
                  </li>
                  <li>
                    • Restrictions on working on tourist or student visas.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Entry Ban or Restrictions:
                </h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    • Certain nationalities or individuals may face
                    restrictions, including travel bans or limited stay periods.
                  </li>
                  <li>
                    • Conditions for transit visas and whether they allow
                    temporary entry into the country.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
