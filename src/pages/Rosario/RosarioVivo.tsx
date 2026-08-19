import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft, Users, Heart, Flame, Search, Clock } from "lucide-react";
import { RosaryIcon } from "@/components/Home/RosarioCard";
import { getRosario, avanzarRosario, reiniciarRosario, unirseRosario, responderAmen, pedirOracion, Rosario } from "@/services/rosarios";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function RosarioVivo() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const [rosario, setRosario] = useState<Rosario | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchMember, setSearchMember] = useState("");

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

  const formatFechaHora = (fechaStr?: string) => {
    if (!fechaStr) return null;
    try {
      const date = new Date(fechaStr.replace(" ", "T"));
      if (isNaN(date.getTime())) return fechaStr;
      return date.toLocaleString("es-CO", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return fechaStr;
    }
  };

  const isProgramado = rosario ? (rosario.modalidad === "programado" || rosario.estado === "programado") : false;

  const handleAvanzar = async () => {
    if (!rosario) return;
    if (isProgramado) {
      toast.error("Este rosario está programado y aún no ha comenzado.");
      return;
    }
    try {
      const res = await avanzarRosario(rosario.id);
      if (res?.data) setRosario(res.data);
      toast.success("¡Has avanzado a la siguiente decena!");
    } catch {
      toast.error("No se pudo avanzar.");
    }
  };

  const handleReiniciar = async () => {
    if (!rosario) return;
    try {
      const res = await reiniciarRosario(rosario.id);
      if (res?.data) {
        setRosario(res.data);
      } else {
        setRosario({
          ...rosario,
          mi_progreso: { decena_actual: 1, progreso_porcentaje: 0 }
        });
      }
      toast.success("Rosario reiniciado, ¡puedes volver a rezar!");
    } catch {
      setRosario({
        ...rosario,
        mi_progreso: { decena_actual: 1, progreso_porcentaje: 0 }
      });
      toast.success("Rosario reiniciado, ¡puedes volver a rezar!");
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

  const filteredParticipantes = (rosario.participantes || []).filter(p =>
    (p.usuario?.name || "").toLowerCase().includes(searchMember.toLowerCase())
  );

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
                  {rosario.modalidad === "programado" || rosario.estado === "programado" ? (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Programado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
                      En directo
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {rosario.participantes_count || rosario.participantes?.length || 0} rezando
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

              {/* CTA */}
              {pct >= 100 ? (
                <div className="w-full flex flex-col items-center gap-3 text-center pt-3 border-t border-border/40">
                  <p className="font-bold text-foreground text-base">¡Rosario completado!</p>
                  <p className="text-xs text-muted-foreground -mt-2">Has rezado las 5 decenas. Dios te bendiga.</p>
                  <div className="w-full flex flex-col gap-2 mt-1">
                    <Button
                      onClick={handleReiniciar}
                      className="w-full gradient-primary text-primary-foreground !rounded-xl h-11 gap-2 font-bold"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reiniciar rosario
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full !rounded-xl h-10 font-semibold text-xs"
                      onClick={() => history.replace('/rosario')}
                    >
                      Volver a rosarios
                    </Button>
                  </div>
                </div>
              ) : isProgramado ? (
                <Button
                  disabled
                  className="w-full bg-muted/80 text-muted-foreground !rounded-xl h-12 gap-2 mt-1 cursor-not-allowed border border-border/50 opacity-90"
                >
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="flex flex-col text-left leading-tight min-w-0">
                    <span className="font-bold text-sm text-foreground">Evento programado</span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {rosario.fecha_hora ? `Disponible: ${formatFechaHora(rosario.fecha_hora)}` : "El evento aún no ha comenzado"}
                    </span>
                  </div>
                </Button>
              ) : (
                <Button
                  onClick={handleAvanzar}
                  className="w-full gradient-primary text-primary-foreground !rounded-xl h-12 gap-2 mt-1"
                >
                  <RosaryIcon className="w-5 h-5" />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-bold text-sm">Continuar rezando</span>
                    <span className="text-[10px] opacity-90">Ir a la siguiente decena</span>
                  </div>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Participantes */}
          {rosario.participantes && rosario.participantes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Personas rezando ahora</h3>
                <button
                  type="button"
                  onClick={() => setShowMembersModal(true)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Ver todos ({rosario.participantes.length})
                </button>
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
                  <button
                    type="button"
                    onClick={() => setShowMembersModal(true)}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-bold border-2 border-background hover:bg-muted/80 transition-colors"
                  >
                    +{rosario.participantes.length - 6}
                  </button>
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
        </div>
      </div>

      {/* Sheet Modal para ver todos los participantes */}
      <Sheet open={showMembersModal} onOpenChange={setShowMembersModal}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] flex flex-col p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/50">
            <SheetTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Personas rezando ({rosario.participantes?.length || 0})
            </SheetTitle>
          </SheetHeader>

          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar participante..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {filteredParticipantes.length === 0 ? (
              <p className="text-center py-6 text-xs text-muted-foreground">No se encontraron participantes</p>
            ) : (
              filteredParticipantes.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" alt={p.usuario?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {p.usuario?.name?.slice(0, 2).toUpperCase() ?? "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.usuario?.name || "Usuario"}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.usuario?.email || "Unido en oración"}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="Rezando ahora" />
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
