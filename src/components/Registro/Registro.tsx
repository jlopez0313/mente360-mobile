import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { all } from "@/services/constants";
import { Loader2, PlusCircle, User } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { z } from "zod";

import { NetworkContext } from "@/context/NetworkContext";
import { usePreferences } from "@/hooks/usePreferences";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

import { update } from "@/services/user";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const emailSchema = z
  .string()
  .trim()
  .email("Correo electrónico inválido")
  .max(255);
const nameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100);
const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(100);

const Registro = () => {
  const history = useHistory();

  const { AvatarLogo } = useContext(NetworkContext);

  const dispatch = useDispatch();
  const { keys, setPreference } = usePreferences();
  const { toast } = useToast();

  const { user } = useSelector((state: any) => state.user);
  const [usuario, setUsuario] = useState<any>({ ...user, country: "CO" });

  const fileRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState("");
  const [constants, setConstants] = useState({ eneatipos: [], generos: [] });

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");

  // Errors
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const maxDate = useMemo(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 14);
    return today.toISOString();
  }, []);

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

  const handleSetUser = (idx: string, value: string | boolean | any) => {
    usuario[idx] = value;
    setUsuario({ ...usuario });
  };

  const onUploadImage = (evt: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function (event: any) {
      handleSetUser("photo", event.target.result);
      handleSetUser("newPhoto", true);
      setPhoto(event.target.result);
    };
    reader.onerror = function () {
      // notify(t("profile.alerts.error-image"), "error");
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on mode
    let isValid = validateEmail();
    isValid = validateName() && isValid;

    if (!isValid) return;

    setIsLoading(true);

    try {
      const updatePromise = update(usuario, user.id);

      const setUserPromise = updatePromise.then(({ data }: any) => {
        return dispatch(setUser(data.data));
      });

      await Promise.all([updatePromise, setUserPromise]);

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente",
      });

      goToHome();
      
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

  const goToHome = () => {
    setTimeout(() => {
      history.replace("/onboarding");
    }, 1000);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await all();
        setConstants(data);
      } catch (error: any) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl !font-bold text-foreground">Crear cuenta</h1>
        <p className="text-muted-foreground mt-2">Completa tu perfil</p>

        <div className="relative">
          <input
            type="file"
            className="ion-hide"
            ref={fileRef}
            onChange={onUploadImage}
            accept="image/png, image/jpeg"
          />
          <img
            src={photo || AvatarLogo}
            className="w-24 h-24 rounded-full object-cover mx-auto cursor-pointer border border-primary mt-4"
            onClick={() => fileRef.current?.click()}
          />
          <PlusCircle className="absolute bottom-1 right-8 w-6 h-6 text-primary-foreground fill-primary" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {/* Name (only for register) */}
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
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Teléfono</Label>
          <div className="relative">
            <PhoneInput
              defaultCountry={usuario.country}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Teléfono"
              onChange={(e) => handleSetUser("phone", e)}
              onCountryChange={(e) => handleSetUser("country", e)}
              initialValueFormat="national"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Fecha de Nacimiento</Label>
          <div className="relative">
            <Input
              id="name"
              type="date"
              placeholder="Fecha de Nacimiento"
              value={usuario.fecha_nacimiento}
              max={maxDate}
              onChange={(e) =>
                handleSetUser("fecha_nacimiento", e.target.value?.split("T")[0])
              }
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Genero</Label>
          <div className="relative">
            <Select
              value={usuario.genero}
              onValueChange={(v) => handleSetUser("genero", v)}
            >
              <SelectTrigger className="border rounded-md px-3 py-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {constants.generos.map((item: any, idx: any) => {
                  return (
                    <SelectItem key={idx} value={item.key}>
                      {item.valor}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Crear cuenta</>
          )}
        </Button>

        <Button
          type="button"
          variant={"outline"}
          className="w-full"
          disabled={isLoading}
          onClick={goToHome}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Saltar por ahora</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Registro;
