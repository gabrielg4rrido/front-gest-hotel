import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Camera, User, Loader2 } from "lucide-react";
import { apiService, RegisterData, LoginData } from "../../services/api";

interface AuthPagesProps {
  currentPage: "login" | "register";
  onNavigate: (page: string) => void;
  onLogin?: (userData: { name: string; email: string; avatar: string }) => void;
}

export function AuthPages({
  currentPage,
  onNavigate,
  onLogin,
}: AuthPagesProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nome: "",
    cpf: "",
    endereco: "",
    dataNascimento: "",
    // 1. ADICIONADO O CAMPO 'telefone' AO ESTADO INICIAL
    telefone: "",
    statusCliente: "ativo",
    fotoPerfil: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ...código existente sem alterações...
  };

  const validateForm = () => {
    if (currentPage === "login") {
      // ...código de validação de login...
    } else {
      // Validações para registro
      if (
        !formData.nome ||
        !formData.email ||
        !formData.password ||
        !formData.cpf ||
        !formData.endereco ||
        !formData.dataNascimento ||
        // 2. ADICIONADA A VALIDAÇÃO DO CAMPO 'telefone'
        !formData.telefone
      ) {
        setError("Por favor, preencha todos os campos obrigatórios");
        return false;
      }

      // ...outras validações existentes...
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (currentPage === "login") {
        // ...código de login sem alterações...
      } else {
        // Registrar novo cliente
        const registerData: RegisterData = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.password,
          cpf: formData.cpf.replace(/\D/g, ""),
          endereco: formData.endereco,
          dataNascimento: formData.dataNascimento,
          // 3. ADICIONADO O CAMPO 'telefone' AO OBJETO ENVIADO PARA A API
          telefone: formData.telefone.replace(/\D/g, ""),
          ...(formData.fotoPerfil && { fotoPerfil: formData.fotoPerfil }),
        };

        const registeredCliente = await apiService.registerCliente(registerData);
        // ...resto do código de registro e login automático...
      }
    } catch (error: any) {
      // ...código de erro sem alterações...
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPage === "login") {
    // ...JSX do formulário de login sem alterações...
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
            {/* ...código de erro e foto de perfil... */}
            
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="João Silva"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* 4. ADICIONADO O CAMPO DE INPUT PARA O TELEFONE NO FORMULÁRIO */}
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(99) 99999-9999"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                placeholder="Rua Exemplo, 123"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            {/* ...resto do formulário (Data de Nascimento, E-mail, Senha, etc.)... */}

            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) =>
                  handleInputChange("dataNascimento", e.target.value)
                }
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          {/* ...botão para navegar para o login... */}
        </CardContent>
      </Card>
    </div>
  );
}