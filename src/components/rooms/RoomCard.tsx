import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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

interface RoomCardProps {
  room: Room;
  status: { text: string; variant: 'default' | 'destructive' };
  onViewDetails: () => void;
  onReserve: () => void;
  isReserveDisabled: boolean;
}

export function RoomCard({ room, status, onViewDetails, onReserve, isReserveDisabled }: RoomCardProps) {
  return (
    <Card className="w-full overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col" style={{ minHeight: '500px' }}>
      <div className="relative flex-shrink-0 overflow-hidden bg-gray-200 h-[200px] lg:h-[250px]">
        <ImageWithFallback
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <Badge
          className={`absolute top-6 right-2 z-10 ${status.variant === 'default' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          variant={status.variant}
        >
          {status.text}
        </Badge>
      </div>
      <CardHeader className="flex-shrink-0 py-4 px-4">
        <CardTitle className="text-lg truncate">{room.name}</CardTitle>
        <CardDescription className="text-sm">{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4 space-y-4">
        <div className="flex-grow">
          <h4 className="mb-2 text-sm font-medium">Comodidades:</h4>
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-wrap gap-2 min-h-[60px] flex-1 min-w-0">
              {room.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs whitespace-nowrap">{feature}</Badge>
              ))}
            </div>
            <div className="shrink-0">
              <Badge className="bg-white text-black text-3xl px-5 py-3 rounded-full whitespace-nowrap">
                {room.priceDisplay}/noite
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button className="flex-1 min-w-0" onClick={onViewDetails}>Ver Detalhes</Button>
          <Button variant="outline" className="flex-1 min-w-0" onClick={onReserve} disabled={isReserveDisabled}>Reservar</Button>
        </div>
      </CardContent>
    </Card>
  );
}