import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/images/logo.png";
import { useHistory } from "react-router";
import { useAuth } from "@/context/AuthContext";

//import { login, register } from "@/services/auth";

type AuthMode = "login" | "register" | "reset";

const emailSchema = z.string().trim().email("Correo electrónico inválido").max(255);
const passwordSchema = z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100);
const nameSchema = z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100);

const Login: React.FC = () => {
  const history = useHistory();
  const { login, register, resetPassword } = useAuth();

  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const validateEmail = () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setPasswordError(result.error.issues[0].message);
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateName = () => {
    const result = nameSchema.safeParse(name);
    if (!result.success) {
      setNameError(result.error.issues[0].message);
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on mode
    let isValid = validateEmail();
    if (mode !== "reset") {
      isValid = validatePassword() && isValid;
    }
    if (mode === "register") {
      isValid = validateName() && isValid;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error } = await login(email, password);
        if (error) {
          toast({
            title: "Error de inicio de sesión",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente",
          });
          history.replace("/");
        }
      } else if (mode === "register") {
        const { error } = await register(email, password, name);
        if (error) {
          toast({
            title: "Error de registro",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Cuenta creada!",
            description: "Tu cuenta ha sido creada exitosamente",
          });
          history.replace("/onboarding");
        }
      } else if (mode === "reset") {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Correo enviado",
            description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
          });
          setMode("login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setEmailError("");
    setPasswordError("");
    setNameError("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        {mode !== "login" && (
          <button
            onClick={() => switchMode("login")}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img src={logo} alt="Mente 360" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "login" && "Bienvenido"}
            {mode === "register" && "Crear cuenta"}
            {mode === "reset" && "Recuperar contraseña"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "login" && "Inicia sesión para continuar"}
            {mode === "register" && "Completa tus datos para registrarte"}
            {mode === "reset" && "Te enviaremos un correo para restablecer tu contraseña"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* Name (only for register) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={validateName}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {nameError && (
                <p className="text-sm text-destructive">{nameError}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          {/* Password (not for reset) */}
          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
          )}

          {/* Forgot password link */}
          {mode === "login" && (
            <button
              type="button"
              onClick={() => switchMode("reset")}
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === "login" && "Iniciar sesión"}
                {mode === "register" && "Crear cuenta"}
                {mode === "reset" && "Enviar correo"}
              </>
            )}
          </Button>

          {/* Demo credentials hint */}
          {mode === "login" && (
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Demo:</strong> demo@mente360.com / demo123
              </p>
            </div>
          )}
        </form>

        {/* Switch mode */}
        {mode === "login" && (
          <p className="mt-6 text-center text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => switchMode("register")}
              className="text-primary font-medium hover:underline"
            >
              Regístrate
            </button>
          </p>
        )}

        {mode === "register" && (
          <p className="mt-6 text-center text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => switchMode("login")}
              className="text-primary font-medium hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;