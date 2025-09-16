import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { RoomsPage } from './components/RoomsPage';
import { RoomDetailsPage } from './components/RoomDetailsPage';
import { ServicesPage } from './components/ServicesPage';
import { ServiceDetailsPage } from './components/ServiceDetailsPage';
import { AuthPages } from './components/AuthPages';
import { Footer } from './components/Footer';
import { PaymentPage } from './components/PaymentPage';
import { UserProfilePage } from './components/UserProfilePage';
import { MyReservationsPage } from './components/MyReservationsPage';
import { PersonalInfoPage } from './components/PersonalInfoPage';
import { MyTravelsPage } from './components/MyTravelsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [paymentData, setPaymentData] = useState<{
    type: 'room' | 'service';
    name: string;
    price: number;
    dates?: {
      checkIn: string;
      checkOut: string;
    };
    guests?: number;
    duration?: number;
  } | null>(null);

  // Estado de autenticação
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  });

  const handleNavigate = (page: string, itemId?: number) => {
    setCurrentPage(page);
    if (page === 'room-details' && itemId) {
      setSelectedRoomId(itemId);
    } else if (page === 'service-details' && itemId) {
      setSelectedServiceId(itemId);
    }
  };

  const handleOpenPayment = (type: 'room' | 'service', data: any) => {
    setPaymentData({
      type,
      name: data.name || '',
      price: data.price || 0,
      dates: data.dates,
      guests: data.guests,
      duration: data.duration
    });
    setCurrentPage('payment');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleLogin = (userData: { name: string; email: string; avatar: string }) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'rooms':
        return <RoomsPage onNavigate={handleNavigate} />;
      case 'room-details':
        return selectedRoomId ? (
          <RoomDetailsPage 
            roomId={selectedRoomId} 
            onNavigate={handleNavigate}
            onOpenPayment={handleOpenPayment}
          />
        ) : (
          <RoomsPage onNavigate={handleNavigate} />
        );
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'service-details':
        return selectedServiceId ? (
          <ServiceDetailsPage 
            serviceId={selectedServiceId} 
            onNavigate={handleNavigate}
          />
        ) : (
          <ServicesPage onNavigate={handleNavigate} />
        );
      case 'profile':
        return <UserProfilePage onNavigate={handleNavigate} />;
      case 'personal-info':
        return <PersonalInfoPage onNavigate={handleNavigate} />;
      case 'my-reservations':
        return <MyReservationsPage onNavigate={handleNavigate} />;
      case 'my-travels':
        return <MyTravelsPage onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentPage onNavigate={handleNavigate} bookingData={paymentData || undefined} />;
      case 'login':
      case 'register':
        return <AuthPages currentPage={currentPage} onNavigate={handleNavigate} onLogin={handleLogin} />;
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
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      <Footer />
    </div>
  );
}