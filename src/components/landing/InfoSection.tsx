"use client";
import { useState } from "react";
import { Plane, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const InfoSection = () => {
  const [activeTab, setActiveTab] = useState("important");

  const tabs = [
    { id: "important", label: "Important Info", icon: Shield },
    { id: "documents", label: "Documents Required", icon: FileText },
    { id: "guidelines", label: "Airline Guidelines", icon: Plane },
  ];

  const tabContent = {
    important: {
      title: "Important Travel Information",
      sections: [
        {
          heading: "Visa Validity Period:",
          items: [
            "How long the visa is valid from the date of issue.",
            "The difference between single-entry, double-entry, and multiple-entry visas.",
          ],
        },
        {
          heading: "Duration of Stay:",
          items: [
            "Maximum length of stay per visit (e.g., 90 days within a 180-day period for some visas).",
            "Rules for short stays, long stays, and temporary residence visas.",
          ],
        },
        {
          heading: "Permitted Activities:",
          items: [
            "What activities are allowed under the visa (e.g., work, study, tourism).",
            "Restrictions on working on tourist or student visas.",
          ],
        },
        {
          heading: "Entry Ban or Restrictions:",
          items: [
            "Certain nationalities or individuals may face restrictions, including travel bans or limited stay periods.",
            "Conditions for transit visas and whether they allow temporary entry into the country.",
          ],
        },
      ],
    },
    documents: {
      title: "Required Documents",
      sections: [
        {
          heading: "Passport Requirements:",
          items: [
            "Valid passport with at least 6 months remaining validity.",
            "At least 2 blank pages for visa stamps.",
            "Original passport and a photocopy of the main page.",
          ],
        },
        {
          heading: "Visa Application Documents:",
          items: [
            "Completed visa application form with signature.",
            "Recent passport-sized photographs (white background).",
            "Confirmed flight itinerary (round-trip booking).",
          ],
        },
        {
          heading: "Financial Documents:",
          items: [
            "Bank statements for the last 3 months.",
            "Proof of employment or business registration.",
            "Income tax returns for the previous year.",
          ],
        },
        {
          heading: "Additional Documents:",
          items: [
            "Travel insurance covering the entire trip duration.",
            "Hotel booking confirmation or invitation letter.",
            "No objection certificate (NOC) from employer if applicable.",
          ],
        },
      ],
    },
    guidelines: {
      title: "Airline Guidelines & Regulations",
      sections: [
        {
          heading: "Baggage Allowance:",
          items: [
            "Check-in baggage: Usually 20-30kg depending on airline and class.",
            "Carry-on baggage: 7-10kg with size restrictions (55cm x 40cm x 20cm).",
            "Prohibited items: Liquids over 100ml, sharp objects, batteries.",
          ],
        },
        {
          heading: "Check-in Requirements:",
          items: [
            "Arrive at airport 2-3 hours before international flights.",
            "Online check-in available 24-48 hours before departure.",
            "Valid ID and boarding pass required for security check.",
          ],
        },
        {
          heading: "Health & Safety:",
          items: [
            "Follow airline's health protocols and mask requirements.",
            "Declare any medical conditions or medications.",
            "Ensure vaccinations are up-to-date as per destination requirements.",
          ],
        },
        {
          heading: "Special Assistance:",
          items: [
            "Request special meals 24 hours before departure.",
            "Mobility assistance available - contact airline in advance.",
            "Traveling with pets requires prior approval and documentation.",
          ],
        },
      ],
    },
  };

  const getCurrentIcon = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    return currentTab ? currentTab.icon : Plane;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Must-Know <span className="text-primary">Information</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border hover:bg-purple-500 hover:text-white"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <CurrentIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {tabContent[activeTab as keyof typeof tabContent].title}
              </h3>

              {tabContent[activeTab as keyof typeof tabContent].sections.map(
                (section, index) => (
                  <div key={index}>
                    <h4 className="text-xl font-bold text-foreground mb-4">
                      {section.heading}
                    </h4>
                    <ul className="text-muted-foreground space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
