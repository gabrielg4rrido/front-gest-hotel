import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { CreditCard, Banknote } from 'lucide-react';

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface InstallmentOption {
  value: string;
  label: string;
}

interface PaymentFormProps {
  paymentMethod: string;
  installments: string;
  cardData: CardData;
  installmentOptions: InstallmentOption[];
  total: number;
  onPaymentMethodChange: (method: string) => void;
  onInstallmentsChange: (installments: string) => void;
  onCardDataChange: (data: CardData) => void;
  onPayment: () => void;
  onCancel: () => void;
}

export function PaymentForm({
  paymentMethod,
  installments,
  cardData,
  installmentOptions,
  total,
  onPaymentMethodChange,
  onInstallmentsChange,
  onCardDataChange,
  onPayment,
  onCancel
}: PaymentFormProps) {
  const updateCardData = (updates: Partial<CardData>) => {
    onCardDataChange({ ...cardData, ...updates });
  };

  return (
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
          <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
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
                  onChange={(e) => updateCardData({ number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="Como impresso no cartão"
                  value={cardData.name}
                  onChange={(e) => updateCardData({ name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Validade</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => updateCardData({ expiry: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => updateCardData({ cvv: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <div>
                <Label className="text-base mb-3 block">Parcelamento</Label>
                <Select value={installments} onValueChange={onInstallmentsChange}>
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
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1" 
            onClick={onPayment}
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
  );
}