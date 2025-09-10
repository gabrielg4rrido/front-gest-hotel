import React from 'react';
import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-xl mb-4">Hotel Paradise</h3>
            <p className="text-sm opacity-90 mb-4">
              Seu destino de luxo e conforto. Experiências inesquecíveis 
              em uma localização paradisíaca.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                📘
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                📷
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                🐦
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Home</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Quartos</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Serviços</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Atrações</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contato</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Reservas Online</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Concierge 24h</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Transfer Aeroporto</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Room Service</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Spa & Wellness</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contato</h4>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Av. Beira Mar, 1234<br />Paraíso - BR</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+55 11 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <span>contato@hotelparadise.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-90">
          <p>&copy; 2024 Hotel Paradise. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:opacity-100 transition-opacity">Política de Privacidade</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Termos de Uso</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}