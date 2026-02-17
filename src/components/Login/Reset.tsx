import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useHistory } from "react-router";
import { z } from "zod";

import { reset } from "@/services/auth";

type AuthMode = "login" | "register" | "reset";

const emailSchema = z
  .string()
  .trim()
  .email("Correo electrónico inválido")
  .max(255);
const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(100);
const nameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100);

interface Props {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const Reset = ({ isLoading, setIsLoading }: Props) => {
  const history = useHistory();

  const { toast } = useToast();

  // Form fields
  const [email, setEmail] = useState("");

  // Errors
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on mode
    let isValid = validateEmail();

    if (!isValid) return;

    setIsLoading(true);

    try {
      const {
        data: { message },
      } = await reset({ email });
      toast({
        title: "Correo enviado",
        description:
          "Revisa tu bandeja de entrada para restablecer tu contraseña",
      });

      history.replace("/login");
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img src={logo} alt="Mente 360" className="w-20 mx-auto mb-4" />
        <h1 className="text-2xl !font-bold text-foreground">
          Recuperar contraseña
        </h1>
        <p className="text-muted-foreground mt-2">
          Te enviaremos un correo para restablecer tu contraseña
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
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

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Enviar correo</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Reset;
