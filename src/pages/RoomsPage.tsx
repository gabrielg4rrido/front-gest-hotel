import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SearchForm } from '../components/SearchForm';
import { Breadcrumb } from '../components/Breadcrumb';
import { RoomFilterSidebar } from '../components/RoomFilterSideBar';


interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  priceDisplay: string;
  type: 'dorm' | 'private' | 'suite';
  capacity: number;
  features: string[];
  image: string;
  rating: number;
  reviews: number;
  // Não precisa de status fixo — calculado dinamicamente
}

interface RoomsPageProps {
  onNavigate: (page: string, roomId?: number) => void;
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {

  const [searchData, setSearchData] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);

  const [sortBy, setSortBy] = useState('price');
  const [filterType, setFilterType] = useState<string[]>([]);

  const [rooms, setRooms] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get search data from sessionStorage if available
    const savedSearch = sessionStorage.getItem('hotelSearch');
    if (savedSearch) {
      setSearchData(JSON.parse(savedSearch));
    } 
  }, []);

   const fetchRooms = async (searchParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // AJUSTE AQUI: Mude para o URL da sua API (ex: http://seu-servidor:porta/api/rooms)
      let url = 'http://localhost:3001/api/rooms'; // Exemplo de endpoint
      // Se houver searchParams, adicione como query params na URL (para filtro de disponibilidade)
      if (searchParams) {
        const params = new URLSearchParams();
        if (searchParams.checkIn) params.append('checkIn', searchParams.checkIn);
        if (searchParams.checkOut) params.append('checkOut', searchParams.checkOut);
        if (searchParams.guests) params.append('guests', searchParams.guests.toString());
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar quartos');
      }
      const data: Room[] = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setRooms([]); // Limpa a lista em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(); // Busca todos os quartos inicialmente
  }, []);

  // ATUALIZADO: Função para simular disponibilidade (mockada por enquanto)
  // Na real, remova isso e use a API para filtrar (veja fetchRooms acima)
  const isRoomAvailable = (roomId: number, checkIn?: string, checkOut?: string): boolean => {
    if (!checkIn || !checkOut) {
      return true; // Sem busca: todos disponíveis
    }
    // Simulação: Só Suíte Presidencial (id 5) disponível para qualquer período
    // TODO: Integre com API real — chame um endpoint como /api/rooms/{id}/availability
    return roomId === 5;
  };

  // busca por data e capacidade
  const handleSearch = (newSearchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    setSearchData(newSearchData);
    sessionStorage.setItem('hotelSearch', JSON.stringify(newSearchData));
    // NOVO: Recarrega quartos da API com os parâmetros de busca (para disponibilidade real)
    fetchRooms(newSearchData);
  };

  const handleReserve = (room: Room) => {
    if (searchData) {
      // Navigate to payment with room and search data
      const paymentData = {
        type: 'room' as const,
        name: room.name,
        price: room.price,
        dates: {
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut
        },
        guests: searchData.guests
      };

      // Store payment data for the payment page
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
      onNavigate('payment');
    } else {
      // If no search data, navigate to room details to get dates
      alert("Consulte uma data para a disponibilidade e prossiga com a reserva!");
    }
  };

  const breadcrumbItems = [
    { label: 'Quartos', href: '#' }
  ];

  

  const handleTypeFilter = (type: string, checked: boolean) => {
    if (checked) {
      setFilterType((prev) => [...prev, type]);
    } else {
      setFilterType((prev) => prev.filter((t) => t !== type));
    }
  };

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      // Filtro por tipo
      if (filterType.length > 0 && !filterType.includes(room.type)) {
        return false;
      }
      // Filtro por disponibilidade (só se searchData existe)
      if (searchData && !isRoomAvailable(room.id, searchData.checkIn, searchData.checkOut)) {
        return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'capacity':
          return a.capacity - b.capacity;
        default:
          return 0;
      }
    });
  }, [rooms, filterType, sortBy, searchData]);

    // Função auxiliar para obter status do quarto (para badge)
  const getRoomStatus = (room: Room) => {
    const available = isRoomAvailable(room.id, searchData?.checkIn, searchData?.checkOut);
    return {
      text: available ? 'Disponível' : 'Indisponível',
      variant: available ? 'default' : 'destructive' // Verde/padrão para disponível, vermelho para indisponível
    };
  };

  // NOVO: Renderiza loading ou erro
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Carregando quartos...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro: {error}</p>
          <Button onClick={() => fetchRooms()}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }
   

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl"> {/* Adicionado: max-w-7xl para limitar largura total e evitar shifts em telas largas */}
        
        {/* Breadcrumb - Largura consistente */}
          <div className="w-full max-w-4xl mx-auto mb-4"> {/* max-w-4xl mx-auto para alinhar com cards */}
            <Breadcrumb items={breadcrumbItems} />
          </div>

        <div className="flex flex-col lg:flex-row gap-8 min-w-0"> {/* Adicionado: min-w-0 para flex não expandir horizontalmente */}
          <RoomFilterSidebar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterType={filterType}
            onTypeChange={handleTypeFilter}
          />
            {/* TRANSFORMAR EM COMPONENT */}
          <div className=""> {/* min-w-0 para evitar expansão no flex */}
            
            {/* Header - Largura fixa e centralizada */}
            <div className="w-full max-w-4xl mx-auto text-center mb-8 min-h-[200px] flex items-center justify-center">
              <div className="w-full px-4"> {/* px-4 para padding interno consistente */}
                <h1 className="text-4xl mb-4">Nossos Quartos</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Escolha a acomodação perfeita para sua estadia. Todos os nossos quartos
                  oferecem conforto e qualidade excepcionais.
                </p>
              </div>
            </div>

            {/* Search Form - Largura fixa */}
            <div className="w-full max-w-4xl mx-auto mb-12 min-h-[150px]">
              <SearchForm onSearch={handleSearch} />
              {searchData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-center text-blue-800">
                    <strong>Busca:</strong> {new Date(searchData.checkIn).toLocaleDateString('pt-BR')} até {new Date(searchData.checkOut).toLocaleDateString('pt-BR')} • {searchData.guests} {searchData.guests === 1 ? 'hóspede' : 'hóspedes'}
                    <span className="block mt-1 text-sm">
                      Mostrando apenas quartos disponíveis para este período.
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Rooms Grid - Largura fixa e overflow controlado */}
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 min-h-[600px] pb-16">
              {filteredAndSortedRooms.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full transition-all duration-300">
                  {filteredAndSortedRooms.map((room) => {
                    const status = getRoomStatus(room);
                    return (

                      <Card
                        key={room.id}
                        className="w-full overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col" // overflow-hidden para conter badges/imagens
                        style={{ minHeight: '500px' }}
                      >

                        <div className="relative flex-shrink-0 overflow-hidden bg-gray-200 h-[200px] lg:h-[250px]"> {/* overflow-hidden extra para imagem */}

                          <ImageWithFallback
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-300" // object-cover + transition para suavidade
                            fill // Assuma que suporta fill para preencher exatamente
                          />

                          {/* Badge de Status - Posição absoluta contida */}
                          <Badge
                            className={`
                            absolute top-6 right-2 z-10 text-decoration-none
                            ${status.variant === 'default'
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                              }
                          `}
                            variant={status.variant}
                          >
                            {status.text}
                          </Badge>

                        </div>

                        <CardHeader className="flex-shrink-0 py-4 px-4"> {/* px-4 para padding horizontal consistente */}
                          <CardTitle className="text-lg truncate">{room.name}</CardTitle> {/* truncate para evitar overflow de texto longo */}
                          <CardDescription className="text-sm">{room.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col flex-grow p-4 space-y-4">
                          <div className="flex-grow">
                            <h4 className="mb-2 text-sm font-medium">Comodidades:</h4>
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-wrap gap-2 min-h-[60px] flex-1 min-w-0"> {/* flex-1 min-w-0 para não expandir horizontalmente */}
                                {room.features.map((feature, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs whitespace-nowrap"> {/* whitespace-nowrap para badges não quebrarem linha excessivamente */}
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <div className="shrink-0 flex-shrink-0">
                                <Badge className="bg-white text-black text-3xl px-5 py-3 rounded-full whitespace-nowrap">
                                  {room.priceDisplay}/noite
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-200">
                            <Button
                              className="flex-1 min-w-0" // min-w-0 para botões não expandirem
                              onClick={() => onNavigate('room-details', room.id)}
                            >
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 min-w-0"
                              onClick={() => handleReserve(room)}
                              disabled={searchData && !isRoomAvailable(room.id, searchData.checkIn, searchData.checkOut)}
                            >
                              Reservar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                    );
                  })}
                </div>
              ) : (
                <div className="w-full text-center py-8"> {/* w-full para largura consistente */}
                  <p className="text-gray-500 mb-4">
                    {searchData
                      ? 'Nenhum quarto disponível para o período selecionado.'
                      : 'Nenhum quarto encontrado com os filtros aplicados.'
                    }
                  </p>
                  <Button
                    onClick={() => {
                      setFilterType([]);
                      setSortBy('price');
                      fetchRooms();
                    }}
                    className="mt-4"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};