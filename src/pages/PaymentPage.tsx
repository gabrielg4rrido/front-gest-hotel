import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  BookingSummary,
  GuestDataForm,
  AdditionalServices,
  PaymentForm,
} from "../components/payment";

interface PaymentPageProps {
  onNavigate: (page: string) => void;
  bookingData?: {
    type: "room" | "service";
    name: string;
    price: number;
    dates?: {
      checkIn: string;
      checkOut: string;
    };
    guests?: number;
    duration?: number;
  };
}

export function PaymentPage({ onNavigate, bookingData }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [installments, setInstallments] = useState("1");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Estados para dados do hóspede
  const [guestData, setGuestData] = useState({
    totalGuests: bookingData?.guests || 2,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isMainGuest: "main",
  });

  // Estados para serviços adicionais
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const additionalServices = [
    {
      id: "restaurant",
      name: "Restaurante Gourmet",
      description: "Acesso ao restaurante com desconto de 15%",
      price: 0,
      icon: "🍽️",
    },
    {
      id: "spa",
      name: "Spa & Wellness",
      description: "Pacote completo com massagem relaxante",
      price: 250,
      icon: "💆",
    },
    {
      id: "gym",
      name: "Academia Premium",
      description: "Acesso ilimitado + personal trainer",
      price: 100,
      icon: "💪",
    },
    {
      id: "concierge",
      name: "Concierge 24h",
      description: "Atendimento personalizado durante a estadia",
      price: 150,
      icon: "🎩",
    },
    {
      id: "transfer",
      name: "Transfer Aeroporto",
      description: "Transfer ida e volta do aeroporto",
      price: 120,
      icon: "✈️",
    },
    {
      id: "laundry",
      name: "Lavanderia Express",
      description: "Serviço de lavanderia premium",
      price: 80,
      icon: "👔",
    },
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getBookingData = () => {
    if (bookingData) return bookingData;

    const sessionData = sessionStorage.getItem("paymentData");
    if (sessionData) {
      return JSON.parse(sessionData);
    }

    return {
      type: "room" as const,
      name: "Quarto Deluxe",
      price: 350,
      dates: {
        checkIn: "2025-09-15",
        checkOut: "2025-09-18",
      },
      guests: 2,
    };
  };

  const booking = getBookingData();

  const calculateDays = () => {
    if (booking.dates) {
      const checkIn = new Date(booking.dates.checkIn);
      const checkOut = new Date(booking.dates.checkOut);
      return Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
      );
    }
    return booking.duration || 1;
  };

  const days = calculateDays();
  const roomSubtotal = booking.price * days;
  const servicesSubtotal = selectedServices.reduce((acc, serviceId) => {
    const service = additionalServices.find((s) => s.id === serviceId);
    return acc + (service?.price || 0);
  }, 0);
  const subtotal = roomSubtotal + servicesSubtotal;
  const taxes = subtotal * 0.12; // 12% de impostos
  const total = subtotal + taxes;

  const installmentOptions = [
    { value: "1", label: `1x de R$ ${total.toFixed(2)}` },
    { value: "2", label: `2x de R$ ${(total / 2).toFixed(2)}` },
    { value: "3", label: `3x de R$ ${(total / 3).toFixed(2)}` },
    { value: "6", label: `6x de R$ ${(total / 6).toFixed(2)}` },
    { value: "12", label: `12x de R$ ${(total / 12).toFixed(2)}` },
  ];

  const handlePayment = () => {
    // Validar dados do hóspede
    if (
      !guestData.firstName ||
      !guestData.lastName ||
      !guestData.email ||
      !guestData.phone
    ) {
      alert("Por favor, preencha todos os dados do hóspede.");
      return;
    }

    // Simular processamento do pagamento
    alert(
      `Pagamento processado com sucesso para ${guestData.firstName} ${guestData.lastName}! Você receberá a confirmação por email.`
    );
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl mb-2">Finalizar Reserva</h1>
          <p className="text-gray-600">
            Complete os dados do hóspede e pagamento para confirmar sua reserva
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resumo da Reserva */}
          <div className="lg:col-span-1">
            <BookingSummary
              booking={booking}
              guestCount={guestData.totalGuests}
              days={days}
              roomSubtotal={roomSubtotal}
              servicesSubtotal={servicesSubtotal}
              taxes={taxes}
              total={total}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Hóspede */}
            <GuestDataForm
              guestData={guestData}
              onGuestDataChange={setGuestData}
            />

            {/* Serviços Adicionais */}
            <AdditionalServices
              additionalServices={additionalServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />

            {/* Dados do Pagamento */}
            <PaymentForm
              paymentMethod={paymentMethod}
              installments={installments}
              cardData={cardData}
              installmentOptions={installmentOptions}
              total={total}
              onPaymentMethodChange={setPaymentMethod}
              onInstallmentsChange={setInstallments}
              onCardDataChange={setCardData}
              onPayment={handlePayment}
              onCancel={() => onNavigate("home")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
