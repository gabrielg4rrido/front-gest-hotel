import React from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SearchForm } from "../components/SearchForm";

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

       <section className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* First Description Block */}
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-6 ">
              <p className="text-muted-foreground leading-relaxed text-justify">
                Seja você um mochileiro aventureiro, um viajante em busca de cultura ou alguém que procura a praia perfeita para relaxar, o Carioca Palace é o lugar ideal para começar sua jornada no Rio de Janeiro. Localizado no coração da cidade, nosso hostel oferece o melhor do Rio em termos de localização, estando a apenas minutos das praias mais famosas e das atrações turísticas imperdíveis.
              </p>
              <p className="text-muted-foreground leading-relaxed text-justify">
                Com um ambiente acolhedor e descontraído, ideal para quem deseja conhecer novas pessoas, fazer amizades e explorar a cidade, nossa estrutura foi pensada para oferecer o melhor para todos os tipos de viajantes: de quartos privativos a opções compartilhadas, todos com a segurança e praticidade que você precisa.
              </p>
            </div>
            <div className="aspect-video lg:aspect-square rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1673568669459-1ad35f98baa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaW8lMjBkZSUyMGphbmVpcm8lMjBpcGFuZW1hJTIwYmVhY2h8ZW58MXx8fHwxNzU4NzUzNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Vista de Ipanema no Rio de Janeiro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Second Description Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="aspect-video lg:aspect-square rounded-lg overflow-hidden lg:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1660948330781-504fee2793b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaW8lMjBkZSUyMGphbmVpcm8lMjBzdWdhcmxvYWYlMjBwYW8lMjBhY3VjYXJ8ZW58MXx8fHwxNzU4NzUzNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Pão de Açúcar no Rio de Janeiro"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:order-2">
              <p className="text-muted-foreground leading-relaxed text-justify">
                Aqui, você pode se perder nas trilhas do Pão de Açúcar, se divertir no agito da Lapa, relaxar nas águas da Ipanema, ou simplesmente aproveitar as noites animadas com outros viajantes na nossa área social.
              </p>
              <p className="text-muted-foreground leading-relaxed text-justify">
                No Carioca Palace, sua experiência vai além de uma simples estadia: aqui você encontra um ponto de partida para uma aventura inesquecível, com o Rio de Janeiro ao seu alcance. Descubra a cidade, a diversão, novas amizades e a verdadeira essência da cidade... venha viver o Rio como um local, não como um turista!
              </p>
            </div>
          </div>
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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Quartos Sofisticados */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-300 flex items-center justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1693852657003-bdcf9f784be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBwb29sJTIwd2VsbG5lc3MlMjBzZXJ2aWNlc3xlbnwxfHx8fDE3NTg3NTM3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Quartos sofisticados do Carioca Palace"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl text-orange-500">Quartos Sofisticados</h3>
              <p className="text-muted-foreground">
                Acomodações confortáveis para o seu bem-estar
              </p>
              <Button 
                variant="outline"
                onClick={() => onNavigate?.('rooms')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Saiba mais
              </Button>
            </CardContent>
          </Card>

          {/* Serviços especiais */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-300 flex items-center justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1693852657003-bdcf9f784be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBwb29sJTIwd2VsbG5lc3MlMjBzZXJ2aWNlc3xlbnwxfHx8fDE3NTg3NTM3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Serviços especiais do Carioca Palace"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl text-orange-500">Serviços especiais</h3>
              <p className="text-muted-foreground">
                Spa, piscina, restaurante e muito mais
              </p>
              <Button 
                variant="outline"
                onClick={() => onNavigate?.('services')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Saiba mais
              </Button>
            </CardContent>
          </Card>
        </div>

          {/* <div className="grid md:grid-cols-3 gap-8">
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
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-primary text-white">
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
      </section> */}
    </div>
  );
}