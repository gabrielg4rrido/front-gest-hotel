import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import env from "../../config/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ImageGallery } from "../../components/ImageGallery";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  ArrowLeft,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Waves,
  Dumbbell,
  Flower,
  Users,
  Bed,
  Bath,
  Square,
  Star,
  Phone,
  MessageCircle,
  Loader2,
} from "lucide-react";

// --- INTERFACES E TIPOS ---

// Interface para os dados que vêm da sua API (banco de dados)
interface ApiRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  // Adicione aqui outros campos que a API pode retornar
}

// Interface para as props do componente, com roomId como string (UUID)
interface RoomDetailsPageProps {
  roomId: string;
  onNavigate: (page: string, roomId?: string) => void;
  onOpenPayment: (type: "room" | "service", data: any) => void;
}

// --- COMPONENTE PRINCIPAL ---

export function RoomDetailsPage({
  roomId,
  onNavigate,
  onOpenPayment,
}: RoomDetailsPageProps) {
  // Estados para gerenciar os dados, o carregamento e possíveis erros
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("ID do quarto recebido:", roomId);

  // Hook para buscar os dados da API quando o componente é montado ou o roomId muda
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Busca apenas os dados da API
        const response = await fetch(
          `${env.API_QUARTO_URL}/api/quarto/${roomId}`
        );
        if (!response.ok) {
          throw new Error(
            "Quarto não encontrado ou falha na comunicação com o servidor."
          );
        }
        const apiRoomData: ApiRoom = await response.json();

        // Usa apenas os dados da API, sem merge com dados mockados
        setRoom(apiRoomData);
      } catch (err) {
        setError(
          "⚠️ O servidor não está disponível. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Carregando detalhes do quarto...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">{error || "Quarto não encontrado"}</h1>
          <Button onClick={() => onNavigate("rooms")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a lista de quartos
          </Button>
        </div>
      </div>
    );
  }

  const handleReservation = () => {
    onOpenPayment("room", {
      name: room.name,
      price: room.price,
      guests: room.capacity,
      capacity: room.capacity,
      roomId: roomId,
    });
  };

  // --- RENDERIZAÇÃO PRINCIPAL ---

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Quartos", page: "rooms" },
            {
              label: room.name || "Quarto",
              page: "room-details",
              roomId: roomId,
            },
          ]}
          onNavigate={onNavigate}
        />

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">
                  {room.name || "Nome do quarto não disponível"}
                </CardTitle>
              </div>
              <div className="text-right">
                {room.price ? (
                  <>
                    <div className="text-3xl text-primary">R$ {room.price}</div>
                    <div className="text-sm text-gray-600">por noite</div>
                  </>
                ) : (
                  <div className="text-lg text-gray-500">
                    Preço não disponível
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Imagem do quarto - exibe abaixo do nome */}
            {room.image && (
              <div className="mb-6">
                <div className="relative overflow-hidden bg-gray-200 rounded-lg h-[180px] md:h-[220px]">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Descrição - só mostra se houver */}
            {room.description && (
              <p className="text-gray-700 mb-6">{room.description}</p>
            )}

            {/* Informações do quarto - só mostra campos que existem */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {room.area && (
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-gray-600" />
                  <span>{room.area}</span>
                </div>
              )}
              {room.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Até {room.capacity} pessoas</span>
                </div>
              )}
              {room.beds && (
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <span>{room.beds}</span>
                </div>
              )}
              {room.bathroom && (
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <span>{room.bathroom}</span>
                </div>
              )}
            </div>

            {/* Comodidades - só mostra se houver */}
            {room.features && room.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl mb-3">Comodidades Incluídas</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {room.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Reserva */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reservar Quarto</CardTitle>
            <CardDescription>
              {room.name && room.price
                ? `${room.name} - A partir de R$ ${room.price} por noite`
                : "Informações de reserva"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coluna 1: Informações de Reserva */}
              <div className="space-y-4">
                {/* Informações de Capacidade */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  {room.capacity && (
                    <div className="flex justify-between items-center mb-2">
                      <span>Capacidade:</span>
                      <span>Até {room.capacity} pessoas</span>
                    </div>
                  )}
                  {room.area && (
                    <div className="flex justify-between items-center mb-2">
                      <span>Área:</span>
                      <span>{room.area}</span>
                    </div>
                  )}
                  {room.price && (
                    <div className="flex justify-between items-center">
                      <span>Preço por noite:</span>
                      <span className="text-xl text-primary">
                        R$ {room.price}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleReservation}
                  className="w-full"
                  size="lg"
                  disabled={!room.price} // Desabilita se não tiver preço
                >
                  {room.price ? "Reservar Agora" : "Preço não disponível"}
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Ligar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
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
