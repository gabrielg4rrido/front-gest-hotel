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
    statusCliente: "ativo",
    fotoPerfil: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro quando o usuário começar a digitar
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, fotoPerfil: file }));

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

  const validateForm = () => {
    if (currentPage === "login") {
      if (!formData.email || !formData.password) {
        setError("Por favor, preencha todos os campos");
        return false;
      }
    } else {
      // Validações para registro
      if (
        !formData.nome ||
        !formData.email ||
        !formData.password ||
        !formData.cpf ||
        !formData.endereco ||
        !formData.dataNascimento
      ) {
        setError("Por favor, preencha todos os campos obrigatórios");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem");
        return false;
      }

      if (formData.password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return false;
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Por favor, insira um email válido");
        return false;
      }

      // Validação básica de CPF (apenas números)
      const cpfNumbers = formData.cpf.replace(/\D/g, "");
      if (cpfNumbers.length !== 11) {
        setError("CPF deve conter 11 dígitos");
        return false;
      }
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
        const loginData: LoginData = {
          email: formData.email,
          senha: formData.password,
        };

        const response = await apiService.login(loginData);

        if (onLogin) {
          onLogin({
            name: response.usuario.nome,
            email: response.usuario.email,
            avatar:
              previewUrl ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
          });
        }

        onNavigate("home");
      } else {
        // Registrar novo cliente
        const registerData: RegisterData = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.password,
          cpf: formData.cpf.replace(/\D/g, ""),
          endereco: formData.endereco,
          dataNascimento: formData.dataNascimento,
          ...(formData.fotoPerfil && { fotoPerfil: formData.fotoPerfil }),
        };

        const registeredCliente = await apiService.registerCliente(
          registerData
        );

        // Após registrar com sucesso, fazer login automaticamente
        const loginData: LoginData = {
          email: formData.email,
          senha: formData.password,
        };

        await apiService.login(loginData);

        // Atualizar callback onLogin com dados completos do cliente registrado
        if (onLogin) {
          onLogin({
            name: registeredCliente.nome,
            email: registeredCliente.email,
            avatar:
              registeredCliente.fotoPerfil ||
              previewUrl ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
          });
        }

        onNavigate("home");
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      setError(error.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPage === "login") {
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
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">E-mail</Label>
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Não tem uma conta?</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate("register")}
                  disabled={isLoading}
                >
                  Criar Conta
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm" disabled={isLoading}>
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
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Foto de Perfil - Círculo no topo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <input
                  id="fotoPerfil"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
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
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
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

          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Já tem uma conta?</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate("login")}
                disabled={isLoading}
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
