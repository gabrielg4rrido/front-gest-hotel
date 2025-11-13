import React from "react";
import { Loader2 } from "lucide-react";
import { RoomCard } from "./RoomCard";
import { Button } from "../ui/button";

// Reutilize a interface Room
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
  status: string;
}

interface RoomListProps {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  searchData: any; // Simplified for brevity
  getRoomStatus: (room: Room) => {
    text: string;
    variant: "default" | "destructive" | "warning";
  };
  isRoomAvailable: (
    status: string,
    checkIn?: string,
    checkOut?: string
  ) => boolean;
  onNavigate: (page: string, roomId?: string) => void;
  handleReserve: (room: Room) => void;
  onClearFilters: () => void;
}

export function RoomList({
  rooms,
  loading,
  error,
  searchData,
  getRoomStatus,
  isRoomAvailable,
  onNavigate,
  handleReserve,
  onClearFilters,
}: RoomListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-gray-600">Carregando quartos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Erro: {error}</p>
        <Button onClick={onClearFilters}>Tentar Novamente</Button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-500 mb-4">
          {searchData
            ? "Nenhum quarto disponível para o período selecionado."
            : "Nenhum quarto encontrado com os filtros aplicados."}
        </p>
        <Button onClick={onClearFilters} className="mt-4">
          Limpar Filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full transition-all duration-300">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          status={getRoomStatus(room)}
          onViewDetails={() => onNavigate("room-details", room.id)}
          onReserve={() => handleReserve(room)}
          isReserveDisabled={
            searchData &&
            !isRoomAvailable(room.status, searchData.checkIn, searchData.checkOut)
          }
        />
      ))}
    </div>
  );
}
