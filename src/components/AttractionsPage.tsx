import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Breadcrumb } from './Breadcrumb';

interface AttractionsPageProps {
  onNavigate: (page: string, attractionId?: number) => void;
}

export function AttractionsPage({ onNavigate }: AttractionsPageProps) {
  const attractions = [
    {
      id: 1,
      name: 'Praia Paradisíaca',
      description: 'Águas cristalinas e areia branca a apenas 5 minutos do hotel',
      distance: '500m',
      category: 'Praia',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'
    },
    {
      id: 2,
      name: 'Centro Histórico',
      description: 'Arquitetura colonial preservada e museus interessantes',
      distance: '2km',
      category: 'Cultura',
      rating: '4.7',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400'
    },
    {
      id: 3,
      name: 'Trilha da Montanha',
      description: 'Vista espetacular da cidade e do mar',
      distance: '8km',
      category: 'Aventura',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'
    },
    {
      id: 4,
      name: 'Mercado Local',
      description: 'Produtos artesanais e culinária típica da região',
      distance: '1.5km',
      category: 'Gastronomia',
      rating: '4.6',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400'
    },
    {
      id: 5,
      name: 'Marina e Porto',
      description: 'Passeios de barco e esportes aquáticos',
      distance: '3km',
      category: 'Marítimo',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'
    },
    {
      id: 6,
      name: 'Parque Nacional',
      description: 'Fauna e flora exuberantes em trilhas ecológicas',
      distance: '15km',
      category: 'Natureza',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    }
  ];

  const activities = [
    { name: 'Mergulho', icon: '🤿', description: 'Explore os recifes de coral' },
    { name: 'Surf', icon: '🏄', description: 'Ondas perfeitas para todos níveis' },
    { name: 'Pesca Esportiva', icon: '🎣', description: 'Experiência em alto mar' },
    { name: 'Ciclismo', icon: '🚴', description: 'Ciclovias e trilhas incríveis' },
    { name: 'Observação de Baleias', icon: '🐋', description: 'De julho a novembro' },
    { name: 'Parapente', icon: '🪂', description: 'Voe sobre paisagens deslumbrantes' }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Praia': 'bg-blue-100 text-blue-800',
      'Cultura': 'bg-purple-100 text-purple-800',
      'Aventura': 'bg-green-100 text-green-800',
      'Gastronomia': 'bg-orange-100 text-orange-800',
      'Marítimo': 'bg-cyan-100 text-cyan-800',
      'Natureza': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const breadcrumbItems = [
    { label: 'Atrações', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Atrações & Atividades</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra as maravilhas da nossa região. De praias paradisíacas a aventuras 
            emocionantes, há algo especial esperando por você.
          </p>
        </div>

        {/* Main Attractions */}
        <div className="mb-16">
          <h2 className="text-2xl mb-8">Principais Atrações</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(attraction.category)}>
                      {attraction.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-gray-800">
                      ⭐ {attraction.rating}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {attraction.name}
                    <span className="text-sm text-gray-500">{attraction.distance}</span>
                  </CardTitle>
                  <CardDescription>{attraction.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => onNavigate('attraction-details', attraction.id)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button className="flex-1">
                      Como Chegar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="mb-16">
          <h2 className="text-2xl mb-8">Atividades Populares</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{activity.icon}</div>
                  <CardTitle className="text-lg">{activity.name}</CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Mais Informações
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6">Dicas de Viagem</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="mb-4">🌤️ Melhor Época para Visitar</h4>
              <p className="text-gray-600 mb-4">
                A região possui clima tropical o ano todo. De dezembro a março é alta temporada 
                com mais movimento. De abril a novembro, o clima é mais ameno e ideal para atividades ao ar livre.
              </p>
            </div>
            <div>
              <h4 className="mb-4">🚗 Transporte</h4>
              <p className="text-gray-600 mb-4">
                Oferecemos transfer gratuito para as principais atrações. Aluguel de carros e 
                bicicletas disponível na recepção. Aplicativos de transporte funcionam bem na região.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg">
              Fale com Nosso Concierge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}