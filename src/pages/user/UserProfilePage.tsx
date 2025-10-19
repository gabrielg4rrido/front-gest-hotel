import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { User, Edit, Save, X, Camera, Loader2, Lock } from "lucide-react";
import { apiService, Cliente } from "../../services/api";

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
    telefone: "",
  });

  // Estado para o modal de alteração de senha
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // Estado para o modal de excluir conta
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
          telefone: clienteData.telefone || "",

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
        telefone: editedData.telefone.replace(/\D/g, ""),
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
        telefone: updatedCliente.telefone || "",
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
        telefone: userData.telefone || "",
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

  // Função para formatar Telefone
  const formatTelefone = (tel: string) => {
    if (!tel) return "";
    tel = tel.replace(/\D/g, "");
    if (tel.length === 11) {
      return tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    if (tel.length === 10) {
      return tel.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return tel;
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

  // Função para abrir o modal de alteração de senha
  const handleOpenPasswordModal = () => {
    setPasswordData({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });
    setPasswordError(null);
    setPasswordSuccess(false);
    setIsPasswordModalOpen(true);
  };

  // Função para fechar o modal de alteração de senha
  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  // Função para alterar a senha
  const handleChangePassword = async () => {
    if (!userData) return;

    // Validações
    if (
      !passwordData.senhaAtual ||
      !passwordData.novaSenha ||
      !passwordData.confirmarSenha
    ) {
      setPasswordError("Todos os campos são obrigatórios");
      return;
    }

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    if (passwordData.novaSenha.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError(null);

      await apiService.changePassword(userData.id, {
        senhaAtual: passwordData.senhaAtual,
        novaSenha: passwordData.novaSenha,
      });

      setPasswordSuccess(true);

      // Fechar o modal após 2 segundos
      setTimeout(() => {
        handleClosePasswordModal();
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err);
      setPasswordError(err.message || "Erro ao alterar senha");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Função para abrir o modal de excluir conta
  const handleOpenDeleteModal = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Função para fechar o modal de excluir conta
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  };

  // Função para excluir a conta
  const handleDeleteAccount = async () => {
    if (!userData) return;

    try {
      setIsDeletingAccount(true);
      setDeleteError(null);

      await apiService.deleteCliente(userData.id);

      // Fazer logout e redirecionar para home
      await apiService.logout();
      onNavigate("home");
    } catch (err: any) {
      console.error("Erro ao excluir conta:", err);
      setDeleteError(err.message || "Erro ao excluir conta");
    } finally {
      setIsDeletingAccount(false);
    }
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
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        type="tel"
                        placeholder="(99) 99999-9999"
                        value={
                          isEditing
                            ? editedData.telefone
                            : formatTelefone(userData.telefone)
                        }
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            telefone: e.target.value,
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
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleOpenPasswordModal}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Alterar senha
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleOpenDeleteModal}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Excluir conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Insira sua senha atual e a nova senha para alterar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-600 text-sm">
                Senha alterada com sucesso!
              </p>
            )}
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.senhaAtual}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    senhaAtual: e.target.value,
                  })
                }
                disabled={isChangingPassword}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.novaSenha}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    novaSenha: e.target.value,
                  })
                }
                disabled={isChangingPassword}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmarSenha}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmarSenha: e.target.value,
                  })
                }
                disabled={isChangingPassword}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClosePasswordModal}
              disabled={isChangingPassword}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Alterando...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão de Conta */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Conta</DialogTitle>
            <DialogDescription>
              Esta ação é irreversível. Todos os seus dados serão
              permanentemente excluídos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {deleteError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{deleteError}</p>
              </div>
            )}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800 text-sm font-medium mb-2">
                ⚠️ Atenção
              </p>
              <p className="text-amber-700 text-sm">
                Ao confirmar, sua conta será excluída permanentemente e você não
                poderá recuperá-la.
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Tem certeza de que deseja excluir sua conta?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDeleteModal}
              disabled={isDeletingAccount}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Conta"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
