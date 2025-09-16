import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, MapPin, Users, Clock, CreditCard, Download, Eye } from 'lucide-react';

interface MyReservationsPageProps {
  onNavigate: (page: string) => void;
}

interface Reservation {
  id: string;
  type: 'room' | 'service';
  name: string;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  image: string;
  additionalServices?: string[];
}

export function MyReservationsPage({ onNavigate }: MyReservationsPageProps) {
  const [reservations] = useState<Reservation[]>([
    {
      id: 'RES001',
      type: 'room',
      name: 'Suíte Master com Vista Mar',
      dates: {
        checkIn: '2025-12-20',
        checkOut: '2025-12-25'
      },
      guests: 2,
      price: 2800,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
      additionalServices: ['Spa & Wellness', 'Restaurante Gourmet', 'Concierge 24h']
    },
    {
      id: 'RES002',
      type: 'room',
      name: 'Quarto Deluxe',
      dates: {
        checkIn: '2025-10-15',
        checkOut: '2025-10-18'
      },
      guests: 1,
      price: 1050,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      additionalServices: ['Academia Premium']
    },
    {
      id: 'RES003',
      type: 'room',
      name: 'Quarto Standard',
      dates: {
        checkIn: '2024-08-10',
        checkOut: '2024-08-12'
      },
      guests: 2,
      price: 600,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      confirmed: 'Confirmada',
      pending: 'Pendente',
      cancelled: 'Cancelada',
      completed: 'Concluída'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const calculateDays = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  const activeReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending');
  const pastReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <Card className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3 aspect-video lg:aspect-square">
          <img
            src={reservation.image}
            alt={reservation.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{reservation.name}</h3>
              <Badge className={getStatusColor(reservation.status)}>
                {getStatusText(reservation.status)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Código da Reserva</p>
              <p className="font-mono text-sm">{reservation.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p>Check-in: {formatDate(reservation.dates.checkIn)}</p>
                <p>Check-out: {formatDate(reservation.dates.checkOut)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{reservation.guests} {reservation.guests === 1 ? 'hóspede' : 'hóspedes'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{calculateDays(reservation.dates.checkIn, reservation.dates.checkOut)} {calculateDays(reservation.dates.checkIn, reservation.dates.checkOut) === 1 ? 'diária' : 'diárias'}</span>
            </div>
          </div>

          {reservation.additionalServices && reservation.additionalServices.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Serviços adicionais:</p>
              <div className="flex flex-wrap gap-2">
                {reservation.additionalServices.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">R$ {reservation.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total pago</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Detalhes
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Recibo
              </Button>
              {reservation.status === 'confirmed' && (
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl mb-2">Minhas Reservas</h1>
          <p className="text-gray-600">Acompanhe suas reservas e histórico de hospedagens</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{activeReservations.length}</div>
              <p className="text-sm text-gray-600">Reservas Ativas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{pastReservations.length}</div>
              <p className="text-sm text-gray-600">Reservas Passadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reservations.reduce((acc, r) => acc + calculateDays(r.dates.checkIn, r.dates.checkOut), 0)}
              </div>
              <p className="text-sm text-gray-600">Total de Diárias</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                R$ {reservations.reduce((acc, r) => acc + r.price, 0).toFixed(0)}
              </div>
              <p className="text-sm text-gray-600">Total Gasto</p>
            </CardContent>
          </Card>
        </div>

        {/* Reservas */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Reservas Ativas ({activeReservations.length})</TabsTrigger>
            <TabsTrigger value="past">Histórico ({pastReservations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeReservations.length > 0 ? (
              activeReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhuma reserva ativa</h3>
                  <p className="text-gray-600 mb-4">
                    Você não possui reservas confirmadas ou pendentes no momento.
                  </p>
                  <Button onClick={() => onNavigate('rooms')}>
                    Fazer Nova Reserva
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastReservations.length > 0 ? (
              pastReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Clock className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhuma reserva no histórico</h3>
                  <p className="text-gray-600">
                    Suas reservas passadas aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}