import React from "react";
import { Film, Calendar, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface MovieModalHeroProps {
  movie: Movie;
}

export const MovieModalHero: React.FC<MovieModalHeroProps> = ({ movie }) => {
  return (
    <div className="relative h-96 overflow-hidden rounded-t-2xl">
      {movie.Images?.EventMediumImagePortrait ? (
        <>
          {/* Background with blur effect */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-60"
            style={{
              backgroundImage: `url(${movie.Images.EventMediumImagePortrait})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

          {/* Movie Poster */}
          <div className="absolute left-8 bottom-8 z-10">
            <div className="w-32 h-48 rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={movie.Images.EventMediumImagePortrait}
                alt={movie.Title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
          <div className="absolute left-8 bottom-8 z-10">
            <div className="w-32 h-48 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-center">
              <Film className="w-12 h-12 text-muted-foreground/40" />
            </div>
          </div>
        </div>
      )}

      {/* Title and Info */}
      <div className="absolute right-8 bottom-8 left-48 z-10 space-y-4">
        <h1 className="text-4xl font-bold text-foreground leading-tight">
          {movie.Title}
        </h1>
        {movie.OriginalTitle && movie.OriginalTitle !== movie.Title && (
          <p className="text-lg text-muted-foreground">{movie.OriginalTitle}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {movie.ProductionYear && (
            <Badge variant="secondary" className="backdrop-blur-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {movie.ProductionYear}
            </Badge>
          )}
          {movie.LengthInMinutes && (
            <Badge variant="secondary" className="backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {movie.LengthInMinutes} min
            </Badge>
          )}
          {movie.RatingLabel && (
            <Badge variant="secondary" className="backdrop-blur-sm">
              {movie.RatingLabel}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
