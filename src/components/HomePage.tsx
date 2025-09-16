import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SearchForm } from "./SearchForm";

interface HomePageProps {
  onNavigate: (page: string, roomId?: number) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      title: "Quartos Luxuosos",
      description:
        "Acomodações confortáveis com vista para o mar",
      icon: "🏨",
    },
    {
      title: "Serviços Premium",
      description: "Spa, piscina, restaurante e muito mais",
      icon: "⭐",
    },
    {
      title: "Localização Privilegiada",
      description: "Próximo às principais atrações da cidade",
      icon: "📍",
    },
  ];

  const handleSearch = (searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    // Store search data in sessionStorage for use in rooms page
    sessionStorage.setItem('hotelSearch', JSON.stringify(searchData));
    onNavigate('rooms');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl mb-6">
            Bem-vindo ao Hotel Carioca Palace
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experimente o luxo e conforto em uma localização
            paradisíaca. Sua estadia dos sonhos começa aqui.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="container mx-auto">
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Por que escolher o Hotel Paradise?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma experiência única com serviços de
              primeira classe e instalações modernas para tornar
              sua estadia inesquecível.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">
            Pronto para sua próxima aventura?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Reserve agora e ganhe 15% de desconto na sua
            primeira estadia
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => onNavigate("rooms")}
          >
            Fazer Reserva
          </Button>
        </div>
      </section>
    </div>
  );
}