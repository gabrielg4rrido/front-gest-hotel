import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay: string;
  type: "dorm" | "private" | "suite";
  capacity: number;
  features: string[];
  image: string;
}

interface RoomCardProps {
  room: Room;
  status: { text: string; variant: "default" | "destructive" };
  onViewDetails: () => void;
  onReserve: () => void;
  isReserveDisabled: boolean;
}

export function RoomCard({
  room,
  status,
  onViewDetails,
  onReserve,
  isReserveDisabled,
}: RoomCardProps) {
  return (
    <Card
      className="w-full overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col"
      style={{ minHeight: "500px" }}
    >
      <CardHeader className="flex-shrink-0 p-4 pb-2">
        <CardTitle className="text-lg truncate text-left">{room.name}</CardTitle>
        <CardDescription className="text-sm text-left">{room.description}</CardDescription>
      </CardHeader>

      {/* Imagem do quarto abaixo do nome */}
      <div className="px-4">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-[200px] lg:h-[250px]">
          <ImageWithFallback
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          <Badge
            className={`absolute top-3 right-3 z-10 ${
              status.variant === "default"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
            variant={status.variant}
          >
            {status.text}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col flex-grow p-4 pt-4">
        <div className="pb-3">
          <div className="text-left mb-2">
            <Badge className="bg-primary text-white text-sm px-3 py-1 rounded-full">
              R${room.priceDisplay}/noite
            </Badge>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-left">Comodidades:</h4>
            <div className="flex flex-wrap gap-2 min-h-[60px]">
              {room.features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-200">
          <Button className="flex-1 min-w-0" onClick={onViewDetails}>
            Ver Detalhes
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-w-0"
            onClick={onReserve}
            disabled={isReserveDisabled}
          >
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
