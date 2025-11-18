import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Star } from "lucide-react";
import env from "../../config/env";

interface Service {
  id: number;
  titulo: string;
  descricao: string;
  detalhes: string;
  preco: number;
  localidade: string;
  contato: string;
  imagem: string | null;
  imagens?: string[];
  caracteristicas?: string[];
  inclusos?: string[];
  avaliacoes?: Review[];
}

interface Review {
  autor: string;
  nota: number;
  comentario: string;
  data: string;
}

interface ServiceDetailsPageProps {
  serviceId: number;
  onNavigate: (page: string) => void;
}

export function ServiceDetailsPage({
  serviceId,
  onNavigate,
}: ServiceDetailsPageProps) {
  const [service, setService] = useState<Service | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(
          `${env.API_SERVICOS_URL}/api/services/${serviceId}`
        );
        const data = await res.json();

        setService(data);
        setImageUrl(data.imagem || null);
        setGallery(data.imagens || []);
      } catch (err) {
        console.error("Erro ao buscar detalhes do serviço:", err);
      }
    }

    fetchService();
  }, [serviceId]);

  const handleImageChange = (newUrl: string) => {
    if (newUrl === imageUrl) return;
    setFade(true);
    setTimeout(() => {
      setImageUrl(newUrl);
      setFade(false);
    }, 250);
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">
          Carregando detalhes do serviço...
        </p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Serviços", href: "#", onClick: () => onNavigate("services") },
    { label: service.titulo, href: "#" },
  ];

  const precoFormatado =
    service.preco && service.preco > 0
      ? `R$ ${Number(service.preco).toFixed(2)}`
      : "R$ 80 - R$ 250 por pessoa";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Seção principal */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 grid md:grid-cols-2 gap-8">
          {/* Coluna da esquerda - imagem e galeria */}
          <div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={service.titulo}
                className={`w-full h-80 object-cover rounded-xl shadow-md border border-gray-200 transition-opacity duration-300 ${
                  fade ? "opacity-0" : "opacity-100"
                }`}
              />
            ) : (
              <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 border border-gray-200">
                Nenhuma imagem disponível
              </div>
            )}

            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className={`w-24 h-20 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                      img === imageUrl ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleImageChange(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Coluna da direita - informações completas */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Cabeçalho do serviço */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🍽️</span>
                <div>
                  <h1 className="text-2xl font-semibold">{service.titulo}</h1>
                  <p className="text-sm text-gray-500">
                    ⭐ 4.7{" "}
                    <span className="text-gray-400">(324 avaliações)</span>
                  </p>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-gray-600 mb-4">{service.descricao}</p>

              {/* Detalhes do serviço com ícones */}
              <ul className="space-y-2 text-gray-700">
                <li>
                  ⏰ <strong>Detalhes:</strong> {service.detalhes}
                </li>
                <li>
                  📍 <strong>Localidade:</strong> {service.localidade}
                </li>
                <li>
                  📞 <strong>Contato:</strong> {service.contato}
                </li>
                <li>
                  💰 <strong>Preço:</strong> {precoFormatado}
                </li>
              </ul>

              {/* Botões de ação */}
              <div className="flex gap-4 mt-6">
                <Button className="bg-primary text-white hover:bg-primary/90 px-6">
                  Entrar em Contato
                </Button>
                <Button variant="outline" className="px-6">
                  Mais Informações
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-32"
                variant="outline"
                onClick={() => onNavigate("services")}
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>

        {/* Características e Inclusos */}
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Características do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {service.caracteristicas && service.caracteristicas.length > 0 ? (
                service.caracteristicas.map((item, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  Nenhuma característica cadastrada.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços Inclusos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {service.inclusos && service.inclusos.length > 0 ? (
                service.inclusos.map((item, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  Nenhum item incluso cadastrado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Avaliações */}
        {service.avaliacoes && service.avaliacoes.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-2xl font-semibold mb-4">
              Avaliações dos Clientes
            </h3>

            <div className="flex items-center mb-6">
              <Star className="text-yellow-400 fill-yellow-400 mr-2" />
              <span className="font-bold text-lg">
                {(
                  service.avaliacoes.reduce((acc, r) => acc + r.nota, 0) /
                  service.avaliacoes.length
                ).toFixed(1)}{" "}
                de 5
              </span>
              <span className="text-gray-500 ml-2">
                ({service.avaliacoes.length} avaliações)
              </span>
            </div>

            <div className="space-y-4">
              {service.avaliacoes.map((r, idx) => (
                <div key={idx} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-gray-200 text-gray-700 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {r.autor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{r.autor}</p>
                      <p className="text-xs text-gray-500">{r.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.nota
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm">{r.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
