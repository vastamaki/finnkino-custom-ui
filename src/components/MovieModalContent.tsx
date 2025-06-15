import React from "react";
import { Users, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  Videos?: {
    EventVideo?: {
      Location?: string;
    };
  };
  Cast?: Array<{
    FirstName?: string;
    LastName?: string;
  }>;
  Directors?: Array<{
    FirstName?: string;
    LastName?: string;
  }>;
}

interface MovieModalContentProps {
  movie: Movie;
}

export const MovieModalContent: React.FC<MovieModalContentProps> = ({
  movie,
}) => {
  const getTrailerEmbedUrl = () => {
    if (movie.Videos?.EventVideo?.Location) {
      const youtubeId = movie.Videos.EventVideo.Location;
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
  };

  const castMembers = movie.Cast || [];

  return (
    <div className="p-8">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="trailer">
            <Play className="w-4 h-4 mr-2" />
            Trailer
          </TabsTrigger>
          <TabsTrigger value="cast">
            <Users className="w-4 h-4 mr-2" />
            Cast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          {/* Genres */}
          {movie.Genres && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.Genres.split(",").map((genre, index) => (
                  <Badge key={index} variant="secondary">
                    {genre.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis */}
          {movie.Synopsis && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Synopsis
              </h3>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/10">
                <p className="text-foreground/90 leading-relaxed">
                  {movie.Synopsis}
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trailer" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Official Trailer
            </h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                src={getTrailerEmbedUrl()}
                title={`${movie.Title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cast" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Cast
            </h3>

            {castMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {castMembers.map((actor, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border/20 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {`${actor.FirstName || ""} ${
                            actor.LastName || ""
                          }`.trim()}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No cast information available
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
