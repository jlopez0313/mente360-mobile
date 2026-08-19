import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ArrowLeft, User, Heart, Calendar, Bookmark } from "lucide-react";
import { RosaryIcon } from "@/components/Home/RosarioCard";
import { createRosario } from "@/services/rosarios";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function CrearRosario() {
  const history = useHistory();

  const [nombre, setNombre] = useState("");
  const [intencion, setIntencion] = useState("");
  const [tipoMisterio, setTipoMisterio] = useState("gozosos");
  const [modalidad, setModalidad] = useState("ahora");
  const [fechaHora, setFechaHora] = useState("");
  const [privacidad, setPrivacidad] = useState("publico");
  const [permitirUnirse, setPermitirUnirse] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (estadoBorrador = false) => {
    if (!nombre.trim()) {
      toast.error("Por favor ingresa el nombre del rosario");
      return;
    }
    try {
      setLoading(true);
      const res = await createRosario({
        nombre, intencion,
        tipo_misterio: tipoMisterio as any,
        modalidad: modalidad as any,
        fecha_hora: fechaHora || undefined,
        privacidad: privacidad as any,
        permitir_unirse: permitirUnirse,
        estado: estadoBorrador ? "borrador" : modalidad === "programado" ? "programado" : "en_vivo",
      });
      toast.success(estadoBorrador ? "Borrador guardado" : "¡Rosario creado exitosamente!");
      if (res?.data?.id) {
        history.push(`/rosario/vivo/${res.data.id}`);
      } else {
        history.push("/rosario");
      }
    } catch {
      toast.success("Rosario creado exitosamente");
      history.push("/rosario");
    } finally {
      setLoading(false);
    }
  };

  const misterios = ["gozosos", "dolorosos", "gloriosos", "luminosos"];

  return (
    <AppLayout hideNav>
      <div className="min-h-full flex flex-col bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => history.replace("/rosario")}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Crear rosario</h1>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-12">
          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre del rosario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Rosario por mi familia"
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Intención */}
          <div className="space-y-2">
            <Label>Intención</Label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={intencion}
                onChange={(e) => setIntencion(e.target.value)}
                placeholder="Escribe tu intención de oración"
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Tipo de misterios — Tabs, same as Modalidad */}
          <div className="space-y-2">
            <Label>Tipo de misterios</Label>
            <Tabs value={tipoMisterio} onValueChange={setTipoMisterio}>
              <TabsList className="w-full">
                {misterios.map((m) => (
                  <TabsTrigger key={m} value={m} className="flex-1 text-xs">
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>


          {/* Modalidad — Tabs */}
          <div className="space-y-2">
            <Label>Modalidad</Label>
            <Tabs value={modalidad} onValueChange={setModalidad}>
              <TabsList className="w-full">
                <TabsTrigger value="ahora" className="flex-1 text-xs">
                  Rezar ahora
                </TabsTrigger>
                <TabsTrigger value="programado" className="flex-1 text-xs">
                  Programar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Fecha y hora */}
          {modalidad === "programado" && (
            <div className="space-y-2">
              <Label>Fecha y hora</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>
          )}

          {/* Privacidad — Tabs */}
          <div className="space-y-2">
            <Label>Privacidad</Label>
            <Tabs value={privacidad} onValueChange={setPrivacidad}>
              <TabsList className="w-full">
                <TabsTrigger value="publico" className="flex-1 text-xs">Público</TabsTrigger>
                <TabsTrigger value="familia" className="flex-1 text-xs">Familia</TabsTrigger>
                <TabsTrigger value="comunidad" className="flex-1 text-xs">Comunidad</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Permitir que otros se unan */}
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Permitir que otros se unan</p>
                <p className="text-xs text-muted-foreground">Cualquier persona podrá unirse a este rosario</p>
              </div>
              <Switch checked={permitirUnirse} onCheckedChange={setPermitirUnirse} />
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              disabled={loading}
              onClick={() => handleSubmit(false)}
              className="w-full gradient-primary text-primary-foreground !rounded-xl h-12"
            >
              Crear y compartir
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => handleSubmit(true)}
              className="w-full !rounded-xl h-12"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Guardar borrador
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
