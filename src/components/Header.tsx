import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { User, LogOut, Calendar, Menu, Home, Bed, Wrench } from "lucide-react";
import { apiService, authEvents } from "../services/api";

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

export function Header({
  currentPage,
  onNavigate,
  user,
  onLogout,
}: HeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Verificar autenticação quando o componente montar e quando houver eventos
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      const userData = apiService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setCurrentUser(userData);
    };

    // Verificar imediatamente
    checkAuth();

    // Se inscrever para eventos de autenticação (login/logout)
    const unsubscribe = authEvents.subscribe(checkAuth);

    return () => {
      unsubscribe();
    };
  }, []);

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "rooms", label: "Quartos", icon: Bed },
    { id: "services", label: "Serviços", icon: Wrench },
  ];

  const userMenuItems = [
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "personal-info", label: "Informações Pessoais", icon: User },
    { id: "my-travels", label: "Minhas Viagens", icon: Calendar },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsSheetOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
    setIsSheetOpen(false);
  };

  // Usar dados do usuário do estado local se disponível, senão usar prop user
  const displayUser = currentUser
    ? {
        name: currentUser.nome,
        email: currentUser.email,
        avatar: currentUser.fotoPerfil || "",
      }
    : user;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate("home")}
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
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Show Login/Register buttons only when NOT authenticated - Desktop */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("login")}
                  className={currentPage === "login" ? "bg-secondary" : ""}
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => onNavigate("register")}
                  className={currentPage === "register" ? "bg-secondary" : ""}
                >
                  Cadastrar
                </Button>
              </div>
            )}

            {/* User Avatar - show when authenticated */}
            {isAuthenticated && displayUser && (
              <div className="hidden md:flex items-center space-x-2">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={displayUser.avatar}
                          alt={displayUser.name}
                        />
                        <AvatarFallback>
                          {displayUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{displayUser.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {displayUser.email}
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
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu - show only when authenticated */}
            {isAuthenticated && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    {displayUser && (
                      <>
                        {/* User Info in Mobile */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={displayUser.avatar}
                              alt={displayUser.name}
                            />
                            <AvatarFallback>
                              {displayUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{displayUser.name}</p>
                            <p className="text-sm text-gray-600">
                              {displayUser.email}
                            </p>
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
                            variant={
                              currentPage === item.id ? "secondary" : "ghost"
                            }
                            className="w-full justify-start"
                            onClick={() => handleNavigate(item.id)}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Logout Button */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
