import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/hooks/useDexie";
import { ArrowLeft, User, Heart, Calendar, Bookmark, Crown, Check } from "lucide-react";
import { createRosario } from "@/services/rosarios";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CrearRosario() {
  const history = useHistory();
  const { user } = useSelector((state: any) => state.user);

  const comunidadesList = useLiveQuery(() => db.comunidades.toArray(), []);

  const [nombre, setNombre] = useState("");
  const [intencion, setIntencion] = useState("");
  const [tipoMisterio, setTipoMisterio] = useState("gozosos");
  const [modalidad, setModalidad] = useState("ahora");
  const [fechaHora, setFechaHora] = useState("");
  const [privacidad, setPrivacidad] = useState<"publico" | "comunidad">("publico");
  const [selectedComunidades, setSelectedComunidades] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleComunidad = (id: number) => {
    if (selectedComunidades.includes(id)) {
      setSelectedComunidades(selectedComunidades.filter((cId) => cId !== id));
    } else {
      setSelectedComunidades([...selectedComunidades, id]);
    }
  };

  const handleSubmit = async (estadoBorrador = false) => {
    if (!nombre.trim()) {
      toast.error("Por favor ingresa el nombre del rosario");
      return;
    }

    if (privacidad === "comunidad" && selectedComunidades.length === 0) {
      toast.error("Por favor selecciona al menos una comunidad");
      return;
    }

    try {
      setLoading(true);
      const res = await createRosario({
        nombre,
        intencion,
        tipo_misterio: tipoMisterio as any,
        modalidad: modalidad as any,
        fecha_hora: fechaHora || undefined,
        privacidad,
        comunidad_ids: privacidad === "comunidad" ? selectedComunidades : [],
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
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-top px-4 py-4">
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

          {/* Tipo de misterios */}
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

          {/* Modalidad */}
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

          {/* Privacidad — Tabs: Público y Comunidad */}
          <div className="space-y-2">
            <Label>Privacidad</Label>
            <Tabs value={privacidad} onValueChange={(val: any) => setPrivacidad(val)}>
              <TabsList className="w-full">
                <TabsTrigger value="publico" className="flex-1 text-xs">Público</TabsTrigger>
                <TabsTrigger value="comunidad" className="flex-1 text-xs">Comunidad</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Selección de Comunidades cuando Privacidad es Comunidad */}
          {privacidad === "comunidad" && (
            <div className="space-y-3">
              <Label>Selecciona las comunidades</Label>
              {!comunidadesList || comunidadesList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No perteneces a ninguna comunidad actualmente.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {comunidadesList.map((c) => {
                    const isSelected = selectedComunidades.includes(c.id);
                    const esLider = c.lider?.id === user?.id || (user && c.lider?.email === user?.email);

                    return (
                      <Card
                        key={c.id}
                        onClick={() => toggleComunidad(c.id)}
                        className={cn(
                          "cursor-pointer border transition-all active:scale-[0.99]",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border/60 bg-card hover:bg-muted/50"
                        )}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors",
                                isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                              )}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm text-foreground truncate">{c.comunidad}</p>
                                {esLider && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    Líder
                                  </span>
                                )}
                              </div>
                              {c.descripcion && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.descripcion}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              disabled={loading}
              onClick={() => handleSubmit(false)}
              className="w-full gradient-primary text-primary-foreground !rounded-xl h-12 font-bold"
            >
              Crear y compartir
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => handleSubmit(true)}
              className="w-full !rounded-xl h-12 font-semibold"
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
