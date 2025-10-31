import React from "react";
import { Card, CardContent } from "./ui/card";
import { ImageGallery } from "./ImageGallery"; // Ajuste o caminho se necessário

interface RoomGalleryCardProps {
  // Recebe um array de imagens. Pode ser opcional.
  images?: string[]; 
  title: string;
}

export function GalleryCard({ images, title }: RoomGalleryCardProps) {
  
  // A lógica de "só renderizar se houver imagem" agora mora aqui!
  // Verificamos se o array 'images' foi passado e se não está vazio.
  if (!images || images.length === 0) {
    return null; // Não renderiza nada
  }

  // Se houver imagens, renderiza o card completo
  return (
    <Card className="overflow-hidden mb-8">
      <CardContent className="p-6">
        <ImageGallery images={images} title={title} />
      </CardContent>
    </Card>
  );
}