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

interface ServicesPageProps {
  onNavigate: (page: string, serviceId?: number) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([]);

  // Ícones relacionados ao título de cada serviço
  const serviceIcons: Record<string, string> = {
    "Restaurante Gourmet": "🍽️",
    "Spa & Wellness": "💆",
    "Piscina Infinity": "🏊",
    "Academia Premium": "💪",
    "Business Center": "💼",
    "Concierge 24h": "🎩",
    "Transfer Aeroporto": "✈️",
    "Lavanderia Express": "👔",
  };

  // Busca os serviços no backend
  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => {
        console.log("Serviços recebidos:", data);
        setServices(data);
      })
      .catch((err) => console.error("Erro ao buscar serviços:", err));
  }, []);

  const breadcrumbItems = [{ label: "Serviços", href: "#" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Nossos Serviços</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desfrute de uma ampla gama de serviços premium pensados para proporcionar a você
            uma experiência completa e inesquecível.
          </p>
        </div>

        {/* GRID DE SERVIÇOS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              <div className="relative h-48 w-full">
                <ImageWithFallback
                  src={service.imagem}
                  alt={service.titulo}
                  className="w-full h-full object-cover"
                />
                {/* Ícone sobreposto */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-sm">
                    {serviceIcons[service.titulo] || "⭐"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="text-xl">{service.titulo}</CardTitle>
                  <CardDescription className="text-sm">{service.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow pt-0">
                  <p className="text-sm text-gray-600 mb-6 flex-grow min-h-[2.5rem]">
                    {service.detalhes}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-auto"
                    onClick={() => onNavigate("service-details", service.id)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* SERVIÇOS ADICIONAIS */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6 text-center">Serviços Adicionais</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Transfer Aeroporto", icon: "✈️" },
              { name: "Lavanderia Express", icon: "👔" },
              { name: "Baby Sitting", icon: "👶" },
              { name: "Pet Friendly", icon: "🐕" },
              { name: "Room Service 24h", icon: "🛎️" },
              { name: "Aluguel de Carros", icon: "🚗" },
              { name: "Tour Guiado", icon: "🗺️" },
              { name: "Wi-Fi Premium", icon: "📶" },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg border hover:border-primary transition-colors"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEÇÃO DE CONTATO */}
        <div className="text-center mt-16 p-8 bg-primary text-white rounded-lg">
          <h3 className="text-2xl mb-4">Precisa de algo especial?</h3>
          <p className="mb-6 opacity-90">
            Nossa equipe está sempre pronta para atender suas necessidades específicas.
          </p>
          <Button className="bg-white text-primary hover:bg-gray-100">
            Entre em Contato
          </Button>
        </div>
      </div>
    </div>
  );
}
