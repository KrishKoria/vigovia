import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Note {
  point: string;
  details: string;
}

interface ImportantNotesProps {
  notes: Note[];
}

export function ImportantNotes({ notes }: ImportantNotesProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-vigovia-light">
        <CardTitle className="text-vigovia-dark">
          Important <span className="text-vigovia-cta">Notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header Row */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-vigovia-dark text-vigovia-light font-medium">
          <div>Point</div>
          <div>Details</div>
        </div>

        {/* Data Rows */}
        {notes.map((note, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 p-4 border-b border-vigovia-light/50 last:border-b-0 bg-vigovia-light/30"
          >
            <div className="text-vigovia-dark font-medium">{note.point}</div>
            <div className="text-vigovia-dark text-sm">{note.details}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
