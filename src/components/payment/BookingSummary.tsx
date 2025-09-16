import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Calendar, Users, MapPin } from 'lucide-react';

interface BookingData {
  type: 'room' | 'service';
  name: string;
  price: number;
  dates?: {
    checkIn: string;
    checkOut: string;
  };
  guests?: number;
  duration?: number;
}

interface BookingSummaryProps {
  booking: BookingData;
  guestCount: number;
  days: number;
  roomSubtotal: number;
  servicesSubtotal: number;
  taxes: number;
  total: number;
}

export function BookingSummary({
  booking,
  guestCount,
  days,
  roomSubtotal,
  servicesSubtotal,
  taxes,
  total
}: BookingSummaryProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Resumo da Reserva
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">{booking.name}</h3>
          <p className="text-sm text-gray-600">{booking.type === 'room' ? 'Acomodação' : 'Serviço'}</p>
        </div>

        {booking.dates && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Check-in: {formatDate(booking.dates.checkIn)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Check-out: {formatDate(booking.dates.checkOut)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>{guestCount} {guestCount === 1 ? 'hóspede' : 'hóspedes'}</span>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Acomodação ({days} {days === 1 ? 'diária' : 'diárias'})</span>
            <span>R$ {roomSubtotal.toFixed(2)}</span>
          </div>
          {servicesSubtotal > 0 && (
            <div className="flex justify-between">
              <span>Serviços adicionais</span>
              <span>R$ {servicesSubtotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Impostos e taxas</span>
            <span>R$ {taxes.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}