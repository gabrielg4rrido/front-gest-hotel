import React, { useState } from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      nextModalImage();
    } else if (e.key === 'ArrowLeft') {
      prevModalImage();
    }
  };

  return (
    <>
      {/* Galeria Principal */}
      <div className="space-y-4">
        {/* Imagem Principal */}
        <div className="relative group">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <ImageWithFallback
              src={images[selectedImageIndex]}
              alt={`${title} - Imagem principal`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => openModal(selectedImageIndex)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
          
          {/* Controles de navegação na imagem principal */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Miniaturas */}
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              onDoubleClick={() => openModal(index)}
              className={`aspect-video rounded overflow-hidden border-2 transition-colors group relative ${
                selectedImageIndex === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${title} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Visualização */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Botão de fechar */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Controles de navegação */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevModalImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextModalImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Imagem do modal */}
          <div className="max-w-4xl max-h-full">
            <ImageWithFallback
              src={images[modalImageIndex]}
              alt={`${title} - ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Indicador de posição */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {modalImageIndex + 1} / {images.length}
          </div>

          {/* Miniaturas no modal */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-md overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`w-12 h-8 rounded overflow-hidden border transition-colors flex-shrink-0 ${
                    modalImageIndex === index ? 'border-white' : 'border-gray-400'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}