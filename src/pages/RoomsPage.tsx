import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SearchForm } from '../components/SearchForm';
import { Breadcrumb } from '../components/Breadcrumb';
import { RoomFilterSidebar } from '../components/RoomFilterSideBar';
import { Star } from 'lucide-react';

interface RoomsPageProps {
  onNavigate: (page: string, roomId?: number) => void;
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {
  const [searchData, setSearchData] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);

  useEffect(() => {
    // Get search data from sessionStorage if available
    const savedSearch = sessionStorage.getItem('hotelSearch');
    if (savedSearch) {
      setSearchData(JSON.parse(savedSearch));
    }
  }, []);

  const rooms = [
    {
      id: 1,
      name: 'Quarto Standard',
      description: 'Quarto confortável com todas as comodidades essenciais',
      price: 200,
      // type: 'dorm' | 'private' | 'suite';
      priceDisplay: 'R$ 200',
      features: ['Wi-Fi gratuito', 'TV a cabo', 'Ar condicionado', 'Frigobar'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
      rating: 4.2,
      reviews: 128
    },
    {
      id: 2,
      name: 'Quarto Deluxe',
      description: 'Quarto espaçoso com vista parcial para o mar',
      price: 350,
      priceDisplay: 'R$ 350',
      features: ['Wi-Fi gratuito', 'Smart TV', 'Ar condicionado', 'Frigobar', 'Varanda'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      rating: 4.5,
      reviews: 89
    },
    {
      id: 3,
      name: 'Suíte Premium',
      description: 'Suíte luxuosa com vista completa para o mar',
      price: 500,
      priceDisplay: 'R$ 500',
      features: ['Wi-Fi gratuito', 'Smart TV', 'Ar condicionado', 'Frigobar', 'Varanda', 'Jacuzzi'],
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
      rating: 4.8,
      reviews: 156
    },
    {
      id: 4,
      name: 'Suíte Presidencial',
      description: 'Nossa melhor acomodação com serviços VIP',
      price: 800,
      priceDisplay: 'R$ 800',
      features: ['Wi-Fi gratuito', 'Smart TV', 'Ar condicionado', 'Frigobar', 'Varanda', 'Jacuzzi', 'Sala de estar'],
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400',
      rating: 4.9,
      reviews: 73
    }
  ];

  const handleSearch = (newSearchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    setSearchData(newSearchData);
    sessionStorage.setItem('hotelSearch', JSON.stringify(newSearchData));
  };

  const handleReserve = (room: typeof rooms[0]) => {
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
      onNavigate('room-details', room.id);
    }
  };

  const breadcrumbItems = [
    { label: 'Quartos', href: '#' }
  ];

  const getRoomTypeName = (type: string) => {
    switch (type) {
      case 'dorm':
        return 'Compartilhado';
      case 'private':
        return 'Privativo';
      case 'suite':
        return 'Suíte';
      default:
        return type;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'dorm':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-green-100 text-green-800';
      case 'suite':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const [sortBy, setSortBy] = useState('price');
  const [filterType, setFilterType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleTypeFilter = (type: string, checked: boolean) => {
  if (checked) {
    setFilterType((prev) => [...prev, type]);
  } else {
    setFilterType((prev) => prev.filter((t) => t !== type));
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
              
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Nossos Quartos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha a acomodação perfeita para sua estadia. Todos os nossos quartos 
            oferecem conforto e qualidade excepcionais.
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12 ">
          <SearchForm onSearch={handleSearch} />
          {searchData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-4xl mx-auto">
              <p className="text-center text-blue-800">
                <strong>Busca:</strong> {new Date(searchData.checkIn).toLocaleDateString('pt-BR')} até {new Date(searchData.checkOut).toLocaleDateString('pt-BR')} • {searchData.guests} {searchData.guests === 1 ? 'hóspede' : 'hóspedes'}
              </p>
            </div>
          )}
        </div>

        {/* Rooms Grid */}
        <div className="flex flex-col items-center gap-8">
          
          {rooms.map((room) => (
            <Card 
              key={room.id} 
              className="w-full max-w-4xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {/* <div className="absolute top-4 left-4">
                    <Badge className={getRoomTypeColor(rooms.type)}>
                      {getRoomTypeName(rooms.type)}
                    </Badge>
                </div> */}
                
              </div>
              
              <CardHeader className="flex-shrink-0">
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{room.description}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{room.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({room.reviews} avaliações)</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                  <h4 className="mb-2">Comodidades:</h4>

                  <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-wrap gap-2">
                          {room.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                           ))}
                        </div>

                        <div className="shrink-0">
                            <Badge className="bg-white text-black text-3xl px-5 py-3 rounded-full">
                              {room.priceDisplay}/noite
                            </Badge>
                        </div>
                  </div>

                  
                </div>

                
                
                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1"
                    onClick={() => onNavigate('room-details', room.id)}
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleReserve(room)}
                  >
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-2xl mb-4">Não encontrou o que procurava?</h3>
          <p className="text-gray-600 mb-6">
            Entre em contato conosco para opções personalizadas e ofertas especiais.
          </p>
          <Button size="lg">
            Falar com Atendimento
          </Button>
        </div>
        
        
        
      </div>
    <div className="w-full lg:w-80 lg:pt-8 lg:pl-4 shrink-0">
          <RoomFilterSidebar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterType={filterType}
            onTypeChange={handleTypeFilter}
            priceRange={priceRange}
          />
        </div>
    </div>
    
  );
}