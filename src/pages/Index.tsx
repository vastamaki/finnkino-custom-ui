import React, { useState } from "react";
import { Filters } from "@/components/Filters";
import { MovieShowtimes } from "@/components/MovieShowtimes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [selectedTheater, setSelectedTheater] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <ThemeProvider>
      <div className="h-full">
        <header className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    F
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  The better Finnkino UI
                </h1>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="h-full max-w-7xl mx-auto px-6 py-6">
          <div className="mb-6">
            <Filters
              selectedTheater={selectedTheater}
              selectedDate={selectedDate}
              searchQuery={searchQuery}
              onTheaterChange={setSelectedTheater}
              onDateChange={setSelectedDate}
              onSearchChange={setSearchQuery}
            />
          </div>

          <MovieShowtimes
            selectedTheater={selectedTheater}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
