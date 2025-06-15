import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieModalHero } from "@/components/MovieModalHero";
import { MovieModalContent } from "@/components/MovieModalContent";
import { MovieModalShowtimes } from "@/components/MovieModalShowtimes";

interface Movie {
  ID: string;
  Title: string;
  OriginalTitle?: string;
  ProductionYear?: string;
  LengthInMinutes?: string;
  Rating?: string;
  RatingLabel?: string;
  Synopsis?: string;
  Images?: {
    EventMediumImagePortrait?: string;
  };
  Genres?: string;
}

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

interface MovieModalProps {
  movie: Movie | null;
  shows: Show[];
  isOpen: boolean;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  shows,
  isOpen,
  onClose,
}) => {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0 overflow-hidden bg-background border-border/20">
        <ScrollArea className="h-[100vh] md:max-h-[80vh]">
          <div className="relative">
            <MovieModalHero movie={movie} />
            <MovieModalContent movie={movie} />
            <MovieModalShowtimes shows={shows} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
