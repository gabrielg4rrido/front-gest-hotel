import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RoomsPageProps {
  onNavigate: (page: string, roomId?: number) => void;
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {
  const rooms = [
    {
      id: 1,
      name: 'Quarto Standard',
      description: 'Quarto confortável com todas as comodidades essenciais',
      price: 'R$ 200',
      features: ['Wi-Fi gratuito', 'TV a cabo', 'Ar condicionado', 'Frigobar'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'
    },
    {
      id: 2,
      name: 'Quarto Deluxe',
      description: 'Quarto espaçoso com vista parcial para o mar',
      price: 'R$ 350',
      features: ['Wi-Fi gratuito', 'Smart TV', 'Ar condicionado', 'Frigobar', 'Varanda'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
    },
    {
      id: 3,
      name: 'Suíte Premium',
      description: 'Suíte luxuosa com vista completa para o mar',
      price: 'R$ 500',
      features: ['Wi-Fi gratuito', 'Smart TV', 'Ar condicionado', 'Frigobar', 'Varanda', 'Jacuzzi'],
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400'
    },
    {
      id: 4,
      name: 'Suíte Presidencial',
      description: 'Nossa melhor acomodação com serviços VIP',
      price: 'R$ 800',
      features: ['Wi-Fi gratuito', 'Smart TV', 'Ar condicionado', 'Frigobar', 'Varanda', 'Jacuzzi', 'Sala de estar'],
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Nossos Quartos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha a acomodação perfeita para sua estadia. Todos os nossos quartos 
            oferecem conforto e qualidade excepcionais.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-white">
                    {room.price}/noite
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <h4 className="mb-2">Comodidades:</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => onNavigate('room-details', room.id)}
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onNavigate('register')}
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
    </div>
  );
}