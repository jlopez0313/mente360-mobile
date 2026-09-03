import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccount } from "@/services/user";
import { useState } from "react";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se llama tras eliminar la cuenta con éxito: limpiar sesión y salir al login. */
  onDeleted: () => void;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  onDeleted,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setPassword("");
    setError(null);
    setLoading(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (loading) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("Ingresa tu contraseña para confirmar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteAccount(password);
      onDeleted();
    } catch (err: any) {
      if (err?.status === 422) {
        setError(err?.data?.message ?? "La contraseña no es correcta.");
      } else {
        setError(
          "No pudimos eliminar tu cuenta en este momento. Intenta de nuevo más tarde."
        );
      }
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es permanente. Se cancelará tu suscripción y se eliminará
            tu información personal, tu progreso y tu actividad. No podrás
            recuperar la cuenta.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-account-password">
            Confirma con tu contraseña
          </Label>
          <Input
            id="delete-account-password"
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={loading}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Contraseña"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? "Eliminando…" : "Eliminar cuenta"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
