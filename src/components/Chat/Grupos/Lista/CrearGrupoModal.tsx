import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CrearGrupoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGrupo: (grupo: { grupo: string; photo: string | null }) => Promise<void>;
}

export function CrearGrupoModal({
  open,
  onOpenChange,
  onAddGrupo,
}: CrearGrupoModalProps) {
  const [nombre, setNombre] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La imagen es demasiado grande. Máximo 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        // We might need to remove the data:image/xxx;base64, part depending on the API
        setBase64Image(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre del grupo es obligatorio");
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddGrupo({
        grupo: nombre.trim(),
        photo: base64Image,
      });
      toast.success("Grupo creado correctamente");
      setNombre("");
      setImagePreview(null);
      setBase64Image(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear grupo:", error);
      toast.error("Hubo un error al crear el grupo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Crear Nuevo Grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-primary/10 transition-all group-hover:border-primary/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <AvatarImage src={imagePreview || ""} className="object-cover" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  <Camera className="w-8 h-8 opacity-50" />
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-2 bg-primary text-primary-foreground p-2 !rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">Toca para subir una imagen</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-medium">
              Nombre del Grupo
            </Label>
            <Input
              id="nombre"
              placeholder="Ej. Equipo de Bienestar"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="!rounded-xl border-border/50 focus:border-primary/50"
              autoFocus
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-primary text-primary-foreground font-semibold !rounded-xl h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Grupo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
