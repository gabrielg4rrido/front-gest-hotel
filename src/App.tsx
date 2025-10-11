import React, { useState } from "react";
import { Header, Footer } from "./components";
import {
  HomePage,
  RoomsPage,
  RoomDetailsPage,
  ServicesPage,
  ServiceDetailsPage,
  AuthPages,
  PaymentPage,
  UserProfilePage,
  MyReservationsPage,
  PersonalInfoPage,
  MyTravelsPage,
} from "./pages";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const [paymentData, setPaymentData] = useState<{
    type: "room" | "service";
    name: string;
    price: number;
    dates?: {
      checkIn: string;
      checkOut: string;
    };
    guests?: number;
    duration?: number;
  } | null>(null);

  // Estado de autenticação (mock)
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>({
    name: "João Silva",
    email: "joao.silva@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  });

  // Navegação entre páginas e registro de IDs selecionados
  const handleNavigate = (page: string, itemId?: number) => {
    setCurrentPage(page);

    if (page === "room-details" && itemId) {
      setSelectedRoomId(itemId);
    } else if (page === "service-details" && itemId) {
      setSelectedServiceId(itemId);
    }
  };

  // Abertura de tela de pagamento (para quartos ou serviços)
  const handleOpenPayment = (
    type: "room" | "service",
    data: {
      name: string;
      price: number;
      dates?: { checkIn: string; checkOut: string };
      guests?: number;
      duration?: number;
    }
  ) => {
    setPaymentData({
      type,
      name: data.name || "",
      price: data.price || 0,
      dates: data.dates,
      guests: data.guests,
      duration: data.duration,
    });
    setCurrentPage("payment");
  };

  // Login e Logout
  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const handleLogin = (userData: { name: string; email: string; avatar: string }) => {
    setUser(userData);
    setCurrentPage("home");
  };

  // Renderização dinâmica das páginas
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;

      case "rooms":
        return <RoomsPage onNavigate={handleNavigate} />;

      case "room-details":
        return selectedRoomId ? (
          <RoomDetailsPage
            roomId={selectedRoomId}
            onNavigate={handleNavigate}
            onOpenPayment={handleOpenPayment}
          />
        ) : (
          <RoomsPage onNavigate={handleNavigate} />
        );

      case "services":
        return <ServicesPage onNavigate={handleNavigate} />;

      case "service-details":
        return selectedServiceId ? (
          <ServiceDetailsPage serviceId={selectedServiceId} onNavigate={handleNavigate} />
        ) : (
          <ServicesPage onNavigate={handleNavigate} />
        );

      case "profile":
        return <UserProfilePage onNavigate={handleNavigate} />;

      case "personal-info":
        return <PersonalInfoPage onNavigate={handleNavigate} />;

      case "my-reservations":
        return <MyReservationsPage onNavigate={handleNavigate} />;

      case "my-travels":
        return <MyTravelsPage onNavigate={handleNavigate} />;

      case "payment":
        return <PaymentPage onNavigate={handleNavigate} bookingData={paymentData || undefined} />;

      case "login":
      case "register":
        return (
          <AuthPages
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        );

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header global */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Conteúdo dinâmico */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Rodapé fixo */}
      <Footer />
    </div>
  );
}
