import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CreditCard,
  Download,
  Eye,
  Star,
  Plane,
  Camera,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

interface MyTravelsPageProps {
  onNavigate: (page: string) => void;
}

interface Travel {
  id: string;
  type: "room" | "service";
  name: string;
  location: string;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
  price: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  image: string;
  additionalServices?: string[];
  rating?: number;
  review?: string;
  photos?: string[];
}

export function MyTravelsPage({ onNavigate }: MyTravelsPageProps) {
  const [travels] = useState<Travel[]>([
    {
      id: "TRIP001",
      type: "room",
      name: "Suíte Master com Vista Mar",
      location: "Hotel Carioca Palace",
      dates: {
        checkIn: "2025-12-20",
        checkOut: "2025-12-25",
      },
      guests: 2,
      price: 2800,
      status: "confirmed",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
      additionalServices: [
        "Spa & Wellness",
        "Restaurante Gourmet",
        "Concierge 24h",
      ],
    },
    {
      id: "TRIP002",
      type: "room",
      name: "Quarto Deluxe",
      location: "Hotel Carioca Palace",
      dates: {
        checkIn: "2025-10-15",
        checkOut: "2025-10-18",
      },
      guests: 1,
      price: 1050,
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
      additionalServices: ["Academia Premium"],
      rating: 5,
      review:
        "Experiência incrível! O quarto era confortável e o atendimento excepcional.",
      photos: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
      ],
    },
    {
      id: "TRIP003",
      type: "room",
      name: "Quarto Standard",
      location: "Hotel Carioca Palace",
      dates: {
        checkIn: "2024-08-10",
        checkOut: "2024-08-12",
      },
      guests: 2,
      price: 600,
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
      rating: 4,
      review: "Boa estadia, quarto limpo e bem localizado.",
      photos: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300",
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      confirmed: "Confirmada",
      pending: "Pendente",
      cancelled: "Cancelada",
      completed: "Concluída",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const calculateDays = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  const upcomingTravels = travels.filter(
    (t) => t.status === "confirmed" || t.status === "pending"
  );
  const pastTravels = travels.filter(
    (t) => t.status === "completed" || t.status === "cancelled"
  );

  const breadcrumbItems = [{ label: "Minhas Viagens", href: "#" }];

  const TravelCard = ({ travel }: { travel: Travel }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3 aspect-video lg:aspect-square relative">
          <ImageWithFallback
            src={travel.image}
            alt={travel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getStatusColor(travel.status)}>
              {getStatusText(travel.status)}
            </Badge>
          </div>
          {travel.status === "completed" && travel.photos && (
            <div className="absolute bottom-4 right-4">
              <Badge className="bg-white/90 text-gray-800">
                <Camera className="w-3 h-3 mr-1" />
                {travel.photos.length}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl mb-1">{travel.name}</h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                <MapPin className="h-3 w-3" />
                <span>{travel.location}</span>
              </div>
              {travel.status === "completed" && travel.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < travel.rating!
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({travel.rating}/5)
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Código</p>
              <p className="text-xs">{travel.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p>Check-in: {formatDate(travel.dates.checkIn)}</p>
                <p>Check-out: {formatDate(travel.dates.checkOut)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span>
                {travel.guests} {travel.guests === 1 ? "hóspede" : "hóspedes"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {calculateDays(travel.dates.checkIn, travel.dates.checkOut)}{" "}
                {calculateDays(travel.dates.checkIn, travel.dates.checkOut) ===
                1
                  ? "diária"
                  : "diárias"}
              </span>
            </div>
          </div>

          {travel.additionalServices &&
            travel.additionalServices.length > 0 && (
              <div className="mb-4">
                <p className="text-sm mb-2">Serviços inclusos:</p>
                <div className="flex flex-wrap gap-1">
                  {travel.additionalServices.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {travel.status === "completed" && travel.review && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 italic">"{travel.review}"</p>
            </div>
          )}

          {travel.status === "completed" &&
            travel.photos &&
            travel.photos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm mb-2">Fotos da viagem:</p>
                <div className="flex gap-2 overflow-x-auto">
                  {travel.photos.slice(0, 4).map((photo, index) => (
                    <div key={index} className="flex-shrink-0">
                      <ImageWithFallback
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                  {travel.photos.length > 4 && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +{travel.photos.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">R$ {travel.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total</p>
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
              {travel.status === "confirmed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Cancelar
                </Button>
              )}
              {travel.status === "completed" && (
                <Button size="sm">
                  <Plane className="h-4 w-4 mr-2" />
                  Reservar Novamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Minhas Viagens</h1>
          <p className="text-gray-600">
            Acompanhe suas viagens e reviva suas melhores experiências
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-green-600">
                {upcomingTravels.length}
              </div>
              <p className="text-sm text-gray-600">Próximas Viagens</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-blue-600">{pastTravels.length}</div>
              <p className="text-sm text-gray-600">Viagens Realizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-purple-600">
                {travels.reduce(
                  (acc, t) =>
                    acc + calculateDays(t.dates.checkIn, t.dates.checkOut),
                  0
                )}
              </div>
              <p className="text-sm text-gray-600">Dias de Viagem</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-orange-600">
                {pastTravels.length > 0
                  ? (
                      pastTravels.reduce((acc, t) => acc + (t.rating || 0), 0) /
                      pastTravels.filter((t) => t.rating).length
                    ).toFixed(1)
                  : "0"}
              </div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </CardContent>
          </Card>
        </div>

        {/* Viagens */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Próximas Viagens ({upcomingTravels.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Viagens Passadas ({pastTravels.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingTravels.length > 0 ? (
              upcomingTravels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Plane className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg mb-2">Nenhuma viagem agendada</h3>
                  <p className="text-gray-600 mb-4">
                    Que tal planejar sua próxima aventura?
                  </p>
                  <Button onClick={() => onNavigate("rooms")}>
                    Planejar Viagem
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastTravels.length > 0 ? (
              pastTravels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Camera className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg mb-2">Nenhuma viagem no histórico</h3>
                  <p className="text-gray-600">
                    Suas viagens passadas aparecerão aqui com fotos e
                    avaliações.
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
