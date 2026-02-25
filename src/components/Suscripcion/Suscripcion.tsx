import { NetworkContext } from "@/context/NetworkContext";
import { diferenciaRealEnDias, formatCompleteDate } from "@/helpers/Fechas";
import { formatCurrency } from "@/helpers/Format";
import { cn } from "@/lib/utils";
import { CalendarClock, CheckCircle2, Users, XCircle } from "lucide-react";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";

const Suscripcion = ({ comunidad }: any) => {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const [expandido, setExpandido] = useState(false);

  const getSuscripcion = (comunidadID: number) => {
    const suscripcion = user.suscripciones.find(
      (s: any) => s.id == comunidadID
    );
    const fecha_vencimiento = suscripcion?.pivot?.fecha_vencimiento;

    if (!fecha_vencimiento) {
      return null;
    }

    const remaining = diferenciaRealEnDias(
      new Date(),
      new Date(fecha_vencimiento)
    );

    return {
      pivot: suscripcion.pivot,
      fecha_formateada: formatCompleteDate(fecha_vencimiento),
      remaining,
      isExpiringSoon: remaining <= 30,
    };
  };

  const suscripcion = getSuscripcion(comunidad.id);

  return (
    <div
      className={cn(
        "bg-card rounded-2xl shadow-card overflow-hidden border",
        suscripcion ? "border-border/50" : "border-border/30 opacity-75"
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "px-4 py-2 flex items-center justify-between",
          suscripcion?.remaining > 0 ? "bg-primary/10" : "bg-muted"
        )}
      >
        <div className="flex items-center gap-2">
          {suscripcion?.remaining > 0 ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <XCircle className="w-4 h-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              suscripcion?.remaining > 0
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {suscripcion?.remaining > 0 ? "Activa" : "Expirada"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground"></span>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              "bg-primary/10"
            )}
          >
            {comunidad.imagen ? (
              <img
                src={status ? baseURL + comunidad.imagen : AudioNoWifi}
                alt={comunidad.comunidad}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <Users className="w-6 h-6 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate !m-0">
              {comunidad.comunidad}
            </h3>
            <p
              className={cn(
                "text-sm text-muted-foreground mb-0",
                expandido ? "line-clamp-none" : "line-clamp-1"
              )}
            >
              {comunidad.descripcion}
            </p>

            <button
              className="text-sm text-primary underline hover:opacity-80 transition"
              onClick={() => setExpandido(!expandido)}
            >
              {expandido ? "Leer menos" : "Leer más"}
            </button>

            {/* Price */}
            {
              suscripcion?.pivot?.precio ? (
                <p className="mt-2 font-bold text-foreground">
                  {formatCurrency(suscripcion?.pivot?.precio)}
                </p>
              ) : null
            }
          </div>
        </div>

        {/* Dates */}
        <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-3">
          {
            suscripcion?.pivot.fecha_pago ? (
              <div>
                <p className="text-xs text-muted-foreground">Inicio</p>
                <p className="text-sm font-medium text-foreground">
                  {formatCompleteDate(suscripcion?.pivot.fecha_pago)}
                </p>
              </div>
            ) : null
          }
          <div>
            <p className="text-xs text-muted-foreground">Vencimiento</p>
            <p
              className={cn(
                "text-sm font-medium",
                suscripcion?.isExpiringSoon
                  ? "text-destructive"
                  : "text-foreground"
              )}
            >
              {formatCompleteDate(suscripcion?.pivot.fecha_vencimiento)}
            </p>
          </div>
        </div>

        {suscripcion && (
          <div className="mt-3 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-muted-foreground" />
            <span
              className={cn(
                "text-sm",
                suscripcion?.isExpiringSoon
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {suscripcion?.remaining} días restantes
              {suscripcion?.isExpiringSoon && " · Renueva pronto"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suscripcion;
