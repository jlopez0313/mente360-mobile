import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { db } from "@/hooks/useDexie";
import { ONBOARDING_COPY } from "@/lib/onboardingContent";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

interface Props {
  onNext: () => void;
  onSkip: () => void;
}

/**
 * Pantalla 1 · Resultado del Eneagrama + bienvenida.
 * Si el usuario ya tiene eneatipo, muestra el resultado y su descripción breve.
 * Si no (todavía no hizo el test), muestra una bienvenida neutra — el test lo
 * sigue sugiriendo la EneatipoModal cuando llegue a Home.
 */
export const OnboardingWelcome: React.FC<Props> = ({ onNext, onSkip }) => {
  const { user } = useSelector((s: any) => s.user);

  const eneatipos = useLiveQuery(() => db.eneatipos.toArray(), []);
  const perfil = user?.eneatipo
    ? eneatipos?.find((e: any) => String(e.key) === String(user.eneatipo))
    : null;

  const nombre = (user?.name || "").split(" ")[0];

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
      <img src={logo} alt="Mente360" className="mb-6 w-16 object-contain" />

      <h1 className="mb-1 font-display text-2xl font-bold text-foreground">
        {nombre ? `Bienvenido, ${nombre}` : "Bienvenido a Mente360"}
      </h1>

      {perfil ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            Ya conocemos un poco más de ti.
          </p>

          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <span className="font-display text-4xl font-bold text-primary">
              {user.eneatipo}
            </span>
          </div>

          <p className="mb-2 font-display text-base font-semibold text-foreground">
            {perfil.valor}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {perfil.descripcion}
          </p>
        </>
      ) : (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Tu compañero de bienestar. En los próximos pasos te contamos, sin
          prisa, qué puedes hacer aquí cada día.
        </p>
      )}

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        <Button size="lg" onClick={onNext} className="w-full gap-2">
          Continuar
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button variant="ghost" onClick={onSkip} className="w-full text-muted-foreground">
          {ONBOARDING_COPY.skip}
        </Button>
      </div>
    </div>
  );
};
