import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft, Users, Heart, Flame } from "lucide-react";
import { RosaryIcon } from "@/components/Home/RosarioCard";
import { getRosario, avanzarRosario, unirseRosario, responderAmen, pedirOracion, Rosario } from "@/services/rosarios";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function RosarioVivo() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const [rosario, setRosario] = useState<Rosario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getRosario(id);
      if (res?.data) setRosario(res.data);
      await unirseRosario(id);
    } catch {
      // no data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const handleAvanzar = async () => {
    if (!rosario) return;
    try {
      const res = await avanzarRosario(rosario.id);
      if (res?.data) setRosario(res.data);
      toast.success("¡Has avanzado a la siguiente decena!");
    } catch {
      toast.error("No se pudo avanzar.");
    }
  };

  const handleAmen = async () => {
    try {
      if (rosario) await responderAmen(rosario.id);
      toast.success("¡Te has unido en oración! (Amén)");
    } catch { /* silent */ }
  };

  const handlePeticion = async () => {
    try {
      if (rosario) await pedirOracion(rosario.id, "Intención de oración");
      toast.success("Petición enviada al grupo");
    } catch { /* silent */ }
  };

  const decenaNombres: Record<number, string> = {
    1: "1ª decena", 2: "2ª decena", 3: "3ª decena", 4: "4ª decena", 5: "5ª decena",
  };

  if (loading) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex items-center justify-center min-h-full">
          <p className="text-muted-foreground text-sm">Cargando rosario...</p>
        </div>
      </AppLayout>
    );
  }

  if (!rosario) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex flex-col items-center justify-center min-h-full gap-4 px-8 text-center">
          <RosaryIcon className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">No se encontró el rosario.</p>
          <Button variant="outline" onClick={() => history.replace("/rosario")}>Volver</Button>
        </div>
      </AppLayout>
    );
  }

  const pct = rosario.mi_progreso?.progreso_porcentaje ?? 0;
  const decenaActual = rosario.mi_progreso?.decena_actual ?? 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <AppLayout hideNav>
      <div className="min-h-full flex flex-col bg-background pb-24">
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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <RosaryIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">{rosario.nombre}</h1>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
                    En directo
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {rosario.participantes_count || 0} rezando
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          {/* Progress Ring Card */}
          <Card className="border-border/50">
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} strokeWidth="7" stroke="hsl(var(--muted))" fill="transparent" />
                  <circle cx="50" cy="50" r={radius} strokeWidth="7"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" stroke="hsl(var(--primary))" fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{pct}%</span>
                  <span className="text-xs text-muted-foreground">completado</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-primary font-medium capitalize">Misterios {rosario.tipo_misterio}</p>
                <h2 className="text-2xl font-bold text-foreground">{decenaNombres[decenaActual] ?? `${decenaActual}ª decena`}</h2>
                <div className="flex items-center justify-center">
                  <RosaryIcon className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground">Padrenuestro / 10 Avemarías</p>
                <p className="text-xs text-muted-foreground">Meditemos el misterio y recemos con fe y devoción.</p>
              </div>
            </CardContent>
          </Card>

          {/* Participantes */}
          {rosario.participantes && rosario.participantes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Personas rezando ahora</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {rosario.participantes.slice(0, 6).map((p, i) => (
                  <Avatar key={i} className="border-2 border-background w-10 h-10">
                    <AvatarImage src="" alt={p.usuario?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {p.usuario?.name?.slice(0, 2).toUpperCase() ?? "??"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {rosario.participantes.length > 6 && (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-bold border-2 border-background">
                    +{rosario.participantes.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intención */}
          {rosario.intencion && (
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary fill-primary/30" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Intención del grupo</p>
                    <p className="font-semibold text-sm text-foreground">{rosario.intencion}</p>
                  </div>
                </div>
                <Flame className="w-5 h-5 text-primary/60 flex-shrink-0" />
              </CardContent>
            </Card>
          )}

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/50 cursor-pointer hover:shadow-md transition-shadow active:scale-95" onClick={handleAmen}>
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary fill-primary/30" />
                </div>
                <p className="font-semibold text-sm text-foreground leading-tight">Responder amén</p>
                <p className="text-xs text-muted-foreground">Me uno en oración</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 cursor-pointer hover:shadow-md transition-shadow active:scale-95" onClick={handlePeticion}>
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <RosaryIcon className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground leading-tight">Pedir oración</p>
                <p className="text-xs text-muted-foreground">El grupo orará por ti</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          {pct >= 100 ? (
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <RosaryIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-bold text-foreground">¡Rosario completado!</p>
                <p className="text-xs text-muted-foreground">Has rezado las 5 decenas. Dios te bendiga.</p>
                <Button
                  variant="outline"
                  className="w-full !rounded-xl mt-1"
                  onClick={() => history.replace('/rosario')}
                >
                  Volver a rosarios
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Button
              onClick={handleAvanzar}
              className="w-full gradient-primary text-primary-foreground !rounded-xl h-12 gap-2"
            >
              <RosaryIcon className="w-5 h-5" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold text-sm">Continuar rezando</span>
                <span className="text-[10px] opacity-90">Ir a la siguiente decena</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
