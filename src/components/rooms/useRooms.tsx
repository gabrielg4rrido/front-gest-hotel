import { useState, useEffect, useMemo } from "react";

interface Room {
  id: string;
  name: string;
  description: string;
  resume: string,
  price: number;
  priceDisplay: string;
  type: "dorm" | "private" | "suite";
  capacity: number;
  features: string[];
  image: string;
  status: string;
  rating?: number;
  reviews?: number;
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

const isRoomAvailable = (
  status: string,
  checkIn?: string,
  checkOut?: string
): boolean => {
  // Se o usuário não selecionou datas, mostra todos os quartos
  if (!checkIn || !checkOut) {
    return true;
  }

  // Considera "Disponível" como quarto livre
  return status === "Disponível";
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
      let url = "http://localhost:3003/api/quarto";

      // A API deve idealmente lidar com a disponibilidade
      if (searchData) {
        const params = new URLSearchParams();
        params.append("checkIn", searchData.checkIn);
        params.append("checkOut", searchData.checkOut);
        params.append("guests", searchData.guests.toString());
        url += `?${params.toString()}`;
      }

      let response;

      try {
        response = await fetch(url, { method: "GET" });
      } catch (err) {
        console.error("Erro de rede:", err);
        throw new Error("Falha ao conectar ao servidor.");
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar quartos");
      }

      let data;
      
      try {
        data = await response.json();
      } catch {
        throw new Error("Resposta inválida do servidor.");
      }

      const formattedData: Room[] = data.map((room: any) => ({
        ...room,
        status:
          room.status === 0
            ? "Disponível"
            : room.status === 1
            ? "Ocupado"
            : room.status === 2
            ? "Manutenção"
            : room.status,
      }));

      setRooms(formattedData);
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
        !isRoomAvailable(room.status, searchData.checkIn, searchData.checkOut)
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
