import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Calendar, CreditCard, Users, MapPin, Banknote, User, Plus } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
  bookingData?: {
    type: 'room' | 'service';
    name: string;
    price: number;
    dates?: {
      checkIn: string;
      checkOut: string;
    };
    guests?: number;
    duration?: number; // for services in hours
  };
}

export function PaymentPage({ onNavigate, bookingData }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [installments, setInstallments] = useState('1');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  // Estados para dados do hóspede
  const [guestData, setGuestData] = useState({
    totalGuests: bookingData?.guests || 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isMainGuest: 'main' // 'main' ou 'other'
  });

  // Estados para serviços adicionais
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const additionalServices = [
    {
      id: 'restaurant',
      name: 'Restaurante Gourmet',
      description: 'Acesso ao restaurante com desconto de 15%',
      price: 0,
      icon: '🍽️'
    },
    {
      id: 'spa',
      name: 'Spa & Wellness',
      description: 'Pacote completo com massagem relaxante',
      price: 250,
      icon: '💆'
    },
    {
      id: 'gym',
      name: 'Academia Premium',
      description: 'Acesso ilimitado + personal trainer',
      price: 100,
      icon: '💪'
    },
    {
      id: 'concierge',
      name: 'Concierge 24h',
      description: 'Atendimento personalizado durante a estadia',
      price: 150,
      icon: '🎩'
    },
    {
      id: 'transfer',
      name: 'Transfer Aeroporto',
      description: 'Transfer ida e volta do aeroporto',
      price: 120,
      icon: '✈️'
    },
    {
      id: 'laundry',
      name: 'Lavanderia Express',
      description: 'Serviço de lavanderia premium',
      price: 80,
      icon: '👔'
    }
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Get booking data from props or sessionStorage
  const getBookingData = () => {
    if (bookingData) return bookingData;
    
    const sessionData = sessionStorage.getItem('paymentData');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    
    // Default booking data if none provided
    return {
      type: 'room' as const,
      name: 'Quarto Deluxe',
      price: 350,
      dates: {
        checkIn: '2025-09-15',
        checkOut: '2025-09-18'
      },
      guests: 2
    };
  };

  const booking = getBookingData();
  
  const calculateDays = () => {
    if (booking.dates) {
      const checkIn = new Date(booking.dates.checkIn);
      const checkOut = new Date(booking.dates.checkOut);
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
    }
    return booking.duration || 1;
  };

  const days = calculateDays();
  const roomSubtotal = booking.price * days;
  const servicesSubtotal = selectedServices.reduce((acc, serviceId) => {
    const service = additionalServices.find(s => s.id === serviceId);
    return acc + (service?.price || 0);
  }, 0);
  const subtotal = roomSubtotal + servicesSubtotal;
  const taxes = subtotal * 0.12; // 12% de impostos
  const total = subtotal + taxes;

  const installmentOptions = [
    { value: '1', label: `1x de R$ ${total.toFixed(2)}` },
    { value: '2', label: `2x de R$ ${(total / 2).toFixed(2)}` },
    { value: '3', label: `3x de R$ ${(total / 3).toFixed(2)}` },
    { value: '6', label: `6x de R$ ${(total / 6).toFixed(2)}` },
    { value: '12', label: `12x de R$ ${(total / 12).toFixed(2)}` }
  ];

  const handlePayment = () => {
    // Validar dados do hóspede
    if (!guestData.firstName || !guestData.lastName || !guestData.email || !guestData.phone) {
      alert('Por favor, preencha todos os dados do hóspede.');
      return;
    }

    // Simular processamento do pagamento
    alert(`Pagamento processado com sucesso para ${guestData.firstName} ${guestData.lastName}! Você receberá a confirmação por email.`);
    onNavigate('home');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl mb-2">Finalizar Reserva</h1>
          <p className="text-gray-600">Complete os dados do hóspede e pagamento para confirmar sua reserva</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resumo da Reserva */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Resumo da Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{booking.name}</h3>
                  <p className="text-sm text-gray-600">{booking.type === 'room' ? 'Acomodação' : 'Serviço'}</p>
                </div>

                {booking.dates && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Check-in: {formatDate(booking.dates.checkIn)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Check-out: {formatDate(booking.dates.checkOut)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{guestData.totalGuests} {guestData.totalGuests === 1 ? 'hóspede' : 'hóspedes'}</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Acomodação ({days} {days === 1 ? 'diária' : 'diárias'})</span>
                    <span>R$ {roomSubtotal.toFixed(2)}</span>
                  </div>
                  {servicesSubtotal > 0 && (
                    <div className="flex justify-between">
                      <span>Serviços adicionais</span>
                      <span>R$ {servicesSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Impostos e taxas</span>
                    <span>R$ {taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Hóspede */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados do Hóspede Titular
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quantidade de Hóspedes */}
                <div>
                  <Label htmlFor="totalGuests">Quantidade de Hóspedes</Label>
                  <Select 
                    value={guestData.totalGuests.toString()} 
                    onValueChange={(value) => setGuestData({...guestData, totalGuests: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Reserva */}
                <div>
                  <Label className="text-base mb-3 block">Você é o hóspede principal?</Label>
                  <RadioGroup 
                    value={guestData.isMainGuest} 
                    onValueChange={(value) => setGuestData({...guestData, isMainGuest: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="main" id="main" />
                      <Label htmlFor="main" className="cursor-pointer">
                        Sim, eu sou o hóspede principal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Não, estou reservando para outra pessoa
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h4 className="font-semibold">
                    {guestData.isMainGuest === 'main' 
                      ? 'Seus dados pessoais' 
                      : 'Dados do hóspede titular'
                    }
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        placeholder="Nome"
                        value={guestData.firstName}
                        onChange={(e) => setGuestData({...guestData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        placeholder="Sobrenome"
                        value={guestData.lastName}
                        onChange={(e) => setGuestData({...guestData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={guestData.email}
                      onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={guestData.phone}
                      onChange={(e) => setGuestData({...guestData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Serviços Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Serviços Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Aproveite ao máximo sua estadia com nossos serviços exclusivos
                </p>
                
                <div className="space-y-4">
                  {additionalServices.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{service.icon}</span>
                          <Label htmlFor={service.id} className="cursor-pointer font-medium">
                            {service.name}
                          </Label>
                          {service.price > 0 && (
                            <span className="ml-auto font-semibold text-primary">
                              R$ {service.price.toFixed(2)}
                            </span>
                          )}
                          {service.price === 0 && (
                            <span className="ml-auto text-green-600 font-semibold text-sm">
                              Incluso
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Serviços selecionados:</h4>
                    <div className="space-y-1">
                      {selectedServices.map(serviceId => {
                        const service = additionalServices.find(s => s.id === serviceId);
                        return service ? (
                          <div key={serviceId} className="flex justify-between text-sm">
                            <span>{service.icon} {service.name}</span>
                            <span className="font-medium">
                              {service.price > 0 ? `R$ ${service.price.toFixed(2)}` : 'Incluso'}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dados do Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Dados do Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Método de Pagamento */}
                <div>
                  <Label className="text-base mb-3 block">Forma de Pagamento</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="credit" id="credit" />
                      <CreditCard className="h-5 w-5" />
                      <Label htmlFor="credit" className="flex-1 cursor-pointer">
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="debit" id="debit" />
                      <CreditCard className="h-5 w-5" />
                      <Label htmlFor="debit" className="flex-1 cursor-pointer">
                        Cartão de Débito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="pix" id="pix" />
                      <Banknote className="h-5 w-5" />
                      <Label htmlFor="pix" className="flex-1 cursor-pointer">
                        PIX (5% de desconto)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Dados do Cartão ou PIX */}
                {paymentMethod === 'pix' ? (
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Pagamento via PIX</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Você receberá o código PIX por email para finalizar o pagamento.
                      O desconto de 5% já foi aplicado no valor total.
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <p className="text-lg font-semibold text-green-600">
                        Total com desconto PIX: R$ {(total * 0.95).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.number}
                          onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          placeholder="Como impresso no cartão"
                          value={cardData.name}
                          onChange={(e) => setCardData({...cardData, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Validade</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'credit' && (
                      <div>
                        <Label className="text-base mb-3 block">Parcelamento</Label>
                        <Select value={installments} onValueChange={setInstallments}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o parcelamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {installmentOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onNavigate('home')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handlePayment}
                    size="lg"
                  >
                    {paymentMethod === 'pix' 
                      ? `Pagar R$ ${(total * 0.95).toFixed(2)} via PIX`
                      : `Pagar R$ ${total.toFixed(2)}`
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}