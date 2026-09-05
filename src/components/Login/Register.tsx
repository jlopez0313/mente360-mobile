import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/hooks/useDexie";
import { usePreferences } from "@/hooks/usePreferences";
import { register } from "@/services/auth";
import { setUser } from "@/store/slices/userSlice";
import { FCM } from "@capacitor-community/fcm";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
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

const Register = ({ isLoading, setIsLoading, switchMode }: Props) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const { keys, setPreference } = usePreferences();
  const { toast } = useToast();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
      const { data }: any = await register({
        email,
        password,
        device: "app",
      });

      const token = await FCM.getToken();
      console.log("FCM Token:", token.token);

      data.fcm_token = token.token;

      await setPreference(keys.TOKEN, data.token);

      await db.user.put(data.user);
      dispatch(setUser(data.user));

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente",
      });

      // Va a completar el perfil; desde ahí sigue al onboarding.
      setTimeout(() => {
        history.replace("/registro");
      }, 1000);
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
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completa tus datos para registrarte"
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

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Crear cuenta</>
          )}
        </Button>
      </form>

      {/* Switch mode */}
      <p className="mt-6 text-center text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <button
          onClick={() => switchMode("login")}
          className="text-primary font-medium hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </AuthLayout>
  );
};

export default Register;
