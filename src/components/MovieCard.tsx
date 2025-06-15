import React from "react";
import { Clock, Calendar, Star, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
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

interface MovieCardProps {
  movie: Movie;
  shows: Show[];
  onClick: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  shows,
  onClick,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatGenres = (genres: string) => {
    if (!genres) return [];
    return genres
      .split(",")
      .map((genre) => genre.trim())
      .slice(0, 2);
  };

  const getLanguages = () => {
    const languages = new Set<string>();
    shows.forEach((show) => {
      if (show.PresentationMethodAndLanguage) {
        // Extract language from strings like "2D, suomi" or "2D, englanti"
        const parts = show.PresentationMethodAndLanguage.split(",");
        if (parts.length > 1) {
          const lang = parts[1].trim();
          if (lang) languages.add(lang);
        }
      }
    });
    return Array.from(languages).slice(0, 2); // Show max 2 languages
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer h-[420px] border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl shadow-lg hover:scale-[1.02] transform-gpu pt-0"
      onClick={onClick}
    >
      <div className="absolute inset-0">
        {movie.Images?.EventMediumImagePortrait ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${movie.Images.EventMediumImagePortrait})`,
              }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm opacity-60"
              style={{
                backgroundImage: `url(${movie.Images.EventMediumImagePortrait})`,
              }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center blur-lg opacity-40"
              style={{
                backgroundImage: `url(${movie.Images.EventMediumImagePortrait})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 mix-blend-overlay" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-secondary/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-24 h-24 text-white/20" />
            </div>
          </>
        )}
      </div>

      <div className="relative z-10">
        {movie.RatingLabel && (
          <div className="absolute top-0 right-0">
            <Badge className="bg-orange-500/90 text-white text-xs font-semibold px-3 py-1 rounded-none rounded-bl-lg backdrop-blur-sm border-0">
              {movie.RatingLabel}
            </Badge>
          </div>
        )}

        {getLanguages().length > 0 && (
          <div className="absolute top-0 left-0 flex flex-col">
            {getLanguages().map((language, index) => (
              <Badge
                key={index}
                className="bg-blue-500/90 text-white text-xs backdrop-blur-sm border-0 rounded-none first:rounded-br-lg last:rounded-br-lg"
              >
                {language}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section - Movie Info */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <h3 className="font-bold text-2xl text-white line-clamp-2 leading-tight drop-shadow-lg">
              {movie.Title}
            </h3>

            {movie.Synopsis && (
              <p className="text-sm text-white/90 line-clamp-2 leading-relaxed drop-shadow-md">
                {truncateText(movie.Synopsis, 120)}
              </p>
            )}
          </div>

          {/* Movie Meta Info */}
          <div className="flex items-center gap-4 text-white/80">
            {movie.LengthInMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{movie.LengthInMinutes}min</span>
              </div>
            )}
            {movie.ProductionYear && (
              <span className="text-sm">{movie.ProductionYear}</span>
            )}
          </div>

          {/* Genres */}
          {movie.Genres && (
            <div className="flex flex-wrap gap-2">
              {formatGenres(movie.Genres).map((genre, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-white/10 border-white/30 text-white backdrop-blur-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};
