import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Plus } from 'lucide-react';

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

interface AdditionalServicesProps {
  additionalServices: AdditionalService[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
}

export function AdditionalServices({ 
  additionalServices, 
  selectedServices, 
  onServiceToggle 
}: AdditionalServicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Serviços Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Aproveite ao máximo sua estadia com nossos serviços exclusivos
        </p>
        
        <div className="space-y-4">
          {additionalServices.map((service) => (
            <div key={service.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <Checkbox
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => onServiceToggle(service.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{service.icon}</span>
                  <Label htmlFor={service.id} className="cursor-pointer font-medium">
                    {service.name}
                  </Label>
                  {service.price > 0 && (
                    <span className="ml-auto font-semibold text-primary">
                      R$ {service.price.toFixed(2)}
                    </span>
                  )}
                  {service.price === 0 && (
                    <span className="ml-auto text-green-600 font-semibold text-sm">
                      Incluso
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedServices.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Serviços selecionados:</h4>
            <div className="space-y-1">
              {selectedServices.map(serviceId => {
                const service = additionalServices.find(s => s.id === serviceId);
                return service ? (
                  <div key={serviceId} className="flex justify-between text-sm">
                    <span>{service.icon} {service.name}</span>
                    <span className="font-medium">
                      {service.price > 0 ? `R$ ${service.price.toFixed(2)}` : 'Incluso'}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}