import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import React from 'react';

type RoomFilterSidebarProps = {
  sortBy: string;
  onSortChange: (value: string) => void;
  filterType: string[];
  onTypeChange: (type: string, checked: boolean) => void;
};

export function RoomFilterSidebar({
  sortBy,
  onSortChange,
  filterType,
  onTypeChange,
}: RoomFilterSidebarProps) {

  const getRoomTypeName = (type: string) => {
    switch (type) {
      case 'dorm':
        return 'Compartilhado';
      case 'private':
        return 'Privativo';
      case 'suite':
        return 'Suíte';
      default:
        return type;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <aside className="w-full max-w-[450px] lg:w-[200px] lg:min-w-[200px] lg:max-w-none">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort */}
          <div>
            <h4 className="mb-3">Ordenar por</h4>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="capacity">Capacidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Room Type */}
          <div>
            <h4 className="mb-3">Tipo de Quarto</h4>
            <div className="flex flex-row flex-wrap gap-1 sm:flex-col sm:gap-0 sm:space-y-3">
              {['dorm', 'private', 'suite'].map((type) => (
                <div key={type} className="flex items-center space-x-1">
                  <Checkbox
                    id={type}
                    checked={filterType.includes(type)}
                    onCheckedChange={(checked) => onTypeChange(type, checked as boolean)}
                  />
                  <label htmlFor={type} className="text-sm">
                    {getRoomTypeName(type)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>   
    </div>
        
  );
}