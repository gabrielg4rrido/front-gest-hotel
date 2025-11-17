import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
  MyTravelsPage,
} from "./pages";
import { apiService, TokenManager } from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
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
    capacity?: number;
    roomId?: number;
  } | null>(null);

  // Estado de autenticação (mock)
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao inicializar a aplicação
  useEffect(() => {
    const checkAuth = () => {
      const userData = TokenManager.getUserData();
      if (userData && apiService.isAuthenticated()) {
        setUser({
          name: userData.nome,
          email: userData.email,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleNavigate = (page: string, itemId?: number) => {
    setCurrentPage(page);
    if (page === "room-details" && itemId) {
      setSelectedRoomId(itemId);
    } else if (page === "service-details" && itemId) {
      setSelectedServiceId(itemId);
    }
  };

  const handleOpenPayment = (type: "room" | "service", data: any) => {
    // Verificar se o usuário está logado antes de abrir o pagamento
    if (!user) {
      setCurrentPage("login");
      return;
    }

    setPaymentData({
      type,
      name: data.name || "",
      price: data.price || 0,
      dates: data.dates,
      guests: data.guests,
      duration: data.duration,
      capacity: data.capacity,
      roomId: data.roomId,
    });
    setCurrentPage("payment");
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setUser(null);
      setCurrentPage("home");
    }
  };

  const handleLogin = (userData: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    setUser(userData);
    setCurrentPage("home");
  };

  // Verificar se páginas protegidas precisam de autenticação
  const protectedPages = [
    "profile",
    "personal-info",
    "my-reservations",
    "my-travels",
    "payment",
  ];

  useEffect(() => {
    if (protectedPages.includes(currentPage) && !user) {
      setCurrentPage("login");
    }
  }, [currentPage, user]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

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
          <ServiceDetailsPage
            serviceId={selectedServiceId}
            onNavigate={handleNavigate}
          />
        ) : (
          <ServicesPage onNavigate={handleNavigate} />
        );
      case "profile":
      case "personal-info":
        return <UserProfilePage onNavigate={handleNavigate} />;
      case "my-reservations":
        return <MyReservationsPage onNavigate={handleNavigate} />;
      case "my-travels":
        return <MyTravelsPage onNavigate={handleNavigate} />;
      case "payment":
        return (
          <PaymentPage
            onNavigate={handleNavigate}
            bookingData={paymentData || undefined}
          />
        );
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
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1">{renderCurrentPage()}</main>

      <Footer />
    </div>
  );
}
