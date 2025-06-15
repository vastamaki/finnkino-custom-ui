
import React from "react";
import { MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Show {
  ID: string;
  dttmShowStart: string;
  dttmShowEnd: string;
  EventID: string;
  Theatre: string;
  TheatreID: string;
  TheatreAuditorium: string;
  TheatreAndAuditorium: string;
  PresentationMethodAndLanguage?: string;
  ShowURL?: string;
}

interface MovieModalShowtimesProps {
  shows: Show[];
}

export const MovieModalShowtimes: React.FC<MovieModalShowtimesProps> = ({ shows }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (shows.length === 0) {
    return null;
  }

  return (
    <div className="px-8 pb-8 space-y-6">
      <div className="flex items-center gap-2">
        <Ticket className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Available Showtimes
        </h3>
      </div>

      <div className="space-y-4">
        {/* Theater Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{shows[0].TheatreAndAuditorium}</span>
        </div>

        {/* Showtime Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {shows.map((show) => (
            <div key={show.ID}>
              {show.ShowURL ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-12 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  asChild
                >
                  <a
                    href={show.ShowURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatTime(show.dttmShowStart)}
                  </a>
                </Button>
              ) : (
                <div className="bg-muted/20 text-muted-foreground h-12 rounded-md text-sm flex items-center justify-center border border-border/10">
                  {formatTime(show.dttmShowStart)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
