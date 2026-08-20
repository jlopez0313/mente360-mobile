import { RosaryIcon } from "@/components/Home/RosarioCard";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRosarios, Rosario } from "@/services/rosarios";
import { ArrowLeft, Calendar, Heart, MessageCircle, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function RosarioList() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("ahora");
  const [rosarios, setRosarios] = useState<Rosario[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getRosarios(activeTab as any);
      setRosarios(res?.data ?? []);
    } catch {
      setRosarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [activeTab]);

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

  const isEnFuturo = (item: Rosario) => {
    if (!item.fecha_hora) return false;
    if (item.estado && item.estado !== "programado") return false;
    try {
      const fecha = new Date(item.fecha_hora.replace(" ", "T")).getTime();
      return !isNaN(fecha) && fecha > Date.now();
    } catch {
      return false;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => history.replace("/home")}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Rosario en comunidad</h1>
              <p className="text-sm text-muted-foreground">Ora con otros, en vivo o por una intención</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-6 flex-1 overflow-y-auto pb-28">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="ahora" className="flex-1 gap-1 text-xs px-2">
                <MessageCircle className="w-4 h-4" />
                Ahora
              </TabsTrigger>
              <TabsTrigger value="programados" className="flex-1 gap-1 text-xs px-2">
                <Calendar className="w-4 h-4" />
                Programados
              </TabsTrigger>
              <TabsTrigger value="intenciones" className="flex-1 gap-1 text-xs px-2">
                <Heart className="w-4 h-4" />
                Intenciones
              </TabsTrigger>
            </TabsList>

            {["ahora", "programados", "intenciones"].map((tab) => (
              <TabsContent key={tab} value={tab} className="m-0 focus-visible:outline-none space-y-3">
                {loading ? (
                  <p className="text-center py-12 text-muted-foreground text-sm">Cargando...</p>
                ) : rosarios.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground text-sm">
                    No hay rosarios disponibles en este momento.
                  </p>
                ) : (
                  rosarios.map((item) => (
                    <Card key={item.id} className="border-border/50">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <RosaryIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{item.nombre}</p>
                          <p className="text-xs text-primary capitalize font-medium">Misterios {item.tipo_misterio}</p>

                          {item.fecha_hora && item.modalidad === "programado" && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{formatFechaHora(item.fecha_hora)}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Users className="w-3 h-3" />
                            <span>{item.participantes_count || 1} personas</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="gradient-primary text-primary-foreground !rounded-xl text-xs font-semibold px-3"
                          onClick={() => history.push(`/rosario/vivo/${item.id}`)}
                        >
                          {isEnFuturo(item) ? "Ver evento" : "Unirme"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => history.push("/rosario/crear")}
            className="w-14 h-14 !rounded-full shadow-2xl gradient-primary text-primary-foreground !p-0 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <span className="text-2xl font-light">+</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
