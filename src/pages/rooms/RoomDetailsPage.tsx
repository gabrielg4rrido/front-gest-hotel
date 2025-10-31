import React, { useState, useEffect } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import { RoomLoadingState } from "../../components/rooms/details/RoomLoadingState";
import { RoomErrorState } from "../../components/rooms/details/RoomErrorState";
import { RoomInfo } from "../../components/rooms/details/RoomInfo";
import { ReservationCard } from "../../components/rooms/details/ReservationCard";
import { GalleryCard } from "../../components/GalleryCard";

// --- INTERFACES E TIPOS ---

interface ApiRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  imagem: string;
  // Campos que inferi do seu JSX (opcionais)
  area?: string;
  beds?: string;
  bathroom?: string;
  features?: string[];
}

interface RoomDetailsPageProps {
  roomId: string;
  onNavigate: (page: string, roomId?: string) => void;
  onOpenPayment: (type: "room" | "service", data: any) => void;
}

// --- COMPONENTE PRINCIPAL ---

export function RoomDetailsPage({
  roomId,
  onNavigate,
  onOpenPayment,
}: RoomDetailsPageProps) {
  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3002/api/quarto/${roomId}`);
        if (!response.ok) {
          throw new Error("Quarto não encontrado ou falha na comunicação.");
        }
        const apiRoomData: ApiRoom = await response.json();
        const formattedRoom = {
          ...apiRoomData,
          image: apiRoomData.imagem?.trim(),
        };
        setRoom(formattedRoom);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleReservation = () => {
    if (!room) return; // Proteção
    onOpenPayment("room", {
      name: room.name,
      price: room.price,
      guests: room.capacity,
    });
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (loading) {
    return <RoomLoadingState />;
  }

  if (error || !room) {
    return (
      <RoomErrorState
        error={error}
        onNavigateBack={() => onNavigate("rooms")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Quartos", page: "rooms" },
            {
              label: room.name || "Quarto",
              page: "room-details",
              roomId: roomId,
            },
          ]}
          onNavigate={onNavigate}
        />

        {/* Galeria de Imagens */}
        <GalleryCard
          images={room.imagem ? [room.imagem] : []}
          title={room.name}
        />

        {/* Informações do Quarto */}
        <RoomInfo
          name={room.name}
          price={room.price}
          description={room.description}
          area={room.area}
          capacity={room.capacity}
          beds={room.beds}
          bathroom={room.bathroom}
          features={room.features}
        />

        {/* Card de Reserva */}
        <ReservationCard
          roomName={room.name}
          price={room.price}
          capacity={room.capacity}
          area={room.area}
          onReserve={handleReservation}
        />
      </div>
    </div>
  );
}