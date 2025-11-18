import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CreditCard, Banknote, Loader2 } from "lucide-react";

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
  isSubmitting?: boolean;
}

interface ApiPaymentMethodsResponse {
  success: boolean;
  data?: { methods?: ApiPaymentMethod[] };
  message?: string;
}

interface ApiPaymentMethod {
  id: string;
  tipo: number;
  tipoLabel: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NormalizedPaymentMethod {
  id: string;
  label: string;
  value: string;
  requiresCard: boolean;
  discountPercent: number;
  icon: "credit" | "pix" | "default";
}

const METHOD_MAP: Record<
  number,
  Omit<NormalizedPaymentMethod, "id" | "label">
> = {
  1: {
    value: "credit",
    requiresCard: true,
    discountPercent: 0,
    icon: "credit",
  },
  2: { value: "pix", requiresCard: false, discountPercent: 5, icon: "pix" },
};

function normalize(api: ApiPaymentMethod): NormalizedPaymentMethod {
  const base = METHOD_MAP[api.tipo] || {
    value: `tipo-${api.tipo}`,
    requiresCard: false,
    discountPercent: 0,
    icon: "default" as const,
  };
  return {
    id: api.id,
    label: api.tipoLabel,
    ...base,
  };
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
  onCancel,
  isSubmitting = false,
}: PaymentFormProps) {
  const [methods, setMethods] = useState<NormalizedPaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [methodsError, setMethodsError] = useState<string | null>(null);

  const updateCardData = (updates: Partial<CardData>) => {
    onCardDataChange({ ...cardData, ...updates });
  };
  useEffect(() => {
    let active = true;
    async function load() {
      setLoadingMethods(true);
      setMethodsError(null);
      try {
        const res = await fetch("http://localhost:3005/api/metodo-pagamento");
        if (!res.ok) throw new Error("Falha ao buscar métodos");

        const json: ApiPaymentMethodsResponse = await res.json();
        if (!json.success) {
          throw new Error(json.message || "Falha ao buscar métodos");
        }

        const raw = json.data?.methods ?? [];
        const enabled = raw.filter((m) => m.status);
        const normalized = enabled.map(normalize);

        if (active) {
          setMethods(normalized);
          if (
            !normalized.some((m) => m.value === paymentMethod) &&
            normalized.length
          ) {
            onPaymentMethodChange(normalized[0].value);
          }
        }
      } catch (e: any) {
        if (active) setMethodsError(e.message || "Erro ao carregar métodos");
      } finally {
        if (active) setLoadingMethods(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [paymentMethod, onPaymentMethodChange]);

  const selectedMethod = methods.find((m) => m.value === paymentMethod);
  const discountPercent = selectedMethod?.discountPercent ?? 0;
  const totalWithDiscount = discountPercent
    ? total * (1 - discountPercent / 100)
    : total;

  const renderIcon = (m: NormalizedPaymentMethod) => {
    switch (m.icon) {
      case "credit":
        return <CreditCard className="h-5 w-5" />;
      case "pix":
        return <Banknote className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
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
        <div>
          <Label className="text-base mb-3 block">Forma de Pagamento</Label>
          {loadingMethods && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando métodos...
            </div>
          )}
          {methodsError && (
            <div className="text-sm text-red-600">{methodsError}</div>
          )}
          {!loadingMethods && !methodsError && (
            <RadioGroup
              value={paymentMethod}
              onValueChange={onPaymentMethodChange}
            >
              {methods.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <RadioGroupItem value={m.value} id={m.id} />
                  {renderIcon(m)}
                  <Label htmlFor={m.id} className="flex-1 cursor-pointer">
                    {m.label}
                    {m.discountPercent > 0 &&
                      ` (${m.discountPercent}% de desconto)`}
                  </Label>
                </div>
              ))}
              {methods.length === 0 && (
                <div className="text-sm text-gray-500">
                  Nenhum método disponível.
                </div>
              )}
            </RadioGroup>
          )}
        </div>

        {selectedMethod && !selectedMethod.requiresCard && (
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">{selectedMethod.label}</h3>
            {discountPercent > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                Desconto de {discountPercent}% aplicado automaticamente.
              </p>
            )}
            <div className="bg-white p-4 rounded border">
              <p className="text-lg font-semibold text-green-600">
                Total: R$ {totalWithDiscount.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {selectedMethod && selectedMethod.requiresCard && (
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

            {paymentMethod === "credit" && (
              <div>
                <Label className="text-base mb-3 block">Parcelamento</Label>
                <Select
                  value={installments}
                  onValueChange={onInstallmentsChange}
                >
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

            {discountPercent > 0 && (
              <p className="text-sm text-green-600">
                Total com desconto: R$ {totalWithDiscount.toFixed(2)}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={onPayment}
            size="lg"
            disabled={!selectedMethod || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : selectedMethod ? (
              `Pagar R$ ${totalWithDiscount.toFixed(2)}`
            ) : (
              "Selecione um método"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
