import React, { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { apiService, Reserva } from "../../services/api";
import { Alert, AlertDescription } from "../../components/ui/alert";

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
  review?: string;
  photos?: string[];
}

export function MyTravelsPage({ onNavigate }: MyTravelsPageProps) {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const reservas = await apiService.getReservas();
      const mappedTravels = reservas.map(mapReservaToTravel);
      setTravels(mappedTravels);
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  const mapReservaToTravel = (reserva: Reserva): Travel => {
    // Mapear status da API para status do componente
    const statusMap: Record<string, Travel["status"]> = {
      "Pendente": "pending",
      "Confirmada": "confirmed",
      "Confirmado": "confirmed",
      "Cancelada": "cancelled",
      "Cancelado": "cancelled",
      "Concluída": "completed",
      "Concluído": "completed",
      "Finalizada": "completed",
      "Finalizado": "completed",
    };

    const status = statusMap[reserva.status] || "pending";

    // Verificar se a reserva é passada (data de saída anterior à data atual)
    const isCompleted = new Date(reserva.dataSaida) < new Date() && status === "confirmed";

    // 🔹 CORRIGIDO: Exibir apenas nome e tipo do quarto, sem código UUID
    let quartoNome = "Quarto";
    if (reserva.quarto?.nome) {
      // Remove códigos UUID (padrão: letras+números-UUID)
      // Exemplo: "Quarto qqs215-005056a4845d Standard" -> "Quarto Standard"
      quartoNome = reserva.quarto.nome
        .replace(/\s+[a-z0-9]+-[a-f0-9-]+/gi, '') // Remove padrão "codigo-uuid"
        .replace(/\s{2,}/g, ' ') // Remove espaços duplos
        .trim();
    }
    
    const quartoTipo = reserva.quarto?.tipo || 'Standard';
    const quartoImagem = reserva.quarto?.imagens?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600";
    const quartoComodidades = reserva.quarto?.comodidades || [];

    // Formatar nome final: se já incluir o tipo, não repetir
    const nomeCompleto = quartoNome.toLowerCase().includes(quartoTipo.toLowerCase())
      ? quartoNome
      : `${quartoNome} ${quartoTipo}`;

    return {
      id: reserva.idReserva,
      type: "room",
      name: nomeCompleto,
      location: "Hotel Carioca Palace",
      dates: {
        checkIn: reserva.dataEntrada,
        checkOut: reserva.dataSaida,
      },
      guests: reserva.quantidadeHospedes,
      price: parseFloat(reserva.precoTotal),
      status: isCompleted ? "completed" : status,
      image: quartoImagem,
      additionalServices: quartoComodidades.slice(0, 3), // Mostrar até 3 comodidades
    };
  };

  const handleCancelReserva = async (idReserva: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    try {
      await apiService.cancelReserva(idReserva);
      // Recarregar reservas
      await loadReservas();
      alert("Reserva cancelada com sucesso!");
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
      alert(err instanceof Error ? err.message : "Erro ao cancelar reserva");
    }
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

  const TravelCard: React.FC<{ travel: Travel }> = ({ travel }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl">{travel.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin className="h-3 w-3" />
              <span>{travel.location}</span>
            </div>
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
                onClick={() => handleCancelReserva(travel.id)}
              >
                Cancelar
              </Button>
            )}
            {travel.status === "completed" && (
              <Button size="sm" onClick={() => onNavigate("rooms")}>
                <Plane className="h-4 w-4 mr-2" />
                Reservar Novamente
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando suas viagens...</p>
        </div>
      </div>
    );
  }

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

        {/* Erro */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                    Suas viagens passadas aparecerão aqui.
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
