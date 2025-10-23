import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Phone, MessageCircle } from "lucide-react";

// Tipagem das props que o componente vai receber
interface ReservationCardProps {
  room: {
    name?: string;
    price?: number;
    capacity?: number;
    area?: string;
  };
  onReserve: () => void;
}

export function ReservationCard({ room, onReserve }: ReservationCardProps) {
  return (
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
              onClick={onReserve}
              className="w-full"
              size="lg"
              disabled={!room.price}
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
  );
}
