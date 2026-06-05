<template>
  <main class="login-container login-body">
    <div class="login-box">
      <div class="login-header">
        <h1 class="logo">
          <span class="logo-icon">●</span> JobBoost
        </h1>
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresa a tu cuenta para continuar</p>
      </div>

      <form class="login-form" @submit.prevent="iniciarSesion">
        <div class="input-group">
          <label for="email">
            <i class="fa-solid fa-envelope"></i>
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">
            <i class="fa-solid fa-lock"></i>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" id="btn-login" class="btn-primary">
          <span>Iniciar Sesión</span>
          <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </button>
      </form>

      <footer class="login-footer">
        <p>
          ¿No tienes cuenta?
          <router-link to="/registro" class="link">Regístrate aquí</router-link>
        </p>
        <p>
          <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Estas variables guardarán automáticamente lo que el usuario escriba
const email = ref("");
const password = ref("");

const router = useRouter();

// Esta función se ejecuta al hacer clic en "Entrar"
const iniciarSesion = async () => {
  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        contrasenia: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en credenciales");
    }

    // Guardamos la información del usuario en localStorage
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    localStorage.setItem("currentUser", JSON.stringify(data.usuario));
    // Limpiar cache de id_empresa anterior para que se resuelva dinámicamente
    localStorage.removeItem("id_empresa");

    // Redirigir según el rol del usuario
    const rol = (data.usuario.rol || "").toLowerCase();
    const userEmail = (
      data.usuario.correo ||
      data.usuario.email ||
      ""
    ).toLowerCase();

    if (rol === "admin" || userEmail === "gestor@jobboost.com") {
      router.push("/admin");
    } else if (rol === "empresa" || userEmail.endsWith("@empresas.com")) {
      // Pre-resolver id_empresa antes de redirigir
      try {
        const resEmpresas = await fetch("http://localhost:3000/empresas");
        if (resEmpresas.ok) {
          const empresas = await resEmpresas.json();
          const userName = (data.usuario.nombre || "").trim().toLowerCase();
          let empresa = empresas.find(
            (e) => e.nombre.trim().toLowerCase() === userName
          );
          if (!empresa) {
            empresa = empresas.find(
              (e) =>
                e.nombre.trim().toLowerCase().includes(userName) ||
                userName.includes(e.nombre.trim().toLowerCase())
            );
          }
          if (empresa) {
            localStorage.setItem("id_empresa", empresa.id_empresa.toString());
          }
        }
      } catch (e) {
        console.error("Error resolviendo empresa en login:", e);
      }
      router.push("/empresa");
    } else {
      router.push("/inicio");
    }
  } catch (err) {
    alert("Error al iniciar sesión: " + err.message);
  }
};
</script>

<style scoped>
/* Reset y estilos base */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-box {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-size: 32px;
  margin-right: 5px;
}

.login-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-bottom: 25px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.input-group label i {
  margin-right: 8px;
  color: #667eea;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-group input::placeholder {
  color: #b0b3b8;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.login-footer {
  text-align: center;
  margin-top: 25px;
}

.login-footer p {
  margin: 12px 0;
  font-size: 14px;
  color: #666;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.forgot-password {
  font-size: 13px;
  color: #999;
}

.forgot-password:hover {
  color: #667eea;
}

/* Responsive */
@media (max-width: 480px) {
  .login-box {
    margin: 20px;
    padding: 30px 20px;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
}
</style>