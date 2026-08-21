import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft, Users, Heart, Flame, Search, RotateCcw, Check } from "lucide-react";
import { RosaryIcon } from "@/components/Home/RosarioCard";
import {
  getRosario,
  avanzarRosario,
  reiniciarRosario,
  unirseRosario,
  responderAmen,
  pedirOracion,
  Rosario,
} from "@/services/rosarios";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { rtDatabase } from "@/firebase/config";
import { ref, onValue } from "firebase/database";

export default function RosarioVivo() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const [rosario, setRosario] = useState<Rosario | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showPeticionModal, setShowPeticionModal] = useState(false);
  const [searchMember, setSearchMember] = useState("");

  // Form state for Pedir oración
  const [intencion, setIntencion] = useState("");
  const [detalle, setDetalle] = useState("");
  const [compartir, setCompartir] = useState(true);
  const [submittingPeticion, setSubmittingPeticion] = useState(false);

  const fetchDetail = async (isSilent = false) => {
    if (!id) return;
    if (!isSilent) setLoading(true);
    try {
      const res = await getRosario(id);
      if (res?.data) {
        setRosario(res.data);
      }
    } catch {
      // Keep state if fetch error
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    if (id) {
      unirseRosario(id).catch(() => {});
    }

    // Firebase Realtime DB Listener: updates live feed and status in real-time across devices
    if (id && rtDatabase) {
      const rosarioRef = ref(rtDatabase, `rosarios/${id}`);
      const unsubscribe = onValue(
        rosarioRef,
        (snapshot) => {
          if (snapshot.exists()) {
            fetchDetail(true);
          }
        },
        (error) => {
          console.warn("Firebase realtime error:", error);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [id]);

  const handleAvanzar = async () => {
    if (!rosario) return;
    try {
      const res = await avanzarRosario(rosario.id);
      if (res?.data) {
        setRosario(res.data);
      } else {
        setRosario((prev) => {
          if (!prev) return null;
          const currentPct = prev.mi_progreso?.progreso_porcentaje ?? 0;
          const nextPct = Math.min(currentPct + 20, 100);
          const nextDecena = Math.min(Math.floor(nextPct / 20) + (nextPct % 20 > 0 ? 1 : 0), 5);
          return {
            ...prev,
            mi_progreso: {
              progreso_porcentaje: nextPct,
              decena_actual: nextDecena || 1,
            },
          };
        });
      }
      toast.success("¡Has avanzado en la oración!");
      fetchDetail(true);
    } catch {
      setRosario((prev) => {
        if (!prev) return null;
        const currentPct = prev.mi_progreso?.progreso_porcentaje ?? 0;
        const nextPct = Math.min(currentPct + 20, 100);
        const nextDecena = Math.min(Math.floor(nextPct / 20) + (nextPct % 20 > 0 ? 1 : 0), 5);
        return {
          ...prev,
          mi_progreso: {
            progreso_porcentaje: nextPct,
            decena_actual: nextDecena || 1,
          },
        };
      });
      toast.success("¡Has avanzado en la oración!");
    }
  };

  const handleReiniciar = async () => {
    if (!rosario) return;
    try {
      const res = await reiniciarRosario(rosario.id);
      if (res?.data) {
        setRosario(res.data);
      } else {
        setRosario((prev) =>
          prev ? { ...prev, mi_progreso: { decena_actual: 1, progreso_porcentaje: 0 } } : null
        );
      }
      toast.success("Rosario reiniciado, ¡puedes volver a rezar!");
      fetchDetail(true);
    } catch {
      setRosario((prev) =>
        prev ? { ...prev, mi_progreso: { decena_actual: 1, progreso_porcentaje: 0 } } : null
      );
      toast.success("Rosario reiniciado!");
    }
  };

  const handleAmen = async (peticionId?: number) => {
    if (!rosario) return;
    try {
      await responderAmen(rosario.id, peticionId);
      toast.success("❤️ Te has unido en oración (Amén)");
      fetchDetail(true);
    } catch {
      toast.success("❤️ Te has unido en oración");
    }
  };

  const handleEnviarPeticion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intencion.trim()) {
      toast.error("Por favor escribe tu intención.");
      return;
    }
    if (!rosario) return;

    setSubmittingPeticion(true);
    try {
      await pedirOracion(rosario.id, intencion.trim(), detalle.trim() || undefined);
      toast.success("Petición de oración compartida con el grupo");
      setIntencion("");
      setDetalle("");
      setShowPeticionModal(false);
      fetchDetail(true);
    } catch {
      toast.error("No se pudo enviar la petición. Intenta nuevamente.");
    } finally {
      setSubmittingPeticion(false);
    }
  };

  // Helper for human readable relative time
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "hace un momento";
    try {
      const date = new Date(dateStr.replace(" ", "T"));
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return "hace 1 min";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `hace ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `hace ${diffHours} h`;
      return `hace ${Math.floor(diffHours / 24)} d`;
    } catch {
      return "hace un momento";
    }
  };

  const getDecenaLabel = (pct: number, decenaActual?: number) => {
    const labels = [
      "Primera decena",
      "Segunda decena",
      "Tercera decena",
      "Cuarta decena",
      "Quinta decena",
    ];
    if (decenaActual && decenaActual >= 1 && decenaActual <= 5) {
      return labels[decenaActual - 1];
    }
    if (pct <= 20) return labels[0];
    if (pct <= 40) return labels[1];
    if (pct <= 60) return labels[2];
    if (pct <= 80) return labels[3];
    return labels[4];
  };

  if (loading && !rosario) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex items-center justify-center min-h-full">
          <p className="text-muted-foreground text-sm font-medium">Cargando rosario...</p>
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
          <Button variant="outline" onClick={() => history.replace("/rosario")}>
            Volver a rosarios
          </Button>
        </div>
      </AppLayout>
    );
  }

  const interacciones = rosario.interacciones || [];
  const peticiones = interacciones.filter((i) => i.tipo === "peticion");
  const amens = interacciones.filter((i) => i.tipo === "amen");

  const amenCountsByPeticion: Record<number, number> = {};
  let generalAmensCount = 0;

  amens.forEach((a) => {
    if (a.peticion_id) {
      amenCountsByPeticion[a.peticion_id] = (amenCountsByPeticion[a.peticion_id] || 0) + 1;
    } else {
      generalAmensCount++;
    }
  });

  const pct = rosario.mi_progreso?.progreso_porcentaje ?? 0;
  const isCompletado = pct >= 100;

  return (
    <AppLayout hideNav>
      <div className="h-full flex flex-col bg-background">
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3.5 safe-top">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => history.replace("/rosario")}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <RosaryIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-foreground truncate">{rosario.nombre}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    En directo
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {rosario.participantes_count || rosario.participantes?.length || 1} rezando
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="px-4 pt-5 pb-8 space-y-4 max-w-lg mx-auto w-full">
          {/* Rosario Progress Card */}
          <Card className="border-border/50 shadow-xs">
            <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[#349887]">
                ♀
              </div>

              <div>
                <h2 className="text-base font-bold text-foreground">
                  Padrenuestro / 10 Avemarías
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Meditemos el misterio y recemos con fe y devoción.
                </p>
              </div>

              {isCompletado ? (
                <div className="w-full my-1 pt-3 pb-2 border-t border-border/40 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-foreground">
                    ¡Rosario completado!
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Has rezado las 5 decenas. Dios te bendiga.
                  </p>
                </div>
              ) : (
                <div className="w-full py-2 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-muted/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-border/30">
                    <div
                      className="bg-primary h-full transition-all duration-500 ease-out rounded-full shadow-xs"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {getDecenaLabel(pct, rosario.mi_progreso?.decena_actual)}
                  </span>
                </div>
              )}

              <div className="w-full flex flex-col gap-2 mt-1">
                <Button
                  onClick={isCompletado ? handleReiniciar : handleAvanzar}
                  className="w-full gradient-primary text-primary-foreground !rounded-xl h-11 gap-2 font-bold shadow-xs"
                >
                  {isCompletado ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Reiniciar rosario
                    </>
                  ) : (
                    <>
                      <RosaryIcon className="w-4 h-4 text-primary-foreground fill-current" />
                      {pct === 0 ? "Iniciar rosario" : "Continuar rezando"}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full !rounded-xl h-10 font-semibold text-xs border-border/60"
                  onClick={() => history.replace("/rosario")}
                >
                  Volver a rosarios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personas rezando ahora */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">
                Personas rezando ahora
              </h3>
              <button
                type="button"
                onClick={() => setShowMembersModal(true)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Ver todos ({rosario.participantes?.length || 1})
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {rosario.participantes && rosario.participantes.length > 0 ? (
                rosario.participantes.map((p, i) => (
                  <Avatar key={i} className="w-10 h-10 border-2 border-background shadow-2xs">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {p.usuario?.name?.slice(0, 2).toUpperCase() ?? "RO"}
                    </AvatarFallback>
                  </Avatar>
                ))
              ) : (
                <Avatar className="w-10 h-10 border-2 border-background shadow-2xs">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    RO
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>

          {/* Intención del grupo */}
          {rosario.intencion && (
            <Card className="border-border/50 shadow-xs">
              <CardContent className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 fill-primary/30" />
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

          {/* Action Row: Responder Amén & Pedir Oración */}
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="border-border/50 shadow-xs cursor-pointer hover:border-primary/40 transition-all active:scale-[0.98]"
              onClick={() => handleAmen()}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-primary/30" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground leading-tight">Responder amén</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Me uno en oración</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-border/50 shadow-xs cursor-pointer hover:border-primary/40 transition-all active:scale-[0.98]"
              onClick={() => setShowPeticionModal(true)}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  ♀
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground leading-tight">Pedir oración</p>
                  <p className="text-xs text-muted-foreground mt-0.5">El grupo orará por ti</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actividad del grupo Section */}
          <div className="space-y-2.5 pt-2">
            <div>
              <h3 className="font-bold text-base text-foreground">Actividad del grupo</h3>
              <p className="text-xs text-muted-foreground">
                Aquí aparecen las respuestas y solicitudes del grupo
              </p>
            </div>

            <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {/* Aggregated Grouped Améns for general group intention - UNIONES FIRST */}
              {generalAmensCount > 0 && (
                <Card className="border-rose-500/20 bg-rose-500/5 shadow-xs">
                  <CardContent className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 fill-rose-500/30" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-rose-800 dark:text-rose-200">
                          ❤️ {generalAmensCount} {generalAmensCount === 1 ? "persona se unió" : "personas se unieron"} en oración
                        </p>
                        <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
                          {rosario.intencion ? `Por: ${rosario.intencion}` : "Por la intención del grupo"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary flex-shrink-0">reciente</span>
                  </CardContent>
                </Card>
              )}

              {/* Independent Prayer Requests (Peticiones) */}
              {peticiones.map((peticion) => {
                const totalAmens = (amenCountsByPeticion[peticion.id] || 0) + (peticion.amens_count || 0);
                const userName = peticion.usuario?.name || "Ana";

                return (
                  <Card key={peticion.id} className="border-border/50 shadow-xs">
                    <CardContent className="p-3.5 flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                            🙏
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{userName} pidió oración</p>
                            <p className="text-xs text-muted-foreground font-medium">{peticion.mensaje}</p>
                            {peticion.detalle && (
                              <p className="text-[11px] text-muted-foreground/80 italic mt-0.5">
                                {peticion.detalle}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-primary flex-shrink-0">
                          {formatTimeAgo(peticion.created_at)}
                        </span>
                      </div>

                      {/* Aggregated Amén responses for this petition */}
                      {totalAmens > 0 && (
                        <div className="mt-1 pt-2 border-t border-border/40 flex items-center justify-between text-xs bg-rose-500/10 p-2 rounded-xl text-rose-700 dark:text-rose-300">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <span>❤️</span>
                            <span>
                              {totalAmens} {totalAmens === 1 ? "persona se unió" : "personas se unieron"} en oración
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAmen(peticion.id)}
                            className="text-[11px] font-bold text-primary hover:underline"
                          >
                            + Me uno
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {peticiones.length === 0 && generalAmensCount === 0 && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center text-xs text-muted-foreground italic">
                  Aún no hay peticiones de oración ni respuestas en este grupo.
                </div>
              )}
            </div>
          </div>
          </div>
        </div>


      </div>

      {/* Sheet Modal: Pedir oración */}
      <Sheet open={showPeticionModal} onOpenChange={setShowPeticionModal}>
        <SheetContent
          side="bottom"
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="rounded-t-3xl p-6 max-h-[90vh] flex flex-col gap-4 safe-bottom"
        >
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto -mt-2 mb-1" />

          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              🙏
            </div>
            <SheetTitle className="text-xl font-bold text-foreground">
              Pedir oración
            </SheetTitle>
            <p className="text-xs text-muted-foreground">
              Escribe tu intención para que el grupo ore por ti
            </p>
          </div>

          <form onSubmit={handleEnviarPeticion} className="space-y-4 mt-2">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground">
                Intención <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="Ej. Por la salud de mi madre"
                value={intencion}
                onChange={(e) => setIntencion(e.target.value)}
                className="bg-card border-border h-11 text-sm"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground">
                Detalle opcional
              </label>
              <Input
                placeholder="Mañana tiene una cita importante"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                className="bg-card border-border h-11 text-sm"
              />
            </div>

            <div
              className="flex items-start gap-3 cursor-pointer select-none py-1"
              onClick={() => setCompartir(!compartir)}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  compartir ? "bg-primary text-primary-foreground" : "border border-border bg-card"
                }`}
              >
                {compartir && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight">
                  Compartir con este grupo ahora
                </span>
                <span className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                  Tu petición será visible para los miembros del grupo.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-3">
              <Button
                type="submit"
                disabled={submittingPeticion || !intencion.trim()}
                className="w-full gradient-primary text-primary-foreground !rounded-xl h-11 font-bold shadow-xs"
              >
                {submittingPeticion ? "Enviando..." : "Enviar petición"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPeticionModal(false)}
                className="w-full !rounded-xl h-10 font-semibold border-border/60"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Sheet Modal: Ver miembros */}
      <Sheet open={showMembersModal} onOpenChange={setShowMembersModal}>
        <SheetContent
          side="bottom"
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="rounded-t-3xl max-h-[80vh] flex flex-col p-0 pb-6 safe-bottom"
        >
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/50">
            <SheetTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Personas rezando ({rosario.participantes?.length || 1})
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

          <div className="overflow-y-auto flex-1 p-4 pb-10 space-y-3">
            {(rosario.participantes || []).length === 0 ? (
              <p className="text-center py-6 text-xs text-muted-foreground">No hay participantes aún</p>
            ) : (
              (rosario.participantes || []).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {p.usuario?.name?.slice(0, 2).toUpperCase() ?? "RO"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.usuario?.name || "Usuario"}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.usuario?.email || "Unido en oración"}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
