import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface RoomErrorStateProps {
  error: string | null;
  onNavigateBack: () => void;
}

export function RoomErrorState({ error, onNavigateBack }: RoomErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">{error || "Quarto não encontrado"}</h1>
        <Button onClick={onNavigateBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a lista de quartos
        </Button>
      </div>
    </div>
  );
}