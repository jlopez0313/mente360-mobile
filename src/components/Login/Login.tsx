import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/hooks/useDexie";
import { usePreferences } from "@/hooks/usePreferences";
import { login } from "@/services/auth";
import { setUser } from "@/store/slices/userSlice";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Correo electrónico inválido")
  .max(255);
const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(100);

interface Props {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  switchMode: (mode: "login" | "register" | "reset") => void;
}

const Login = ({ isLoading, setIsLoading, switchMode }: Props) => {
  const dispatch = useDispatch();
  const { keys, setPreference } = usePreferences();

  const { toast } = useToast();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on mode
    let isValid = validateEmail();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const { data } = await login({
        email,
        password,
        device: "app",
      });

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });

      await setPreference(keys.TOKEN, data.token);

      await db.user.put(data.user);
      dispatch(setUser(data.user));

      history.replace("/home");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Error Interno al enviar correo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="p-4"></header>

      {/* Content */}
      <AuthLayout
        title={`Bienvenido a ${import.meta.env.VITE_NAME}`}
        subtitle="Inicia sesión para continuar"
      >
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Correo electrónico</Label>
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
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Contraseña</Label>
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

          {/* Forgot password link */}
          <button
            type="button"
            onClick={() => switchMode("reset")}
            className="text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Iniciar sesión</>
            )}
          </Button>
        </form>

        {/* Switch mode */}
        <p className="mt-6 text-center text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => switchMode("register")}
            className="text-primary font-medium hover:underline"
          >
            Regístrate
          </button>
        </p>
      </AuthLayout>
    </>
  );
};

export default Login;
