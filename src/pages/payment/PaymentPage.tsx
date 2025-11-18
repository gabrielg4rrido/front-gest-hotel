import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  BookingSummary,
  GuestDataForm,
  AdditionalServices,
  PaymentForm,
} from "../../components/payment";
import { apiService, TokenManager } from "../../services/api";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface PaymentPageProps {
  onNavigate: (page: string, roomId?: number) => void;
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
    capacity?: number;
    roomId?: number;
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

  const [guestData, setGuestData] = useState({
    totalGuests: bookingData?.guests || 2,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    birthday: "",
    isMainGuest: "main",
    checkIn: bookingData?.dates?.checkIn || "",
    checkOut: bookingData?.dates?.checkOut || "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Mapeamento de ícones armazenados no banco (campo "icone")
  const emojiMap: Record<string, string> = {
    transfer: "✈️",
    lavanderia: "👔",
    ":baby:": "👶",
    ":dog:": "🐕",
    ":bell:": "🛎️",
    ":car:": "🚗",
    ":map:": "🗺️",
    ":wifi:": "📶",
  };

  // 🔹 Busca serviços adicionais direto do back-end
  useEffect(() => {
    fetch("http://localhost:3004/api/additional-services")
      .then((res) => res.json())
      .then((data) => {
        console.log("Serviços adicionais recebidos:", data);
        const formatted = data.map((item: any) => ({
          id: String(item.id),
          name: item.titulo,
          description: item.descricao,
          price: Number(item.preco) || 0,
          icon: emojiMap[item.icone] || "⭐", // usa ícone do banco ou fallback
          included: item.incluso === 1, // para marcar como incluso
        }));

        setAdditionalServices(formatted);
      })
      .catch((err) =>
        console.error("Erro ao buscar serviços adicionais:", err)
      );
  }, []);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // ⬇️ RESTANTE DO CÓDIGO PERMANECE IGUAL
  const getBookingData = () => {
    if (bookingData) return bookingData;
    const sessionData = sessionStorage.getItem("paymentData");
    if (sessionData) return JSON.parse(sessionData);

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
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  const installmentOptions = [
    { value: "1", label: `1x de R$ ${total.toFixed(2)}` },
    { value: "2", label: `2x de R$ ${(total / 2).toFixed(2)}` },
    { value: "3", label: `3x de R$ ${(total / 3).toFixed(2)}` },
    { value: "6", label: `6x de R$ ${(total / 6).toFixed(2)}` },
    { value: "12", label: `12x de R$ ${(total / 12).toFixed(2)}` },
  ];

  const handlePayment = async () => {
    console.log("🔵 handlePayment foi chamado!");
    console.log("📦 guestData:", guestData);
    console.log("📦 booking:", booking);
    console.log("📦 bookingData:", bookingData);
    
    setError(null);

    // Validação dos dados do hóspede
    if (
      !guestData.firstName ||
      !guestData.lastName ||
      !guestData.email ||
      !guestData.phone
    ) {
      setError("Por favor, preencha todos os dados do hóspede.");
      return;
    }

    // Validação para reservas de quarto
    if (booking.type === "room") {
      if (!guestData.checkIn || !guestData.checkOut) {
        setError("Datas de check-in e check-out são obrigatórias.");
        return;
      }

      if (!bookingData?.roomId) {
        setError("ID do quarto não encontrado.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Obter dados do usuário logado
      const userData = TokenManager.getUserData();
      if (!userData?.id) {
        setError("Usuário não autenticado.");
        setIsSubmitting(false);
        return;
      }

      // Preparar dados da reserva
      const reservaData = {
        dataEntrada: guestData.checkIn,
        dataSaida: guestData.checkOut,
        status: "Pendente",
        idQuarto: bookingData!.roomId,
        idCliente: userData.id,
        precoTotal: total,
        quantidadeHospedes: guestData.totalGuests,
        quantidadeDiarias: days,
        idHospede: userData.id,
      };

      // Preparar dados do hóspede
      const hospedeData = {
        nome: guestData.firstName,
        sobrenome: guestData.lastName,
        email: guestData.email,
        telefone: guestData.phone,
        cpf: guestData.cpf,
        dataNascimento: guestData.birthday,
      };

      console.log("Enviando reserva:", reservaData);
      console.log("Enviando hóspede:", hospedeData);

      // Enviar para o back-end
      const response = await fetch("http://localhost:3002/api/reserva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TokenManager.getAccessToken()}`,
        },
        body: JSON.stringify({
          reserva: reservaData,
          hospede: hospedeData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar reserva");
      }

      const result = await response.json();
      console.log("Reserva criada com sucesso:", result);

      // Limpar sessionStorage
      sessionStorage.removeItem("paymentData");

      // Redirecionar para página de sucesso ou minhas reservas
      alert(
        `Reserva realizada com sucesso para ${guestData.firstName} ${guestData.lastName}!`
      );
      onNavigate("my-reservations");
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao processar reserva. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              if (booking.type === "room" && bookingData?.roomId) {
                onNavigate("room-details", bookingData.roomId);
              } else {
                onNavigate("home");
              }
            }}
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
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <GuestDataForm
              guestData={guestData}
              onGuestDataChange={setGuestData}
              maxCapacity={bookingData?.capacity || 6}
            />

            {/* 🔹 Agora os serviços vêm do backend */}
            <AdditionalServices
              additionalServices={additionalServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />

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
              onCancel={() => {
                if (booking.type === "room" && bookingData?.roomId) {
                  onNavigate("room-details", bookingData.roomId);
                } else {
                  onNavigate("home");
                }
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
