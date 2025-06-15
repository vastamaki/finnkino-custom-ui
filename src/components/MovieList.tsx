
import React from 'react';
import { Film, Star, Clock, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Movie {
  ID: string;
  Title: string;
  OriginalTitle?: string;
  ProductionYear?: string;
  LengthInMinutes?: string;
  dtLocalRelease?: string;
  Rating?: string;
  RatingLabel?: string;
  LocalDistributorName?: string;
  GlobalDistributorName?: string;
  Synopsis?: string;
  Images?: {
    EventSmallImagePortrait?: string;
    EventMediumImagePortrait?: string;
    EventLargeImagePortrait?: string;
  };
  Genres?: string;
}

interface MovieListProps {
  onMovieSelect: (movieTitle: string) => void;
  selectedMovie: string;
}

const fetchMovies = async (): Promise<Movie[]> => {
  const response = await fetch('https://www.finnkino.fi/xml/Events/');
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const events = doc.querySelectorAll('Event');
  
  return Array.from(events).map(event => ({
    ID: event.querySelector('ID')?.textContent || '',
    Title: event.querySelector('Title')?.textContent || '',
    OriginalTitle: event.querySelector('OriginalTitle')?.textContent || '',
    ProductionYear: event.querySelector('ProductionYear')?.textContent || '',
    LengthInMinutes: event.querySelector('LengthInMinutes')?.textContent || '',
    dtLocalRelease: event.querySelector('dtLocalRelease')?.textContent || '',
    Rating: event.querySelector('Rating')?.textContent || '',
    RatingLabel: event.querySelector('RatingLabel')?.textContent || '',
    Synopsis: event.querySelector('Synopsis')?.textContent || '',
    Genres: event.querySelector('Genres')?.textContent || '',
    Images: {
      EventSmallImagePortrait: event.querySelector('Images EventSmallImagePortrait')?.textContent || '',
      EventMediumImagePortrait: event.querySelector('Images EventMediumImagePortrait')?.textContent || '',
      EventLargeImagePortrait: event.querySelector('Images EventLargeImagePortrait')?.textContent || '',
    },
  }));
};

export const MovieList: React.FC<MovieListProps> = ({ onMovieSelect, selectedMovie }) => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  console.log('Movies data:', movies);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg overflow-hidden animate-pulse">
            <div className="h-96 bg-gray-700"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">Error loading movies</div>
        <p className="text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies?.map((movie) => (
        <div
          key={movie.ID}
          onClick={() => onMovieSelect(movie.Title)}
          className={`group bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 border ${
            selectedMovie === movie.Title
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'border-gray-700 hover:border-amber-500/50'
          }`}
        >
          {/* Movie Poster */}
          <div className="relative h-64 bg-gray-700 overflow-hidden">
            {movie.Images?.EventMediumImagePortrait ? (
              <img
                src={movie.Images.EventMediumImagePortrait}
                alt={movie.Title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`${movie.Images?.EventMediumImagePortrait ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-700 to-gray-800`}>
              <Film className="w-16 h-16 text-gray-500" />
            </div>
            
            {/* Rating Badge */}
            {movie.RatingLabel && (
              <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded text-xs font-bold">
                {movie.RatingLabel}
              </div>
            )}
            
            {/* Selected Indicator */}
            {selectedMovie === movie.Title && (
              <div className="absolute top-2 left-2 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Movie Info */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
              {movie.Title}
            </h3>
            
            {movie.OriginalTitle && movie.OriginalTitle !== movie.Title && (
              <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                {movie.OriginalTitle}
              </p>
            )}

            <div className="space-y-2">
              {movie.ProductionYear && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{movie.ProductionYear}</span>
                </div>
              )}
              
              {movie.LengthInMinutes && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{movie.LengthInMinutes} min</span>
                </div>
              )}
              
              {movie.Genres && (
                <div className="text-amber-400 text-sm">
                  {movie.Genres}
                </div>
              )}
            </div>

            {movie.Synopsis && (
              <p className="text-gray-300 text-sm mt-3 line-clamp-3">
                {movie.Synopsis}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
