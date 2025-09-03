const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class AuthService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    this.user = this.getStoredUser();
  }

  // Login global (desde landing)
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error de autenticación");
      }

      this.setAuthData(data);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  }

  // Login por tenant (desde subdominio)
  async tenantLogin(email, password, subdomain) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/tenant-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, subdomain }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error de autenticación");
      }

      this.setAuthData(data);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Tenant login error:", error);
      return { success: false, error: error.message };
    }
  }

  // Logout
  async logout() {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar contraseña");
      }

      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, error: error.message };
    }
  }

  // Resetear contraseña
  async resetPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al resetear contraseña");
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: error.message };
    }
  }

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      if (!this.token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuthData();
          return null;
        }
        throw new Error("Error al obtener usuario actual");
      }

      const user = await response.json();
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Obtener token
  getToken() {
    return this.token;
  }

  // Obtener usuario
  getUser() {
    return this.user;
  }

  // Verificar si es admin
  isAdmin() {
    return this.user?.role === "ADMIN";
  }

  // Verificar si pertenece a un tenant específico
  belongsToTenant(subdomain) {
    return this.user?.tenantSubdomain === subdomain;
  }

  // Configurar datos de autenticación
  setAuthData(data) {
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.user = data.user;

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  // Limpiar datos de autenticación
  clearAuthData() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  // Obtener usuario almacenado
  getStoredUser() {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  }

  // Interceptor para requests autenticados
  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

// Crear instancia singleton
const authService = new AuthService();

export default authService;
