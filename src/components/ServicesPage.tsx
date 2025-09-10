import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ServicesPageProps {
  onNavigate: (page: string, serviceId?: number) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const services = [
    {
      id: 1,
      title: 'Restaurante Gourmet',
      description: 'Experimente nossa culinária internacional com chefs renomados',
      details: 'Aberto das 6h às 23h',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    },
    {
      id: 2,
      title: 'Spa & Wellness',
      description: 'Relaxe e rejuvenesça em nosso spa completo',
      details: 'Massagens, tratamentos faciais e corporais',
      icon: '💆',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
    },
    {
      id: 3,
      title: 'Piscina Infinity',
      description: 'Piscina com vista panorâmica para o oceano',
      details: 'Aberta 24h com bar aquático',
      icon: '🏊',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'
    },
    {
      id: 4,
      title: 'Academia Premium',
      description: 'Equipamentos modernos e personal trainers',
      details: 'Aberta 24h para hóspedes',
      icon: '💪',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    },
    {
      id: 5,
      title: 'Business Center',
      description: 'Salas de reunião e serviços executivos',
      details: 'Wi-Fi, impressora, scanner disponíveis',
      icon: '💼',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    {
      id: 6,
      title: 'Concierge 24h',
      description: 'Atendimento personalizado a qualquer hora',
      details: 'Reservas, ingressos, transfer e mais',
      icon: '🎩',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Nossos Serviços</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desfrute de uma ampla gama de serviços premium pensados para 
            proporcionar a você uma experiência completa e inesquecível.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{service.details}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('service-details', service.id)}
                >
                  Saiba Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6 text-center">Serviços Adicionais</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Transfer Aeroporto', icon: '✈️' },
              { name: 'Lavanderia Express', icon: '👔' },
              { name: 'Baby Sitting', icon: '👶' },
              { name: 'Pet Friendly', icon: '🐕' },
              { name: 'Room Service 24h', icon: '🛎️' },
              { name: 'Aluguel de Carros', icon: '🚗' },
              { name: 'Tour Guiado', icon: '🗺️' },
              { name: 'Wi-Fi Premium', icon: '📶' }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg border hover:border-primary transition-colors">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
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