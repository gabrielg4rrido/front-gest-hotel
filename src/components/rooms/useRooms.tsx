import { useState, useEffect, useMemo } from "react";

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
  status: string;
}

//
interface UseRoomsProps {
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
  filterType: string[];
  sortBy: string;
}

// A função de disponibilidade pode viver aqui, pois é parte da lógica de dados.
const isRoomAvailable = (
  roomId: string,
  checkIn?: string,
  checkOut?: string
): boolean => {
  if (!checkIn || !checkOut) {
    return true;
  }
  // TODO: Substitua esta lógica mockada pela resposta real da sua API.
  // A API já deve filtrar por disponibilidade, então este mock pode ser removido
  // quando a API estiver funcionando 100%.
  return roomId === "qps450-005056a4845d";
};

export function useRooms({ searchData, filterType, sortBy }: UseRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      // A URL da sua API
      let url = "http://localhost:3002/api/quarto";

      // A API deve idealmente lidar com a disponibilidade
      if (searchData) {
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
      // Se a API já filtrou por disponibilidade, este filtro do lado do cliente pode não ser necessário.
      // Mantendo por enquanto, caso a API retorne todos e o front-end precise filtrar.
      if (
        searchData &&
        !isRoomAvailable(room.id, searchData.checkIn, searchData.checkOut)
      ) {
        return false;
      }
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
  }, [rooms, filterType, sortBy, searchData]);

  return {
    rooms: filteredAndSortedRooms,
    loading,
    error,
    refetch: fetchRooms,
    isRoomAvailable,
  };
}
