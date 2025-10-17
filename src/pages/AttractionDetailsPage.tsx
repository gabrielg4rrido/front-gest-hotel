import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Breadcrumb } from "../components/Breadcrumb";
import { Star, Clock, MapPin, Car, Phone } from "lucide-react";

interface AttractionDetailsPageProps {
  attractionId: number;
  onNavigate: (page: string) => void;
}

export function AttractionDetailsPage({
  attractionId,
  onNavigate,
}: AttractionDetailsPageProps) {
  const attractions = [
    {
      id: 1,
      name: "Praia Paradisíaca",
      description:
        "Águas cristalinas e areia branca a apenas 5 minutos do hotel",
      distance: "500m",
      category: "Praia",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      longDescription:
        "Uma das praias mais belas da região, conhecida por suas águas cristalinas de cor azul turquesa e areia fininha e branca. O local oferece uma estrutura completa com guarda-sóis, cadeiras e bar na praia. É perfeita para relaxar, nadar e praticar esportes aquáticos.",
      openingHours: "24 horas",
      bestTime: "Manhã (6h-10h) e final da tarde (16h-18h)",
      activities: ["Natação", "Mergulho", "Stand-up Paddle", "Vôlei de Praia"],
      facilities: ["Chuveiros", "Banheiros", "Bar", "Aluguel de equipamentos"],
      howToGet:
        "A pé pela trilha do hotel (5 min) ou de carro pela estrada principal (3 min)",
      tips: [
        "Leve protetor solar e chapéu",
        "Use óculos de sol",
        "Hidrate-se constantemente",
        "Respeite a vida marinha",
      ],
    },
    {
      id: 2,
      name: "Centro Histórico",
      description: "Arquitetura colonial preservada e museus interessantes",
      distance: "2km",
      category: "Cultura",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
      longDescription:
        "O centro histórico da cidade preserva a arquitetura colonial dos séculos XVIII e XIX. Com ruas de pedra, casarios coloridos e igrejas históricas, é um verdadeiro museu a céu aberto. Abriga diversos museus, galerias de arte e lojas de artesanato local.",
      openingHours: "8h às 18h (segunda a domingo)",
      bestTime: "Manhã (9h-12h) para evitar o calor",
      activities: [
        "Tour guiado",
        "Visita a museus",
        "Compras de artesanato",
        "Fotografia",
      ],
      facilities: [
        "Guias turísticos",
        "Lojas",
        "Restaurantes",
        "Banheiros públicos",
      ],
      howToGet: "Transfer do hotel (15 min) ou ônibus local linha 101",
      tips: [
        "Use calçados confortáveis",
        "Leve máquina fotográfica",
        "Contrate um guia local",
        "Experimente a culinária regional",
      ],
    },
  ];

  const attraction =
    attractions.find((a) => a.id === attractionId) || attractions[0];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Praia: "bg-blue-100 text-blue-800",
      Cultura: "bg-purple-100 text-purple-800",
      Aventura: "bg-green-100 text-green-800",
      Gastronomia: "bg-orange-100 text-orange-800",
      Marítimo: "bg-cyan-100 text-cyan-800",
      Natureza: "bg-emerald-100 text-emerald-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const breadcrumbItems = [
    { label: "Atrações", onClick: () => onNavigate("attractions") },
    { label: attraction.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} />

        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative aspect-[2/1] mb-6 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={attraction.image}
              alt={attraction.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6">
              <Badge className={getCategoryColor(attraction.category)}>
                {attraction.category}
              </Badge>
            </div>
            <div className="absolute top-6 right-6">
              <Badge className="bg-white text-gray-800">
                ⭐ {attraction.rating}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl mb-2">{attraction.name}</h1>
              <p className="text-gray-600 text-lg mb-4">
                {attraction.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{attraction.distance} do hotel</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{attraction.openingHours}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Contato
              </Button>
              <Button>
                <Car className="w-4 h-4 mr-2" />
                Como Chegar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Atração</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {attraction.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {attraction.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Estrutura e Facilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {attraction.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visit Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Visita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Melhor Horário
                  </h4>
                  <p className="text-sm text-gray-600">{attraction.bestTime}</p>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Como Chegar
                  </h4>
                  <p className="text-sm text-gray-600">{attraction.howToGet}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {attraction.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Nossa equipe de concierge pode organizar sua visita e
                  providenciar transporte.
                </p>
                <Button className="w-full">Falar com Concierge</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
