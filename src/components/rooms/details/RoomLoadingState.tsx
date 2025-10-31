import { Loader2 } from "lucide-react";
import React from "react";

export function RoomLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-gray-600">Carregando detalhes do quarto...</p>
      </div>
    </div>
  );
}