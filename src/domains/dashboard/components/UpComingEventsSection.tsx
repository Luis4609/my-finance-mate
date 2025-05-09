import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Inbox } from "lucide-react";
import { UpcomingEvent } from "../models/UpcomingEvent";


interface UpcomingEventsSectionProps {
  events: UpcomingEvent[];
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        <CardTitle className="text-sm font-medium">Próximos eventos</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <div className="mb-2">
              <Inbox className="w-12 h-12" />
            </div>
            No hay próximos eventos
          </div>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>{event.name}</li> // Example rendering using event.id as key
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsSection;
