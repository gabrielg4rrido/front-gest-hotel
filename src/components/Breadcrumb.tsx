import React from 'react';
import { Button } from './ui/button';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  page?: string;
  roomId?: number;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (page: string, roomId?: number) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate?.('home')}
        className="flex items-center gap-1 px-2 py-1 h-auto text-gray-600 hover:text-primary"
      >
        <Home className="w-4 h-4" />
        Home
      </Button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === items.length - 1 ? (
            <span className="text-primary font-medium">{item.label}</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.page && onNavigate) {
                  onNavigate(item.page, item.roomId);
                }
              }}
              className="px-2 py-1 h-auto text-gray-600 hover:text-primary"
            >
              {item.label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}