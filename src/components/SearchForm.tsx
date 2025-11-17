import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Calendar, Users, Search, AlertCircle } from "lucide-react";

interface SearchFormProps {
  onSearch: (searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError("Por favor, selecione as datas de check-in e check-out");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError("A data de check-in não pode ser anterior ou igual a de hoje");
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError("A data de check-out deve ser posterior à data de check-in");
      return;
    }

    onSearch({ checkIn, checkOut, guests });
  };

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : minDate;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Check-in */}
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check-in
              </Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                min={minDate}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check-out
              </Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                min={minCheckOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Hóspedes
              </Label>
              <Select
                value={guests.toString()}
                onValueChange={(value) => setGuests(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Hóspede" : "Hóspedes"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button type="submit" size="lg" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar Quartos
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
