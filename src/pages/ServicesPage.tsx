import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Breadcrumb } from "../components/Breadcrumb";

interface Service {
  id: number;
  titulo: string;
  descricao: string;
  detalhes: string;
  preco: number;
  localidade: string;
  contato: string;
  imagem: string;
}

interface AdditionalService {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  incluso: number;
  icone: string | null;
}

interface ServicesPageProps {
  onNavigate: (page: string, serviceId?: number) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Mapeamento fixo de ícones (usado como fallback)
  const iconMap: Record<string, string> = {
    "Restaurante Gourmet": "🍽️",
    "Spa & Wellness": "💆",
    "Academia Premium": "💪",
    "Concierge 24h": "🎩",
    "Transfer Aeroporto": "✈️",
    "Lavanderia Express": "👔",
    "Baby Sitting": "👶",
    "Pet Friendly": "🐕",
    "Room Service 24h": "🛎️",
    "Aluguel de Carros": "🚗",
    "Tour Guiado": "🗺️",
    "Wi-Fi Premium": "📶",
  };

  // 🔹 Tradução de códigos de ícone do banco (":baby:", ":dog:", etc.)
  const emojiMap: Record<string, string> = {
    ":baby:": "👶",
    ":dog:": "🐕",
    ":bell:": "🛎️",
    ":car:": "🚗",
    ":map:": "🗺️",
    ":wifi:": "📶",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, additionalRes] = await Promise.all([
          fetch("http://localhost:3001/api/services"),
          fetch("http://localhost:3001/api/additional-services"),
        ]);

        if (!servicesRes.ok || !additionalRes.ok) {
          throw new Error("Falha ao buscar dados do backend");
        }

        const [servicesData, additionalData] = await Promise.all([
          servicesRes.json(),
          additionalRes.json(),
        ]);

        setServices(servicesData);
        setAdditionalServices(additionalData);
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
        setError("⚠️ O servidor não está disponível. Inicie o backend para visualizar os serviços.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const breadcrumbItems = [{ label: "Serviços", href: "#" }];

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Carregando serviços...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Nossos Serviços</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desfrute de uma ampla gama de serviços premium pensados para proporcionar a você
            uma experiência completa e inesquecível.
          </p>
        </div>

        {/* Lista de Serviços */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="relative h-48 w-full">
                <ImageWithFallback
                  src={
                    service.imagem && service.imagem.startsWith("data:image")
                      ? service.imagem
                      : `data:image/jpeg;base64,${service.imagem || ""}`
                  }
                  alt={service.titulo}
                  className="w-full h-full object-cover"
                />

              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{service.titulo}</CardTitle>
                <CardDescription className="text-sm">{service.descricao}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow pt-0">
                <p className="text-sm text-gray-600 mb-6">{service.detalhes}</p>
                <Button
                  variant="outline"
                  className="w-full mt-auto"
                  onClick={() => onNavigate("service-details", service.id)}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔹 Serviços Adicionais */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6 text-center">Serviços Adicionais</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((item) => (
              <div
                key={item.id}
                className="text-center p-4 rounded-lg border hover:border-primary transition-colors"
              >
                {/* Ícone híbrido: banco → fallback local */}
                <div className="text-3xl mb-2">
                  {emojiMap[item.icone ?? ""] || iconMap[item.titulo] || "⭐"}
                </div>
                <p className="text-sm font-medium">{item.titulo}</p>
                <p className="text-xs text-gray-500">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-16 p-8 bg-primary text-white rounded-lg">
          <h3 className="text-2xl mb-4">Precisa de algo especial?</h3>
          <p className="mb-6 opacity-90">
            Nossa equipe está sempre pronta para atender suas necessidades específicas.
          </p>
          <Button className="bg-white text-primary hover:bg-gray-100">Entre em Contato</Button>
        </div>
      </div>
    </div>
  );
}
