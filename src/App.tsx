import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { RoomsPage } from './components/RoomsPage';
import { RoomDetailsPage } from './components/RoomDetailsPage';
import { ServicesPage } from './components/ServicesPage';
import { ServiceDetailsPage } from './components/ServiceDetailsPage';
import { AttractionsPage } from './components/AttractionsPage';
import { AuthPages } from './components/AuthPages';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    type: 'room' as 'room' | 'service',
    data: {}
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
    setPaymentModal({
      isOpen: true,
      type,
      data
    });
  };

  const handleClosePayment = () => {
    setPaymentModal({
      ...paymentModal,
      isOpen: false
    });
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
            onOpenPayment={handleOpenPayment}
          />
        ) : (
          <ServicesPage onNavigate={handleNavigate} />
        );
      case 'attractions':
        return <AttractionsPage />;
      case 'login':
      case 'register':
        return <AuthPages currentPage={currentPage} onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={handleClosePayment}
        type={paymentModal.type}
        data={paymentModal.data}
      />
    </div>
  );
}