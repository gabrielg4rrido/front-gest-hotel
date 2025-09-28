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
        <aside className="w-64 h-fit">
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
            <div className="space-y-3">
              {['dorm', 'private', 'suite'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
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
  );
}