import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ImageGallery } from './ImageGallery';
import { Breadcrumb } from './Breadcrumb';
import { 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Phone, 
  Calendar,
  CheckCircle,
  Utensils,
  Flower,
  Waves,
  Dumbbell,
  Briefcase,
  User
} from 'lucide-react';

interface ServiceDetailsPageProps {
  serviceId: number;
  onNavigate: (page: string, serviceId?: number) => void;
}

export function ServiceDetailsPage({ serviceId, onNavigate }: ServiceDetailsPageProps) {
  const services = [
    {
      id: 1,
      title: 'Restaurante Gourmet',
      description: 'Experimente nossa culinária internacional com chefs renomados',
      longDescription: 'Nosso restaurante gourmet oferece uma experiência gastronômica única, combinando técnicas culinárias internacionais com ingredientes locais frescos. Com vista panorâmica para o oceano, é o local perfeito para jantares românticos ou reuniões de negócios.',
      details: 'Aberto das 6h às 23h',
      icon: <Utensils className="w-6 h-6" />,
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'
      ],
      features: ['Culinária Internacional', 'Vista para o Oceano', 'Menu Degustação', 'Carta de Vinhos Premium'],
      schedule: '6h às 23h (todos os dias)',
      capacity: 'Até 120 pessoas',
      priceRange: 'R$ 80 - R$ 250 por pessoa',
      rating: 4.9,
      reviews: 324,
      location: 'Térreo do Hotel',
      contact: '+55 (11) 9999-9999',
      services: [
        'Menu à la carte',
        'Menu degustação',
        'Eventos privados',
        'Room service',
        'Brunch aos finais de semana'
      ]
    },
    {
      id: 2,
      title: 'Spa & Wellness',
      description: 'Relaxe e rejuvenesça em nosso spa completo',
      longDescription: 'Nosso spa oferece uma experiência completa de relaxamento e bem-estar, com tratamentos inspirados em técnicas orientais e ocidentais. Ambiente tranquilo e terapeutas especializados garantem momentos únicos de renovação.',
      details: 'Massagens, tratamentos faciais e corporais',
      icon: <Flower className="w-6 h-6" />,
      images: [
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800'
      ],
      features: ['Massagens Relaxantes', 'Tratamentos Faciais', 'Sauna e Vapor', 'Piscina Terapêutica'],
      schedule: '8h às 22h (todos os dias)',
      capacity: 'Atendimento individual e em casal',
      priceRange: 'R$ 120 - R$ 350 por sessão',
      rating: 4.8,
      reviews: 189,
      location: '3º Andar do Hotel',
      contact: '+55 (11) 8888-8888',
      services: [
        'Massagem relaxante',
        'Massagem terapêutica',
        'Tratamentos faciais',
        'Rituais corporais',
        'Pacotes de bem-estar'
      ]
    },
    {
      id: 3,
      title: 'Piscina Infinity',
      description: 'Piscina com vista panorâmica para o oceano',
      longDescription: 'Nossa piscina infinity oferece uma experiência única com vista espetacular para o oceano. Com design moderno e bar aquático, é o local perfeito para relaxar durante o dia ou curtir o pôr do sol.',
      details: 'Aberta 24h com bar aquático',
      icon: <Waves className="w-6 h-6" />,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'https://images.unsplash.com/photo-1537229909483-4af1b293b1e4?w=800'
      ],
      features: ['Vista Panorâmica', 'Bar Aquático', 'Área VIP', 'Música Ambiente'],
      schedule: '24 horas (todos os dias)',
      capacity: 'Até 80 pessoas',
      priceRange: 'Incluso na diária',
      rating: 4.9,
      reviews: 412,
      location: 'Cobertura do Hotel',
      contact: '+55 (11) 7777-7777',
      services: [
        'Acesso livre à piscina',
        'Serviço de toalhas',
        'Bar e petiscos',
        'Área de descanso',
        'Eventos exclusivos'
      ]
    },
    {
      id: 4,
      title: 'Academia Premium',
      description: 'Equipamentos modernos e personal trainers',
      longDescription: 'Nossa academia premium conta com equipamentos de última geração e personal trainers qualificados. Ambiente climatizado e aulas especializadas para todos os níveis de condicionamento físico.',
      details: 'Aberta 24h para hóspedes',
      icon: <Dumbbell className="w-6 h-6" />,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
        'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
      ],
      features: ['Equipamentos Modernos', 'Personal Trainer', 'Aulas Coletivas', 'Vestiários Premium'],
      schedule: '24 horas para hóspedes',
      capacity: 'Até 30 pessoas simultâneas',
      priceRange: 'Incluso na diária',
      rating: 4.7,
      reviews: 156,
      location: '2º Andar do Hotel',
      contact: '+55 (11) 6666-6666',
      services: [
        'Acesso livre aos equipamentos',
        'Personal trainer (agendamento)',
        'Aulas de yoga e pilates',
        'Consultoria nutricional',
        'Programas personalizados'
      ]
    },
    {
      id: 5,
      title: 'Business Center',
      description: 'Salas de reunião e serviços executivos',
      longDescription: 'Nosso business center oferece infraestrutura completa para reuniões de negócios, com salas equipadas, serviços de secretariado e apoio técnico especializado.',
      details: 'Wi-Fi, impressora, scanner disponíveis',
      icon: <Briefcase className="w-6 h-6" />,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800',
        'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800'
      ],
      features: ['Salas de Reunião', 'Equipamentos A/V', 'Serviços de Secretariado', 'Coffee Break'],
      schedule: '6h às 22h (seg-sex), 8h às 18h (sáb-dom)',
      capacity: 'Salas para 6 a 50 pessoas',
      priceRange: 'R$ 150 - R$ 800 por período',
      rating: 4.6,
      reviews: 89,
      location: '1º Andar do Hotel',
      contact: '+55 (11) 5555-5555',
      services: [
        'Aluguel de salas',
        'Equipamentos audiovisuais',
        'Serviços de impressão',
        'Coffee break personalizado',
        'Apoio técnico'
      ]
    },
    {
      id: 6,
      title: 'Concierge 24h',
      description: 'Atendimento personalizado a qualquer hora',
      longDescription: 'Nosso serviço de concierge está disponível 24 horas para auxiliar em todas as suas necessidades, desde reservas em restaurantes até organização de passeios exclusivos.',
      details: 'Reservas, ingressos, transfer e mais',
      icon: <User className="w-6 h-6" />,
      images: [
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
      ],
      features: ['Atendimento 24h', 'Reservas Exclusivas', 'Tours Personalizados', 'Serviços Premium'],
      schedule: '24 horas (todos os dias)',
      capacity: 'Atendimento personalizado',
      priceRange: 'Incluso na diária',
      rating: 4.9,
      reviews: 267,
      location: 'Recepção Principal',
      contact: '+55 (11) 4444-4444',
      services: [
        'Reservas em restaurantes',
        'Compra de ingressos',
        'Organização de transfers',
        'Tours personalizados',
        'Serviços especiais'
      ]
    }
  ];

  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Serviço não encontrado</h2>
          <Button onClick={() => onNavigate('services')}>
            Voltar aos Serviços
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Início', href: '#', onClick: () => onNavigate('home') },
    { label: 'Serviços', href: '#', onClick: () => onNavigate('services') },
    { label: service.title, href: '#' }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Service Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={service.images} alt={service.title} />
            </div>

            {/* Service Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                  {service.icon}
                </div>
                <div>
                  <h1>{service.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({service.reviews} avaliações)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{service.longDescription}</p>

              {/* Service Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{service.schedule}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{service.capacity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{service.contact}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-2xl mb-2">{service.priceRange}</p>
                <p className="text-sm text-gray-500">Valores podem variar conforme o serviço escolhido</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Entrar em Contato
                </Button>
                <Button variant="outline">
                  Mais Informações
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="mb-6">Características do Serviço</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Included */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="mb-6">Serviços Inclusos</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {service.services.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3>Avaliações dos Clientes</h3>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{service.rating} de 5</span>
              <span className="text-gray-500">({service.reviews} avaliações)</span>
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-6">
            {[
              {
                name: 'Maria Silva',
                rating: 5,
                comment: 'Serviço excepcional! A equipe é muito atenciosa e profissional.',
                date: '15 de agosto, 2024'
              },
              {
                name: 'João Santos',
                rating: 5,
                comment: 'Experiência incrível! Superou todas as expectativas.',
                date: '10 de agosto, 2024'
              },
              {
                name: 'Ana Costa',
                rating: 4,
                comment: 'Muito bom, recomendo! Ambiente excelente.',
                date: '5 de agosto, 2024'
              }
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm">{review.name}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}