import { useState, useEffect, useMemo } from "react";
import env from "../../config/env";

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
  rating: number;
  reviews: number;
}

interface UseRoomsProps {
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
  filterType: string[];
  sortBy: string;
}

export function useRooms({ searchData, filterType, sortBy }: UseRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${env.API_QUARTO_URL}/api/quarto`;

      // Se houver dados de busca, usa o endpoint de quartos disponíveis
      if (searchData && searchData.checkIn && searchData.checkOut) {
        url = `${env.API_QUARTO_URL}/api/quarto/disponiveis`;
        const params = new URLSearchParams();
        params.append("checkIn", searchData.checkIn);
        params.append("checkOut", searchData.checkOut);
        params.append("guests", searchData.guests.toString());
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar quartos");
      }
      const data: Room[] = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para buscar os quartos quando os dados de busca mudarem
  useEffect(() => {
    fetchRooms();
  }, [searchData]); // A dependência agora é o objeto de busca inteiro

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      // Filtro por tipo
      if (filterType.length > 0 && !filterType.includes(room.type)) {
        return false;
      }
      // A API já filtra por disponibilidade, então não precisamos filtrar aqui
      return true;
    });

    return [...filtered].sort((a, b) => {
      // Usar spread `[...]` para não modificar o array original
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "capacity":
          return a.capacity - b.capacity;
        default:
          return 0;
      }
    });
  }, [rooms, filterType, sortBy]);

  const isRoomAvailable = (
    roomId: string,
    checkIn?: string,
    checkOut?: string
  ) => {
    // If no search dates provided, consider room available for reservation flow
    if (!searchData || !checkIn || !checkOut) return true;
    // When a search is active the API endpoint returns only available rooms,
    // so check if the room id exists in the fetched rooms array.
    return rooms.some((r: Room) => r.id === roomId);
  };

  return {
    rooms: filteredAndSortedRooms,
    loading,
    error,
    refetch: fetchRooms,
    isRoomAvailable,
  };
}
