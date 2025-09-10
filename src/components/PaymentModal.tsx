import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  Users
} from 'lucide-react';
// Utilizando formatação de data simples para evitar dependências extras
const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'room' | 'service';
  data: {
    id: number;
    title: string;
    type: string;
    price?: number;
    priceRange?: string;
    schedule?: string;
    guests?: number;
  };
}

export function PaymentModal({ isOpen, onClose, type, data }: PaymentModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(data.guests || 1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    document: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setIsCompleted(true);
    
    // Fechar modal após 3 segundos
    setTimeout(() => {
      setIsCompleted(false);
      setStep(1);
      onClose();
    }, 3000);
  };

  const calculateTotal = () => {
    if (type === 'room' && data.price) {
      return data.price * guests;
    }
    return 0;
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime('');
    setGuests(data.guests || 1);
    setIsProcessing(false);
    setIsCompleted(false);
    setCustomerInfo({ name: '', email: '', phone: '', document: '' });
    setPaymentInfo({ cardNumber: '', cardName: '', expiryDate: '', cvv: '', installments: '1' });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl mb-2">Pagamento Confirmado!</h3>
            <p className="text-gray-600 mb-4">
              Sua {type === 'room' ? 'reserva' : 'solicitação de serviço'} foi processada com sucesso.
            </p>
            <p className="text-sm text-gray-500">
              Você receberá uma confirmação por email em breve.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === 'room' ? 'Reservar Quarto' : 'Agendar Serviço'}
          </DialogTitle>
          <DialogDescription>
            Complete os dados para finalizar sua {type === 'room' ? 'reserva' : 'solicitação'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= stepNumber 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service/Room Details and Date/Time */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Service/Room Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg mb-1">{data.title}</h4>
                    <Badge variant="secondary" className="mb-2">
                      {type === 'room' ? 'Quarto' : 'Serviço'}
                    </Badge>
                    {data.schedule && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {data.schedule}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {data.price ? (
                      <p className="text-xl">R$ {data.price}</p>
                    ) : (
                      <p className="text-sm text-gray-600">{data.priceRange}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <div className="space-y-4">
              <Label>Selecione a Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      formatDate(selectedDate)
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection for Services */}
            {type === 'service' && (
              <div className="space-y-4">
                <Label>Selecione o Horário</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Guests for Rooms */}
            {type === 'room' && (
              <div className="space-y-4">
                <Label>Número de Hóspedes</Label>
                <Select 
                  value={guests.toString()} 
                  onValueChange={(value) => setGuests(parseInt(value))}
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
            )}

            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                disabled={!selectedDate || (type === 'service' && !selectedTime)}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Customer Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">CPF</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00"
                  value={customerInfo.document}
                  onChange={(e) => setCustomerInfo({...customerInfo, document: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Information */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-4">Resumo do Pedido</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{data.title}</span>
                    <span>{data.price ? `R$ ${data.price}` : data.priceRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span>{selectedDate ? selectedDate.toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span>Horário:</span>
                      <span>{selectedTime}</span>
                    </div>
                  )}
                  {type === 'room' && (
                    <div className="flex justify-between">
                      <span>Hóspedes:</span>
                      <span>{guests}</span>
                    </div>
                  )}
                  <Separator />
                  {data.price && (
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>R$ {calculateTotal()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <Label>Informações do Cartão</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="Nome como no cartão"
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="expiryDate">Validade</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/AA"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="000"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                  />
                </div>
              </div>

              {data.price && (
                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <Select 
                    value={paymentInfo.installments} 
                    onValueChange={(value) => setPaymentInfo({...paymentInfo, installments: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x de R$ {calculateTotal()} sem juros</SelectItem>
                      <SelectItem value="2">2x de R$ {(calculateTotal() / 2).toFixed(2)} sem juros</SelectItem>
                      <SelectItem value="3">3x de R$ {(calculateTotal() / 3).toFixed(2)} sem juros</SelectItem>
                      <SelectItem value="6">6x de R$ {(calculateTotal() / 6).toFixed(2)} sem juros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Finalizar Pagamento'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}