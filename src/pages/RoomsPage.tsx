import React, { useState, useEffect } from 'react';
import { SearchForm } from '../components/SearchForm';
import { Breadcrumb } from '../components/Breadcrumb';
import { RoomFilterSidebar } from '../components/rooms/RoomFilterSideBar';
import { useRooms } from '../components/rooms/useRooms'; // Importe o nosso novo hook!
import { RoomList } from '../components/rooms/RoomList'; 
import { RoomsPageHeader } from '../components/rooms/RoomsPageHeader';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay: string;
  type: 'dorm' | 'private' | 'suite';
  capacity: number;
  features: string[];
  image: string;
}

interface RoomsPageProps {
  onNavigate: (page: string, roomId?: string) => void;
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {
  const [searchData, setSearchData] = useState<{ checkIn: string; checkOut: string; guests: number; } | null>(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterType, setFilterType] = useState<string[]>([]);

  // O hook gerencia a complexidade dos dados
  const { rooms, loading, error, refetch, isRoomAvailable } = useRooms({ searchData, filterType, sortBy });

  useEffect(() => {
    const savedSearch = sessionStorage.getItem('hotelSearch');
    if (savedSearch) {
      setSearchData(JSON.parse(savedSearch));
    }
  }, []);

  const handleSearch = (newSearchData: { checkIn: string; checkOut: string; guests: number; }) => {
    setSearchData(newSearchData);
    sessionStorage.setItem('hotelSearch', JSON.stringify(newSearchData));
    // O hook vai reagir a essa mudança e buscar os dados automaticamente
  };
  
  const handleTypeFilter = (type: string, checked: boolean) => {
    setFilterType((prev) => checked ? [...prev, type] : prev.filter((t) => t !== type));
  };

   const handleReserve = (room: Room) => {
    if (searchData) {
      const paymentData = {
        type: 'room' as const,
        name: room.name,
        price: room.price,
        dates: { checkIn: searchData.checkIn, checkOut: searchData.checkOut },
        guests: searchData.guests
      };
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
      onNavigate('payment');
    } else {
      alert("Consulte uma data para a disponibilidade e prossiga com a reserva!");
    }
  };

  const getRoomStatus = (room: { id: string }) => {
    const available = isRoomAvailable(room.id, searchData?.checkIn, searchData?.checkOut);
    return {
      text: available ? 'Disponível' : 'Indisponível',
      variant: (available ? 'default' : 'destructive') as 'default' | 'destructive',
    };
  };
  
  const clearFiltersAndSearch = () => {
    setSearchData(null); 
    setFilterType([]);
    setSortBy('price');
    sessionStorage.removeItem('hotelSearch');
  };

  const breadcrumbItems = [
    { label: 'Quartos', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-2 max-w-7xl">

        <div className="w-full max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 min-w-0">
          <RoomFilterSidebar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterType={filterType}
            onTypeChange={handleTypeFilter}
          />

          <div className="flex-1 min-w-0">
            <RoomsPageHeader
                onSearch={handleSearch}
                searchData={searchData}
            />

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 min-h-[600px] pb-16">
              <RoomList
                rooms={rooms}
                loading={loading}
                error={error}
                searchData={searchData}
                getRoomStatus={getRoomStatus}
                isRoomAvailable={isRoomAvailable}
                onNavigate={onNavigate}
                handleReserve={handleReserve}
                onClearFilters={clearFiltersAndSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};


