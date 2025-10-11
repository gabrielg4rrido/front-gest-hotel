import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Breadcrumb } from "../components/Breadcrumb";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface ServiceDetailsPageProps {
  serviceId: number;
  onNavigate: (page: string) => void;
}

interface Service {
  id: number;
  titulo: string;
  descricao: string;
  detalhes: string;
  preco: number;
  localidade: string;
  contato: string;
  imagem: string;
  caracteristicas: string[];
  inclusos: string[];
}

export function ServiceDetailsPage({ serviceId, onNavigate }: ServiceDetailsPageProps) {
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/services/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Detalhes do serviço:", data);
        setService(data);
      })
      .catch((err) => console.error("Erro ao buscar detalhes:", err));
  }, [serviceId]);

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Carregando detalhes do serviço...</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Serviços", href: "#", onClick: () => onNavigate("services") },
    { label: service.titulo, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Imagem principal */}
          <div className="w-full md:w-1/2">
            <ImageWithFallback
              src={service.imagem}
              alt={service.titulo}
              className="w-full h-80 object-cover rounded-lg shadow-sm"
            />
          </div>

          {/* Informações principais */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-2">{service.titulo}</h1>
            <p className="text-gray-600 mb-4">{service.descricao}</p>
            <p className="text-gray-700 mb-2">
              <strong>Detalhes:</strong> {service.detalhes}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Localidade:</strong> {service.localidade}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Contato:</strong> {service.contato}
            </p>
            {Number(service.preco) > 0 && (
              <p className="text-gray-800 text-lg font-semibold mt-3">
                💰 R$ {(Number(service.preco) || 0).toFixed(2)}
              </p>
            )}


            <Button
              className="mt-6"
              variant="outline"
              onClick={() => onNavigate("services")}
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Características e Inclusos */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Características */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              {service.caracteristicas && service.caracteristicas.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {service.caracteristicas.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma característica cadastrada.</p>
              )}
            </CardContent>
          </Card>

          {/* Itens inclusos */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Itens Inclusos</CardTitle>
            </CardHeader>
            <CardContent>
              {service.inclusos && service.inclusos.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {service.inclusos.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum item incluso cadastrado.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
