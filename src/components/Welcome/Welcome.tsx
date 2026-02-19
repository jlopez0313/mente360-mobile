import { useNetwork } from "@/hooks/useNetwork";
import { trial } from "@/services/user";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button } from "../ui/button";

export const Welcome = () => {
  const { user } = useSelector((state: any) => state.user);

  const history = useHistory();
  const network = useNetwork();
  
  const goToPlanes = () => {
    history.replace("/planes");
  };

  const onStartFreeTrial = async () => {
    try {
      await trial();
			history.replace("/home");
    } catch (error) {
      console.log("Error onStartFreeTrial", error);
    }
  };

  return (
    <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
			<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
				<img
					src="assets/images/logo.png"
					className="w-12 h-12 object-contain"
				/>
			</div>

      <p className="text-sm font-semibold text-primary tracking-wide">
        {import.meta.env.VITE_NAME}
      </p>

      <div className="bg-primary/10 rounded-full px-4 py-1.5">
        <p className="text-sm font-bold text-primary">
          ¡Disfruta de 15 días gratis!
        </p>
      </div>

      <h1 className="text-2xl font-bold text-foreground">
        {user.name}, estas listo para comenzar?
      </h1>

      <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
        <p>
          Soy tu versión del futuro. Desde el {new Date().getFullYear() + 1},
          quiero darte las gracias.
        </p>

        <p className="font-medium text-foreground">
          Hoy, fue el día que decidiste priorizarte.
        </p>

        <p>
          Gracias a tus decisiones, estoy en paz, conectado conmigo y viviendo
          con proposito.
        </p>

        <p>Yo estaré en cada paso de este viaje de transformación.</p>

        <p className="italic text-foreground font-medium">
          – Tu yo del futuro.
        </p>
      </div>

      <div className="w-full space-y-4 pt-4">
        <Button
          disabled={!network.status}
          onClick={onStartFreeTrial}
          className="w-full gradient-primary text-primary-foreground font-bold py-6 !rounded-xl text-sm tracking-wide"
        >
          Comienza tu transformación gratis por 15 días
        </Button>

        <p className="text-sm text-muted-foreground">
          ¿Listo para desbloquear tu mejor versión con acceso completo?
        </p>

        <Button
          onClick={goToPlanes}
					variant="outline"
          className="w-full !border-2 !border-premium text-premium font-bold py-6 !rounded-xl text-sm tracking-wide hover:bg-premium/10"
        >
          {import.meta.env.VITE_NAME} premium por solo $3,99 USD/mes
        </Button>
      </div>
    </div>
  );
};
