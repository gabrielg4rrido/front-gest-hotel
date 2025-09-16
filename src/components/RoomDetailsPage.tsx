import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageGallery } from './ImageGallery';
import { Breadcrumb } from './Breadcrumb';
import { ArrowLeft, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Flower, Users, Bed, Bath, Square, Star, Phone, MessageCircle } from 'lucide-react';

interface RoomDetailsPageProps {
  roomId: number;
  onNavigate: (page: string, roomId?: number) => void;
  onOpenPayment: (type: 'room' | 'service', data: any) => void;
}

export function RoomDetailsPage({ roomId, onNavigate, onOpenPayment }: RoomDetailsPageProps) {


  // Dados dos quartos expandidos
  const roomsData = {
    1: {
      name: 'Quarto Standard',
      description: 'Nosso quarto Standard oferece todo o conforto necessário para uma estadia agradável. Com decoração moderna e mobiliário de qualidade, é a escolha perfeita para viajantes que buscam praticidade e bom custo-benefício.',
      price: 200,
      area: '25m²',
      capacity: 2,
      beds: '1 cama de casal',
      bathroom: '1 banheiro privativo',
      features: [
        'Wi-Fi gratuito de alta velocidade',
        'Smart TV 43" com canais a cabo',
        'Ar condicionado individual',
        'Frigobar',
        'Cofre digital',
        'Secador de cabelo',
        'Kit amenities',
        'Serviço de quarto 24h'
      ],
      amenities: [
        { icon: Wifi, name: 'Wi-Fi gratuito' },
        { icon: Car, name: 'Estacionamento' },
        { icon: Coffee, name: 'Café da manhã' },
        { icon: Utensils, name: 'Restaurante' }
      ],
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTg5NjN8MA&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1678924133506-7508daa13c7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiYXRocm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NTY4MzUzNzV8MA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      rating: 4.2,
      reviews: 128
    },
    2: {
      name: 'Quarto Deluxe',
      description: 'O Quarto Deluxe oferece mais espaço e conforto, com uma decoração sofisticada e vista parcial para o mar. Perfeito para casais em lua de mel ou viajantes que desejam um pouco mais de luxo em sua estadia.',
      price: 350,
      area: '35m²',
      capacity: 3,
      beds: '1 cama de casal + 1 sofá-cama',
      bathroom: '1 banheiro com banheira',
      features: [
        'Wi-Fi gratuito de alta velocidade',
        'Smart TV 55" com streaming',
        'Ar condicionado individual',
        'Frigobar premium',
        'Varanda com vista parcial do mar',
        'Cofre digital',
        'Roupão e chinelos',
        'Kit amenities premium',
        'Serviço de quarto 24h',
        'Máquina de café Nespresso'
      ],
      amenities: [
        { icon: Wifi, name: 'Wi-Fi gratuito' },
        { icon: Car, name: 'Estacionamento' },
        { icon: Coffee, name: 'Café da manhã' },
        { icon: Utensils, name: 'Restaurante' },
        { icon: Waves, name: 'Vista do mar' }
      ],
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'https://images.unsplash.com/photo-1685300077128-ca33b07cc561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiYWxjb255JTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1NjgzNTM3OHww&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTg5NjN8MA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      rating: 4.5,
      reviews: 89
    },
    3: {
      name: 'Suíte Premium',
      description: 'Nossa Suíte Premium é o ápice do luxo e conforto. Com vista completa para o mar, jacuzzi privativa e acabamentos de primeira qualidade, oferece uma experiência verdadeiramente exclusiva.',
      price: 500,
      area: '50m²',
      capacity: 4,
      beds: '1 cama king size + sofá-cama',
      bathroom: '1 banheiro com jacuzzi',
      features: [
        'Wi-Fi gratuito de alta velocidade',
        'Smart TV 65" com streaming',
        'Ar condicionado individual',
        'Frigobar premium com bebidas inclusas',
        'Varanda ampla com vista completa do mar',
        'Jacuzzi privativa',
        'Cofre digital',
        'Roupão e chinelos premium',
        'Kit amenities de luxo',
        'Serviço de quarto 24h',
        'Máquina de café premium',
        'Check-in/out express'
      ],
      amenities: [
        { icon: Wifi, name: 'Wi-Fi gratuito' },
        { icon: Car, name: 'Estacionamento VIP' },
        { icon: Coffee, name: 'Café da manhã premium' },
        { icon: Utensils, name: 'Restaurante' },
        { icon: Waves, name: 'Vista completa do mar' },
        { icon: Flower, name: 'Spa access' }
      ],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        'https://images.unsplash.com/photo-1685300077128-ca33b07cc561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiYWxjb255JTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1NjgzNTM3OHww&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTg5NjN8MA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      rating: 4.8,
      reviews: 156
    },
    4: {
      name: 'Suíte Presidencial',
      description: 'A Suíte Presidencial representa o que há de mais exclusivo em hospedagem. Com sala de estar separada, serviços VIP personalizados e vistas panorâmicas, é perfeita para ocasiões especiais.',
      price: 800,
      area: '80m²',
      capacity: 6,
      beds: '1 cama king size + sala com sofá-cama',
      bathroom: '2 banheiros com jacuzzi',
      features: [
        'Wi-Fi gratuito de alta velocidade',
        'Smart TV 75" + TV adicional na sala',
        'Ar condicionado individual',
        'Frigobar premium totalmente abastecido',
        'Varanda panorâmica com vista 360°',
        'Jacuzzi com vista para o mar',
        'Sala de estar separada',
        'Cofre digital grande',
        'Roupões e chinelos de luxo',
        'Kit amenities exclusivo',
        'Serviço de quarto 24h VIP',
        'Máquina de café profissional',
        'Check-in/out privativo',
        'Concierge personalizado',
        'Transfer gratuito'
      ],
      amenities: [
        { icon: Wifi, name: 'Wi-Fi gratuito' },
        { icon: Car, name: 'Valet parking' },
        { icon: Coffee, name: 'Café da manhã VIP' },
        { icon: Utensils, name: 'Restaurante VIP' },
        { icon: Waves, name: 'Vista panorâmica' },
        { icon: Flower, name: 'Spa premium' },
        { icon: Dumbbell, name: 'Academia' }
      ],
      images: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'https://images.unsplash.com/photo-1685300077128-ca33b07cc561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiYWxjb255JTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1NjgzNTM3OHww&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTg5NjN8MA&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1678924133506-7508daa13c7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiYXRocm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NTY4MzUzNzV8MA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      rating: 4.9,
      reviews: 73
    }
  };

  const room = roomsData[roomId as keyof typeof roomsData];

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Quarto não encontrado</h1>
          <Button onClick={() => onNavigate('rooms')}>
            Voltar aos Quartos
          </Button>
        </div>
      </div>
    );
  }

  const handleReservation = () => {
    onOpenPayment('room', {
      name: room.name,
      price: room.price,
      guests: room.capacity
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Quartos', page: 'rooms' },
            { label: room.name, page: 'room-details', roomId: roomId }
          ]}
          onNavigate={onNavigate}
        />

        {/* Galeria de Imagens */}
        <Card className="overflow-hidden mb-8">
          <CardContent className="p-6">
            <ImageGallery images={room.images} title={room.name} />
          </CardContent>
        </Card>

        {/* Informações do Quarto */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{room.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(room.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {room.rating} ({room.reviews} avaliações)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl text-primary">R$ {room.price}</div>
                <div className="text-sm text-gray-600">por noite</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{room.description}</p>

            {/* Informações Básicas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-gray-600" />
                <span>{room.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span>Até {room.capacity} pessoas</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-gray-600" />
                <span>{room.beds}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-gray-600" />
                <span>{room.bathroom}</span>
              </div>
            </div>

            {/* Comodidades */}
            <div className="mb-6">
              <h3 className="text-xl mb-3">Comodidades Incluídas</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {room.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Serviços do Hotel */}
            <div>
              <h3 className="text-xl mb-3">Serviços do Hotel</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                    <amenity.icon className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Reserva */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reservar Quarto</CardTitle>
            <CardDescription>
              {room.name} - A partir de R$ {room.price} por noite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coluna 1: Informações de Reserva */}
              <div className="space-y-4">
                {/* Informações de Capacidade */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Capacidade:</span>
                    <span>Até {room.capacity} pessoas</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Área:</span>
                    <span>{room.area}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Preço por noite:</span>
                    <span className="text-xl text-primary">R$ {room.price}</span>
                  </div>
                </div>

                <Button onClick={handleReservation} className="w-full" size="lg">
                  Reservar Agora
                </Button>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Cancelamento gratuito até 24h antes</p>
                  <p>✓ Não cobramos taxa de reserva</p>
                  <p>✓ Confirmação imediata</p>
                </div>
              </div>

              {/* Coluna 2: Contato e Benefícios */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg mb-3">Benefícios da Reserva</h4>
                  <div className="space-y-2 text-sm">
                    <p>✓ Check-in a partir das 15h</p>
                    <p>✓ Check-out até 12h</p>
                    <p>✓ Wi-Fi gratuito em todo o hotel</p>
                    <p>✓ Acesso à piscina e academia</p>
                    <p>✓ Estacionamento incluso</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Dúvidas? Entre em contato conosco
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Avaliações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Avaliações dos Hóspedes</CardTitle>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{room.rating} de 5</span>
                <span className="text-gray-500">({room.reviews} avaliações)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Sample Reviews */}
            <div className="space-y-6">
              {[
                {
                  name: 'Carlos Mendes',
                  rating: 5,
                  comment: 'Quarto excelente! Muito limpo e confortável. A vista é maravilhosa.',
                  date: '20 de agosto, 2024'
                },
                {
                  name: 'Marina Santos',
                  rating: 4,
                  comment: 'Gostei muito da estadia. O quarto é espaçoso e bem equipado.',
                  date: '15 de agosto, 2024'
                },
                {
                  name: 'Roberto Silva',
                  rating: 5,
                  comment: 'Perfeito para uma estadia relaxante. Recomendo!',
                  date: '12 de agosto, 2024'
                }
              ].map((review, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm">{review.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}