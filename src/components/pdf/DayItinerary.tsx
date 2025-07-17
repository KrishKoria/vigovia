interface TimelineActivity {
  time: string;
  activities: string[];
}

interface DayItineraryProps {
  day: number;
  date: string;
  title: string;
  image: string;
  timeline: TimelineActivity[];
}

export function DayItinerary({
  day,
  date,
  title,
  image,
  timeline,
}: DayItineraryProps) {
  return (
    <div className="flex gap-6 mb-8">
      {/* Day Number */}
      <div className="flex-shrink-0">
        <div className="bg-vigovia-dark text-vigovia-light rounded-full w-16 h-32 flex flex-col items-center justify-center">
          <span className="text-lg font-bold transform -rotate-90">
            Day {day}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6">
        {/* Image and Date */}
        <div className="text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-vigovia-accent">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-vigovia-dark">{date}</p>
          <p className="text-sm text-vigovia-dark/70">{title}</p>
        </div>

        {/* Timeline */}
        <div className="flex-1">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-vigovia-accent"></div>

            {timeline.map((item, index) => (
              <div key={index} className="relative flex gap-4 mb-6">
                {/* Timeline Dot */}
                <div className="w-8 h-8 bg-vigovia-accent rounded-full border-4 border-background flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-vigovia-dark rounded-full"></div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <h4 className="font-semibold text-vigovia-dark mb-2">
                    {item.time}
                  </h4>
                  <ul className="space-y-1">
                    {item.activities.map((activity, actIndex) => (
                      <li
                        key={actIndex}
                        className="text-sm text-vigovia-dark/80 flex items-start gap-2"
                      >
                        <span className="text-vigovia-accent">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
