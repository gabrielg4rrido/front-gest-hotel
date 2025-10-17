const API_BASE_URL = "http://localhost:3001";

type AuthListener = () => void;

class AuthEventEmitter {
  private listeners: AuthListener[] = [];

  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    // Retorna função para cancelar a inscrição
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const authEvents = new AuthEventEmitter();

// Tipos para as respostas da API
export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  endereco: string;
  dataNascimento: string;
  fotoPerfil?: File;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  endereco: string;
  dataNascimento: string;
  statusCliente: string;
  fotoPerfil?: string;
  createdAt: string;
  updatedAt: string;
}

// Gerenciamento de tokens
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_DATA_KEY = "userData";

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    authEvents.emit();
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getUserData(): any {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUserData(userData: any): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    authEvents.emit();
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    authEvents.emit();
  }
}

// Função para fazer requisições com retry automático para renovação de token
async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = TokenManager.getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Se o token expirou, tentar renovar
  if (response.status === 401 && token) {
    const refreshToken = TokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          TokenManager.setAccessToken(refreshData.accessToken);

          // Tentar a requisição original novamente
          headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
          });
        } else {
          // Se não conseguir renovar, fazer logout
          TokenManager.clearTokens();
          window.location.href = "/login";
        }
      } catch (error) {
        TokenManager.clearTokens();
        window.location.href = "/login";
      }
    }
  }

  return response;
}

// Serviços da API
export const apiService = {
  // Registrar novo cliente
  async registerCliente(data: RegisterData): Promise<Cliente> {
    // Se houver foto de perfil, usar FormData
    if (data.fotoPerfil) {
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("email", data.email);
      formData.append("senha", data.senha);
      formData.append("cpf", data.cpf);
      formData.append("endereco", data.endereco);
      formData.append("dataNascimento", data.dataNascimento);
      formData.append("fotoPerfil", data.fotoPerfil);

      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: "POST",
        body: formData,
        // Não definir Content-Type - o browser define automaticamente com boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao registrar cliente");
      }

      return response.json();
    }

    // Se não houver foto, usar JSON normal
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: data.cpf,
        endereco: data.endereco,
        dataNascimento: data.dataNascimento,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao registrar cliente");
    }

    return response.json();
  },

  // Fazer login
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao fazer login");
    }

    const loginResponse: LoginResponse = await response.json();

    // Salvar tokens e dados do usuário
    TokenManager.setAccessToken(loginResponse.accessToken);
    TokenManager.setRefreshToken(loginResponse.refreshToken);
    TokenManager.setUserData(loginResponse.usuario);

    return loginResponse;
  },

  // Fazer logout
  async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();

    if (refreshToken) {
      try {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Erro ao fazer logout no servidor:", error);
      }
    }

    TokenManager.clearTokens();
  },

  // Obter dados do cliente
  async getCliente(id: string): Promise<Cliente> {
    const response = await apiRequest(`/clientes/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao obter dados do cliente");
    }

    return response.json();
  },

  // Atualizar dados do cliente
  async updateCliente(
    id: string,
    data: Partial<RegisterData>
  ): Promise<Cliente> {
    const response = await apiRequest(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erro ao atualizar dados do cliente"
      );
    }

    return response.json();
  },

  // Renovar token
  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token não encontrado");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      TokenManager.clearTokens();
      throw new Error("Erro ao renovar token");
    }

    const data = await response.json();
    TokenManager.setAccessToken(data.accessToken);

    return data;
  },

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!TokenManager.getAccessToken();
  },

  // Obter dados do usuário logado
  getCurrentUser(): any {
    return TokenManager.getUserData();
  },
};

export { TokenManager };
