import React, { useState } from "react";
import { Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MovieCard } from "./MovieCard";
import { MovieModal } from "./MovieModal";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Movie {
  ID: string;
  Title: string;
  OriginalTitle?: string;
  ProductionYear?: string;
  LengthInMinutes?: string;
  dtLocalRelease?: string;
  Rating?: string;
  RatingLabel?: string;
  RatingImageUrl?: string;
  LocalDistributorName?: string;
  GlobalDistributorName?: string;
  ProductionCompanies?: string;
  EventType?: string;
  Synopsis?: string;
  ShortSynopsis?: string;
  EventURL?: string;
  Images?: {
    EventSmallImagePortrait?: string;
    EventMediumImagePortrait?: string;
    EventLargeImagePortrait?: string;
  };
  Videos?: {
    EventVideo?: {
      Title?: string;
      Location?: string;
      ThumbnailLocation?: string;
      MediaResourceSubType?: string;
      MediaResourceFormat?: string;
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
  ContentDescriptors?: Array<{
    Name?: string;
    ImageURL?: string;
  }>;
  Genres?: string;
}

interface Show {
  ID: string;
  dtAccounting?: string;
  dttmShowStart: string;
  dttmShowStartUTC?: string;
  dttmShowEnd: string;
  dttmShowEndUTC?: string;
  ShowSalesStartTime?: string;
  ShowSalesStartTimeUTC?: string;
  ShowSalesEndTime?: string;
  ShowSalesEndTimeUTC?: string;
  ShowReservationStartTime?: string;
  ShowReservationStartTimeUTC?: string;
  ShowReservationEndTime?: string;
  ShowReservationEndTimeUTC?: string;
  EventID: string;
  Title?: string;
  OriginalTitle?: string;
  ProductionYear?: string;
  LengthInMinutes?: string;
  dtLocalRelease?: string;
  Rating?: string;
  RatingLabel?: string;
  RatingImageUrl?: string;
  EventType?: string;
  Genres?: string;
  Theatre: string;
  TheatreID: string;
  TheatreAuditriumID?: string;
  TheatreAuditorium: string;
  TheatreAndAuditorium: string;
  PresentationMethodAndLanguage?: string;
  PresentationMethod?: string;
  EventSeries?: string;
  ShowURL?: string;
  EventURL?: string;
  SpokenLanguage?: {
    Name?: string;
    NameInLanguage?: string;
    ISOTwoLetterCode?: string;
  };
  SubtitleLanguage1?: {
    Name?: string;
    NameInLanguage?: string;
    ISOTwoLetterCode?: string;
  };
  SubtitleLanguage2?: {
    Name?: string;
    NameInLanguage?: string;
    ISOTwoLetterCode?: string;
  };
  Images?: {
    EventSmallImagePortrait?: string;
    EventMediumImagePortrait?: string;
    EventLargeImagePortrait?: string;
  };
  ContentDescriptors?: Array<{
    Name?: string;
    ImageURL?: string;
  }>;
}

interface MovieShowtimesProps {
  selectedTheater: string;
  selectedDate: string;
  searchQuery: string;
}

const fetchMovies = async (): Promise<Movie[]> => {
  const response = await fetch("https://www.finnkino.fi/xml/Events/");
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const events = doc.querySelectorAll("Event");

  return Array.from(events).map((event) => {
    // Extract cast members
    const castElements = event.querySelectorAll("Cast Actor");
    const cast = Array.from(castElements).map((actor) => ({
      FirstName: actor.querySelector("FirstName")?.textContent || "",
      LastName: actor.querySelector("LastName")?.textContent || "",
    }));

    // Extract directors
    const directorElements = event.querySelectorAll("Directors Director");
    const directors = Array.from(directorElements).map((director) => ({
      FirstName: director.querySelector("FirstName")?.textContent || "",
      LastName: director.querySelector("LastName")?.textContent || "",
    }));

    // Extract content descriptors
    const contentDescriptorElements = event.querySelectorAll(
      "ContentDescriptors ContentDescriptor"
    );
    const contentDescriptors = Array.from(contentDescriptorElements).map(
      (descriptor) => ({
        Name: descriptor.querySelector("Name")?.textContent || "",
        ImageURL: descriptor.querySelector("ImageURL")?.textContent || "",
      })
    );

    return {
      ID: event.querySelector("ID")?.textContent || "",
      Title: event.querySelector("Title")?.textContent || "",
      OriginalTitle: event.querySelector("OriginalTitle")?.textContent || "",
      ProductionYear: event.querySelector("ProductionYear")?.textContent || "",
      LengthInMinutes:
        event.querySelector("LengthInMinutes")?.textContent || "",
      dtLocalRelease: event.querySelector("dtLocalRelease")?.textContent || "",
      Rating: event.querySelector("Rating")?.textContent || "",
      RatingLabel: event.querySelector("RatingLabel")?.textContent || "",
      RatingImageUrl: event.querySelector("RatingImageUrl")?.textContent || "",
      LocalDistributorName:
        event.querySelector("LocalDistributorName")?.textContent || "",
      GlobalDistributorName:
        event.querySelector("GlobalDistributorName")?.textContent || "",
      ProductionCompanies:
        event.querySelector("ProductionCompanies")?.textContent || "",
      EventType: event.querySelector("EventType")?.textContent || "",
      Synopsis: event.querySelector("Synopsis")?.textContent || "",
      ShortSynopsis: event.querySelector("ShortSynopsis")?.textContent || "",
      EventURL: event.querySelector("EventURL")?.textContent || "",
      Genres: event.querySelector("Genres")?.textContent || "",
      Images: {
        EventSmallImagePortrait:
          event.querySelector("Images EventSmallImagePortrait")?.textContent ||
          "",
        EventMediumImagePortrait:
          event.querySelector("Images EventMediumImagePortrait")?.textContent ||
          "",
        EventLargeImagePortrait:
          event.querySelector("Images EventLargeImagePortrait")?.textContent ||
          "",
      },
      Videos: {
        EventVideo: {
          Title:
            event.querySelector("Videos EventVideo Title")?.textContent || "",
          Location:
            event.querySelector("Videos EventVideo Location")?.textContent ||
            "",
          ThumbnailLocation:
            event.querySelector("Videos EventVideo ThumbnailLocation")
              ?.textContent || "",
          MediaResourceSubType:
            event.querySelector("Videos EventVideo MediaResourceSubType")
              ?.textContent || "",
          MediaResourceFormat:
            event.querySelector("Videos EventVideo MediaResourceFormat")
              ?.textContent || "",
        },
      },
      Cast: cast,
      Directors: directors,
      ContentDescriptors: contentDescriptors,
    };
  });
};

const fetchShowtimes = async (
  theaterId: string,
  date: string
): Promise<Show[]> => {
  let url = "https://www.finnkino.fi/xml/Schedule/";
  const params = new URLSearchParams();

  if (theaterId && theaterId !== "all") {
    params.append("area", theaterId);
  }
  if (date) {
    params.append("dt", date);
  }

  if (params.toString()) {
    url += "?" + params.toString();
  }

  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const shows = doc.querySelectorAll("Show");

  return Array.from(shows).map((show) => {
    // Extract content descriptors from show data
    const contentDescriptorElements = show.querySelectorAll(
      "ContentDescriptors ContentDescriptor"
    );
    const contentDescriptors = Array.from(contentDescriptorElements).map(
      (descriptor) => ({
        Name: descriptor.querySelector("Name")?.textContent || "",
        ImageURL: descriptor.querySelector("ImageURL")?.textContent || "",
      })
    );

    return {
      ID: show.querySelector("ID")?.textContent || "",
      dtAccounting: show.querySelector("dtAccounting")?.textContent || "",
      dttmShowStart: show.querySelector("dttmShowStart")?.textContent || "",
      dttmShowStartUTC:
        show.querySelector("dttmShowStartUTC")?.textContent || "",
      dttmShowEnd: show.querySelector("dttmShowEnd")?.textContent || "",
      dttmShowEndUTC: show.querySelector("dttmShowEndUTC")?.textContent || "",
      ShowSalesStartTime:
        show.querySelector("ShowSalesStartTime")?.textContent || "",
      ShowSalesStartTimeUTC:
        show.querySelector("ShowSalesStartTimeUTC")?.textContent || "",
      ShowSalesEndTime:
        show.querySelector("ShowSalesEndTime")?.textContent || "",
      ShowSalesEndTimeUTC:
        show.querySelector("ShowSalesEndTimeUTC")?.textContent || "",
      ShowReservationStartTime:
        show.querySelector("ShowReservationStartTime")?.textContent || "",
      ShowReservationStartTimeUTC:
        show.querySelector("ShowReservationStartTimeUTC")?.textContent || "",
      ShowReservationEndTime:
        show.querySelector("ShowReservationEndTime")?.textContent || "",
      ShowReservationEndTimeUTC:
        show.querySelector("ShowReservationEndTimeUTC")?.textContent || "",
      EventID: show.querySelector("EventID")?.textContent || "",
      Title: show.querySelector("Title")?.textContent || "",
      OriginalTitle: show.querySelector("OriginalTitle")?.textContent || "",
      ProductionYear: show.querySelector("ProductionYear")?.textContent || "",
      LengthInMinutes: show.querySelector("LengthInMinutes")?.textContent || "",
      dtLocalRelease: show.querySelector("dtLocalRelease")?.textContent || "",
      Rating: show.querySelector("Rating")?.textContent || "",
      RatingLabel: show.querySelector("RatingLabel")?.textContent || "",
      RatingImageUrl: show.querySelector("RatingImageUrl")?.textContent || "",
      EventType: show.querySelector("EventType")?.textContent || "",
      Genres: show.querySelector("Genres")?.textContent || "",
      Theatre: show.querySelector("Theatre")?.textContent || "",
      TheatreID: show.querySelector("TheatreID")?.textContent || "",
      TheatreAuditriumID:
        show.querySelector("TheatreAuditriumID")?.textContent || "",
      TheatreAuditorium:
        show.querySelector("TheatreAuditorium")?.textContent || "",
      TheatreAndAuditorium:
        show.querySelector("TheatreAndAuditorium")?.textContent || "",
      PresentationMethodAndLanguage:
        show.querySelector("PresentationMethodAndLanguage")?.textContent || "",
      PresentationMethod:
        show.querySelector("PresentationMethod")?.textContent || "",
      EventSeries: show.querySelector("EventSeries")?.textContent || "",
      ShowURL: show.querySelector("ShowURL")?.textContent || "",
      EventURL: show.querySelector("EventURL")?.textContent || "",
      SpokenLanguage: {
        Name: show.querySelector("SpokenLanguage Name")?.textContent || "",
        NameInLanguage:
          show.querySelector("SpokenLanguage NameInLanguage")?.textContent ||
          "",
        ISOTwoLetterCode:
          show.querySelector("SpokenLanguage ISOTwoLetterCode")?.textContent ||
          "",
      },
      SubtitleLanguage1: {
        Name: show.querySelector("SubtitleLanguage1 Name")?.textContent || "",
        NameInLanguage:
          show.querySelector("SubtitleLanguage1 NameInLanguage")?.textContent ||
          "",
        ISOTwoLetterCode:
          show.querySelector("SubtitleLanguage1 ISOTwoLetterCode")
            ?.textContent || "",
      },
      SubtitleLanguage2: {
        Name: show.querySelector("SubtitleLanguage2 Name")?.textContent || "",
        NameInLanguage:
          show.querySelector("SubtitleLanguage2 NameInLanguage")?.textContent ||
          "",
        ISOTwoLetterCode:
          show.querySelector("SubtitleLanguage2 ISOTwoLetterCode")
            ?.textContent || "",
      },
      Images: {
        EventSmallImagePortrait:
          show.querySelector("Images EventSmallImagePortrait")?.textContent ||
          "",
        EventMediumImagePortrait:
          show.querySelector("Images EventMediumImagePortrait")?.textContent ||
          "",
        EventLargeImagePortrait:
          show.querySelector("Images EventLargeImagePortrait")?.textContent ||
          "",
      },
      ContentDescriptors: contentDescriptors,
    };
  });
};

export const MovieShowtimes: React.FC<MovieShowtimesProps> = ({
  selectedTheater,
  selectedDate,
  searchQuery,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<{
    movie: Movie;
    shows: Show[];
  } | null>(null);

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  const { data: showtimes, isLoading: showtimesLoading } = useQuery({
    queryKey: ["showtimes", selectedTheater, selectedDate],
    queryFn: () => fetchShowtimes(selectedTheater, selectedDate),
    enabled: !!selectedDate,
  });

  if (moviesLoading || showtimesLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-80 bg-card/20 rounded-xl border border-border/30"
          />
        ))}
      </div>
    );
  }

  // Group showtimes by movie and filter by search query
  const movieShowtimes =
    movies
      ?.map((movie) => {
        const movieShows =
          showtimes?.filter((show) => show.EventID === movie.ID) || [];
        return { movie, shows: movieShows };
      })
      .filter((item) => {
        if (item.shows.length === 0) return false;

        // Filter by search query if provided
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            item.movie.Title.toLowerCase().includes(query) ||
            item.movie.OriginalTitle?.toLowerCase().includes(query) ||
            item.movie.Genres?.toLowerCase().includes(query)
          );
        }

        return true;
      }) || [];

  return (
    <ScrollArea className="h-[calc(100vh-14.5rem)] lg:h-[calc(100dvh-11rem)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movieShowtimes.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="bg-card/20 backdrop-blur-sm rounded-2xl p-12 border border-border/30">
              <Film className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-foreground mb-3">
                No showtimes found
              </h3>
              <p className="text-muted-foreground text-lg">
                {searchQuery.trim() ? "Try a different search term or" : ""} Try
                selecting a different theater or date
              </p>
            </div>
          </div>
        ) : (
          movieShowtimes.map(({ movie, shows }) => (
            <MovieCard
              key={movie.ID}
              movie={movie}
              shows={shows}
              onClick={() => setSelectedMovie({ movie, shows })}
            />
          ))
        )}
      </div>

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie?.movie || null}
        shows={selectedMovie?.shows || []}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </ScrollArea>
  );
};
