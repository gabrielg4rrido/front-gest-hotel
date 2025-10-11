import React from 'react';
import { SearchForm } from '../SearchForm'; // Ajuste o caminho se necessário

// Defina os tipos para as props que o componente receberá
interface SearchData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface RoomsPageHeaderProps {
  onSearch: (data: SearchData) => void;
  searchData: SearchData | null;
}

export function RoomsPageHeader({ onSearch, searchData }: RoomsPageHeaderProps) {
  return (
    // Envolvemos os dois blocos em um único elemento pai
    <div>
      
      <div className="w-full max-w-4xl mx-auto text-center mb-8 min-h-[200px] flex items-center justify-center">
        <div className="w-full px-4">
          <h1 className="text-4xl mb-4">Nossos Quartos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha a acomodação perfeita para sua estadia. Todos os nossos quartos oferecem conforto e qualidade excepcionais.
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mb-12 min-h-[150px]">
        <SearchForm onSearch={onSearch} />
        {searchData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-center text-blue-800">
              <p className="text-center text-blue-800">
            <strong>Busca:</strong> {new Date(searchData.checkIn).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} até {new Date(searchData.checkOut).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} • {searchData.guests} {searchData.guests === 1 ? 'hóspede' : 'hóspedes'}
            </p>
              <span className="block mt-1 text-sm">
                Mostrando apenas quartos disponíveis para este período.
              </span>
            </p>
          </div>
        )}
      </div>

    </div>
  );
}