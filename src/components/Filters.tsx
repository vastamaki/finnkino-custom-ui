import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Theater {
  ID: string;
  Name: string;
}

interface FiltersProps {
  selectedTheater: string;
  selectedDate: string;
  searchQuery: string;
  onTheaterChange: (theater: string) => void;
  onDateChange: (date: string) => void;
  onSearchChange: (query: string) => void;
}

const fetchTheaters = async (): Promise<Theater[]> => {
  const response = await fetch("https://www.finnkino.fi/xml/TheatreAreas/");
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const theatreAreas = doc.querySelectorAll("TheatreArea");

  return Array.from(theatreAreas).map((area) => ({
    ID: area.querySelector("ID")?.textContent || "",
    Name: area.querySelector("Name")?.textContent || "",
  }));
};

const getDateOptions = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
    const displayStr =
      i === 0
        ? "Today"
        : i === 1
        ? "Tomorrow"
        : date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
    dates.push({ value: dateStr, label: displayStr });
  }

  return dates;
};

export const Filters: React.FC<FiltersProps> = ({
  selectedTheater,
  selectedDate,
  searchQuery,
  onTheaterChange,
  onDateChange,
  onSearchChange,
}) => {
  const { data: theaters } = useQuery({
    queryKey: ["theaters"],
    queryFn: fetchTheaters,
  });

  const dateOptions = getDateOptions();

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedTheater} onValueChange={onTheaterChange}>
            <SelectTrigger className="w-full lg:w-auto h-11">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="All Locations" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {theaters?.map((theater) => (
                <SelectItem key={theater.ID} value={theater.ID}>
                  {theater.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDate} onValueChange={onDateChange}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Select Date" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
