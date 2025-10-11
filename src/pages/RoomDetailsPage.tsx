import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageGallery } from '../components/ImageGallery';
import { Breadcrumb } from '../components/Breadcrumb';
import { ArrowLeft, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Flower, Users, Bed, Bath, Square, Star, Phone, MessageCircle } from 'lucide-react';

// --- INTERFACES E TIPOS ---

// Interface para os dados que vêm da sua API (banco de dados)
interface ApiRoom {
  id: string; // UUID vindo do banco
  name: string;
  description: string; // Pode vir do banco, mas o mock irá sobrescrever se existir
  price: number;
  capacity: number;
}

// Interface para as props do componente, com roomId como string (UUID)
interface RoomDetailsPageProps {
  roomId: string; 
  onNavigate: (page: string, roomId?: string) => void;
  onOpenPayment: (type: 'room' | 'service', data: any) => void;
}

// --- DADOS MOCKADOS ---

// Objeto com os detalhes estáticos e ricos.
// As chaves devem ser os UUIDs REAIS dos seus quartos no banco de dados.
const mockDetailsData = {
  // Exemplo de UUID para o 'Quarto Standard'. Substitua pelo seu UUID real.
  'qqs215-005056a4845d': {
    description: 'Nosso quarto Standard oferece todo o conforto necessário para uma estadia agradável. Com decoração moderna e mobiliário de qualidade, é a escolha perfeita para viajantes que buscam praticidade e bom custo-benefício.',
    area: '25m²',
    beds: '1 cama de casal',
    bathroom: '1 banheiro privativo',
    features: [ 'Wi-Fi gratuito de alta velocidade', 'Smart TV 43" com canais a cabo', 'Ar condicionado individual', 'Frigobar', 'Secador de cabelo', 'Kit amenities', 'Serviço de quarto 24h' ],
    amenities: [ { icon: Wifi, name: 'Wi-Fi gratuito' }, { icon: Car, name: 'Estacionamento' }, { icon: Coffee, name: 'Café da manhã' }, { icon: Utensils, name: 'Restaurante' } ],
    images: [ 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?w=800', 'https://images.unsplash.com/photo-1678924133506-7508daa13c7c?w=800' ],
    rating: 4.2,
    reviews: 128
  },
  // Exemplo para 'Suíte Presidencial'. Substitua pelo seu UUID real.
  'qqd320-005056a4845d': {
    description: 'A Suíte Presidencial representa o que há de mais exclusivo em hospedagem. Com sala de estar separada, serviços VIP personalizados e vistas panorâmicas, é perfeita para ocasiões especiais.',
    area: '80m²',
    beds: '1 cama king size + sala com sofá-cama',
    bathroom: '2 banheiros com jacuzzi',
    features: [ 'Wi-Fi gratuito de alta velocidade', 'Smart TV 75" + TV adicional na sala', 'Ar condicionado individual', 'Frigobar premium totalmente abastecido', 'Varanda panorâmica com vista 360°', 'Jacuzzi com vista para o mar', 'Sala de estar separada', 'Cofre digital grande', 'Roupões e chinelos de luxo', 'Kit amenities exclusivo', 'Serviço de quarto 24h VIP', 'Máquina de café profissional', 'Check-in/out privativo', ],
    amenities: [ { icon: Wifi, name: 'Wi-Fi gratuito' }, { icon: Car, name: 'Valet parking' }, { icon: Coffee, name: 'Café da manhã VIP' }, { icon: Utensils, name: 'Restaurante VIP' }, { icon: Waves, name: 'Vista panorâmica' }, { icon: Flower, name: 'Spa premium' }, { icon: Dumbbell, name: 'Academia' } ],
    images: [ 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1685300077128-ca33b07cc561?w=800', 'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?w=800', 'https://images.unsplash.com/photo-1678924133506-7508daa13c7c?w=800' ],
    rating: 4.9,
    reviews: 73
  }
  // Adicione os outros quartos aqui, usando seus UUIDs como chaves
};

// --- COMPONENTE PRINCIPAL ---

export function RoomDetailsPage({ roomId, onNavigate, onOpenPayment }: RoomDetailsPageProps) {
  // Estados para gerenciar os dados, o carregamento e possíveis erros
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('ID do quarto recebido:', roomId);

  // Hook para buscar os dados da API quando o componente é montado ou o roomId muda
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Busca os dados dinâmicos da sua API
        const response = await fetch(`http://localhost:3001/api/rooms/${roomId}`); // Ajuste a URL se necessário
        if (!response.ok) {
          throw new Error('Quarto não encontrado ou falha na comunicação com o servidor.');
        }
        const apiRoomData: ApiRoom = await response.json();

        // 2. Busca os dados estáticos (mock) correspondentes ao UUID
        const mockRoomDetails = mockDetailsData[roomId as keyof typeof mockDetailsData];

        // 3. Mescla os dados da API com os dados mockados
        // A ordem é importante: os dados do mock (mockRoomDetails) sobrescreverão
        // qualquer campo com o mesmo nome que venha da API (apiRoomData).
        const finalRoomData = {
          ...apiRoomData,
          ...mockRoomDetails,
        };

        setRoom(finalRoomData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]); // A dependência [roomId] garante que a busca seja refeita se o usuário navegar para outro quarto

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Carregando detalhes do quarto...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">{error || 'Quarto não encontrado'}</h1>
          <Button onClick={() => onNavigate('rooms')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a lista de quartos
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
  
  // --- RENDERIZAÇÃO PRINCIPAL ---
  // O JSX abaixo permanece praticamente o mesmo, pois agora ele lê
  // os dados do objeto `room` do estado, que já contém os dados mesclados.

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Quartos', page: 'rooms' },
            { label: room.name, page: 'room-details', roomId: roomId }
          ]}
          onNavigate={onNavigate}
        />

        <Card className="overflow-hidden mb-8">
          <CardContent className="p-6">
            <ImageGallery images={room.images || []} title={room.name} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{room.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(room.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{room.rating} ({room.reviews} avaliações)</span>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2"><Square className="w-5 h-5 text-gray-600" /><span>{room.area}</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-600" /><span>Até {room.capacity} pessoas</span></div>
              <div className="flex items-center gap-2"><Bed className="w-5 h-5 text-gray-600" /><span>{room.beds}</span></div>
              <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-gray-600" /><span>{room.bathroom}</span></div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl mb-3">Comodidades Incluídas</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {room.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div><span className="text-sm">{feature}</span></div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-3">Serviços do Hotel</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {room.amenities.map((amenity: { icon: React.ElementType, name: string }, index: number) => (
                  <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg"><amenity.icon className="w-6 h-6 text-primary mb-2" /><span className="text-sm">{amenity.name}</span></div>
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
      </div>
    </div>

    
  );
}