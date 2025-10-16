import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Camera, User } from 'lucide-react';

interface AuthPagesProps {
  currentPage: 'login' | 'register';
  onNavigate: (page: string) => void;
  onLogin?: (userData: { name: string; email: string; avatar: string }) => void;
}

export function AuthPages({ currentPage, onNavigate, onLogin }: AuthPagesProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    cpf: '',
    endereco: '',
    dataNascimento: '',
    statusCliente: 'ativo',
    fotoPerfil: null as File | null
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, fotoPerfil: file }));
    
    // Criar preview da imagem
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria feita a integração com backend/Supabase
    console.log('Form submitted:', formData);
    
    // Simular login bem-sucedido
    if (currentPage === 'login' && onLogin) {
      onLogin({
        name: 'João Silva',
        email: formData.email || 'joao.silva@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
      });
    } else if (currentPage === 'register' && onLogin) {
      onLogin({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
      });
    }
    
    // Simular sucesso e navegar para home
    alert(currentPage === 'login' ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!');
    onNavigate('home');
  };

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar suas reservas
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
            
            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Não tem uma conta?
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate('register')}
                >
                  Criar Conta
                </Button>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm">
                Esqueceu sua senha?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Cadastre-se para fazer reservas e acessar ofertas exclusivas
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Foto de Perfil - Círculo no topo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <input
                  id="fotoPerfil"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="fotoPerfil"
                  className="relative block w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-4 border-gray-200 hover:border-primary transition-colors"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay com ícone de câmera no hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  placeholder="João"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  placeholder="Silva"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua Exemplo, 123"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </form>
          
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Já tem uma conta?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('login')}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}