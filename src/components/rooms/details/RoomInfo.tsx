import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Users, Bed, Bath, Square } from "lucide-react";

// A interface de props agora precisa receber 'name' e 'price'
interface RoomInfoProps {
  name: string;
  price: number;
  description?: string;
  area?: string;
  capacity?: number;
  beds?: string;
  bathroom?: string;
  features?: string[];
}

export function RoomInfo({
  name,
  price,
  description,
  area,
  capacity,
  beds,
  bathroom,
  features,
}: RoomInfoProps) {
  return (
    <Card className="mb-8">
      {/* SEU CÓDIGO DO CARDHEADER INSERIDO AQUI */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl">
              {name || "Nome do quarto não disponível"}
            </CardTitle>
          </div>
          <div className="text-right">
            {price ? (
              <>
                <div className="text-3xl text-primary">R$ {price}</div>
                <div className="text-sm text-gray-600">por noite</div>
              </>
            ) : (
              <div className="text-lg text-gray-500">
                Preço não disponível
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* O CONTEÚDO ORIGINAL DO ROOMINFO VEM ABAIXO */}
      <CardContent>
        {/* Descrição */}
        {description && (
          <p className="text-gray-700 mb-6">{description}</p>
        )}

        {/* Informações do quarto (Stats) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {area && (
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-gray-600" />
              <span>{area}</span>
            </div>
          )}
          {capacity && (
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span>Até {capacity} pessoas</span>
            </div>
          )}
          {beds && (
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-600" />
              <span>{beds}</span>
            </div>
          )}
          {bathroom && (
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-gray-600" />
              <span>{bathroom}</span>
            </div>
          )}
        </div>

        {/* Comodidades (Features) */}
        {features && features.length > 0 && (
          <div>
            <h3 className="text-xl mb-3">Comodidades Incluídas</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}