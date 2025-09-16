import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { User, LogOut, Calendar, Menu, Home, Bed, Wrench } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, user, onLogout }: HeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rooms', label: 'Quartos', icon: Bed },
    { id: 'services', label: 'Serviços', icon: Wrench },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'personal-info', label: 'Informações Pessoais', icon: User },
    { id: 'my-travels', label: 'Minhas Viagens', icon: Calendar },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsSheetOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsSheetOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Hotel Carioca Palace
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 transition-colors ${
                  currentPage === item.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Always show Login/Register buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('login')}
                className={currentPage === 'login' ? 'bg-secondary' : ''}
              >
                Entrar
              </Button>
              <Button
                onClick={() => onNavigate('register')}
                className={currentPage === 'register' ? 'bg-secondary' : ''}
              >
                Cadastrar
              </Button>
            </div>

            {/* User Avatar and Hamburger Menu */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
                
                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          className="cursor-pointer"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {user && (
                    <>
                      {/* User Info in Mobile */}
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* User Menu Items */}
                      <div className="space-y-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Button
                              key={item.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleNavigate(item.id)}
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <div className="border-t pt-4"></div>
                    </>
                  )}

                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant={currentPage === item.id ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigate(item.id)}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>

                  {!user && (
                    <>
                      <div className="border-t pt-4 space-y-2">
                        <Button
                          variant={currentPage === 'login' ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigate('login')}
                        >
                          Entrar
                        </Button>
                        <Button
                          variant={currentPage === 'register' ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigate('register')}
                        >
                          Cadastrar
                        </Button>
                      </div>
                    </>
                  )}

                  {user && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}