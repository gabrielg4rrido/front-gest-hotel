import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { MapPin, CreditCard } from "lucide-react";

const Calendar = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const Users = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const Clock = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const Download = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const Eye = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- INTERFACES (Definição de tipos para o TypeScript) ---
interface Reservation {
  id: string;
  type: "room" | "service";
  name: string;
  dates: { checkIn: string; checkOut: string };
  guests: number;
  price: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  image: string;
}

// --- COMPONENTE PRINCIPAL ---
export function MyReservationsPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/reservas");

      const mappedReservations = response.data.map((apiRes: any) => ({
        id: apiRes.idReserva,
        name: apiRes.nomeHospede,
        dates: {
          checkIn: apiRes.dataEntrada.split("T")[0],
          checkOut: apiRes.dataSaida.split("T")[0],
        },
        guests: apiRes.quantidadeHospedes,
        price: parseFloat(apiRes.precoTotal),
        status:
          new Date(apiRes.dataSaida) < new Date() ? "completed" : "confirmed",
        image: `https://placehold.co/600x400/334155/FFFFFF?text=${encodeURIComponent(
          apiRes.nomeHospede
        )}`,
      }));

      setReservations(mappedReservations);
    } catch (err) {
      setError(
        "Não foi possível carregar as reservas. Verifique se o servidor da API está a ser executado."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    if (window.confirm("Tem a certeza de que deseja cancelar esta reserva?")) {
      try {
        await axios.delete(
          `http://localhost:3001/api/reservas/${reservationId}`
        );
        // Após o cancelamento, busca novamente a lista atualizada de reservas
        fetchReservations();
      } catch (error) {
        alert(
          "Não foi possível cancelar a reserva. Tente novamente mais tarde."
        );
        console.error("Erro ao cancelar reserva:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">A carregar as suas reservas...</div>
    );
  }
  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Minhas Reservas</h1>
      <div className="space-y-6">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              <img
                src={reservation.image}
                alt={reservation.name}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {reservation.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Check-in:{" "}
                    {new Date(reservation.dates.checkIn).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}{" "}
                    | Check-out:{" "}
                    {new Date(reservation.dates.checkOut).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reservation.guests} hóspede(s)
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-semibold">
                    R$ {reservation.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p>Não foram encontradas reservas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
