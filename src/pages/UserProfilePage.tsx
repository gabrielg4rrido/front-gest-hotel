import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { User, Edit, Save, X, Camera, Loader2 } from "lucide-react";
import { apiService, Cliente } from "../services/api";

interface UserProfilePageProps {
  onNavigate: (page: string) => void;
}

export function UserProfilePage({ onNavigate }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<Cliente | null>(null);
  const [editedData, setEditedData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
  });

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = apiService.getCurrentUser();
        if (!currentUser || !currentUser.id) {
          setError("Usuário não autenticado");
          onNavigate("login");
          return;
        }

        const clienteData = await apiService.getCliente(currentUser.id);
        setUserData(clienteData);

        // Converter data para formato YYYY-MM-DD
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        // Preencher formulário de edição com dados atuais
        setEditedData({
          nome: clienteData.nome || "",
          email: clienteData.email || "",
          cpf: clienteData.cpf || "",
          dataNascimento: formatDateForInput(clienteData.dataNascimento),
          endereco: clienteData.endereco || "",
        });
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError(err.message || "Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [onNavigate]);

  const handleSave = async () => {
    if (!userData) return;

    try {
      setIsSaving(true);
      setError(null);

      const updatedCliente = await apiService.updateCliente(userData.id, {
        nome: editedData.nome,
        email: editedData.email,
        cpf: editedData.cpf,
        dataNascimento: editedData.dataNascimento,
        endereco: editedData.endereco,
      });

      // Converter data para formato YYYY-MM-DD
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      // Atualizar o estado com os dados retornados
      setUserData(updatedCliente);
      setEditedData({
        nome: updatedCliente.nome || "",
        email: updatedCliente.email || "",
        cpf: updatedCliente.cpf || "",
        dataNascimento: formatDateForInput(updatedCliente.dataNascimento),
        endereco: updatedCliente.endereco || "",
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Erro ao salvar dados:", err);
      setError(err.message || "Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      // Converter data para formato YYYY-MM-DD
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setEditedData({
        nome: userData.nome || "",
        email: userData.email || "",
        cpf: userData.cpf || "",
        dataNascimento: formatDateForInput(userData.dataNascimento),
        endereco: userData.endereco || "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  // Função para formatar CPF
  const formatCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Separar nome em primeiro e último nome
  const getFirstName = (fullName: string) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  const getLastName = (fullName: string) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    return parts.slice(1).join(" ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => onNavigate("home")}>
                Voltar para Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl mb-2">Meu perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Avatar e Info Básica */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage
                      src={userData.fotoPerfil || undefined}
                      alt={userData.nome}
                    />
                    <AvatarFallback className="text-2xl">
                      {getFirstName(userData.nome)[0]}
                      {getLastName(userData.nome)[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="mt-4">{userData.nome}</CardTitle>
                <p className="text-gray-600 pb-4">{userData.email}</p>
              </CardHeader>
            </Card>
          </div>

          {/* Dados Pessoais */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dados Básicos */}
                <div>
                  <h4 className="font-semibold mb-4">Dados Básicos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={isEditing ? editedData.nome : userData.nome}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            nome: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? editedData.email : userData.email}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={
                          isEditing ? editedData.cpf : formatCPF(userData.cpf)
                        }
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            cpf: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input
                        id="birthDate"
                        type={isEditing ? "date" : "text"}
                        value={
                          isEditing
                            ? editedData.dataNascimento
                            : formatDate(userData.dataNascimento)
                        }
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            dataNascimento: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Endereço */}
                <div>
                  <h4 className="font-semibold mb-4">Endereço</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={
                          isEditing ? editedData.endereco : userData.endereco
                        }
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            endereco: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Configurações de Conta */}
                <div>
                  <h4 className="font-semibold mb-4">Configurações de Conta</h4>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Alterar senha
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                    >
                      Excluir conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
