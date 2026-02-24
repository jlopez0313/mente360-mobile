import { useState } from "react";

import Eneatipos from "@/database/eneatipos";
import { db } from "@/hooks/useDexie";
import { test } from "@/services/test";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Modal } from "./Modal";
import Momento1 from "./Momento1";
import Momento2 from "./Momento2";

export const Test = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const eneatipos = useLiveQuery(() => db.eneatipos.toArray(), []);

  const [resultado, setResultado] = useState<Eneatipos | null>(null);
  const [momentos, setMomentos] = useState<any>({});
  const [show, setShow] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const onSetMomento = async (momento: any, valor: any) => {
    if (!valor) {
      toast.error("Selecciona una respuesta");
      return;
    }

    momentos[momento] = valor;

    setMomentos({
      ...momentos,
    });
  };

  const onClearMomentos = () => {
    setMomentos({});
    setResultado(null);
    setShowResult(false);
  };

  const send = async () => {
    try {
      const {
        data: { data },
      } = await test(momentos);

      const eneatipo: any = eneatipos?.find(
        (item: any) => item.key == data.eneatipo
      );

      setResultado(eneatipo);

      dispatch(setUser(data));
      setShowResult(true);
    } catch (error: any) {
      console.error(error);
    }
  };

  if (showResult) {
    return (
      <div className="px-4 py-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full gradient-premium flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-premium-foreground">
            {resultado?.key}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          {resultado?.descripcion}
        </h2>

        <p className="text-muted-foreground mb-8 max-w-sm">
          Este es tu tipo de personalidad según el Eneagrama. Recuerda que este
          es un test orientativo y para un análisis más profundo te recomendamos
          consultar con un profesional.
        </p>

        <div className="w-full max-w-sm space-y-3">
          <Link to="/perfil" className="mb-3 inline-flex w-full">
            <Button className="w-full gradient-primary text-primary-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Volver a mi perfil
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={onClearMomentos}
            className="w-full text-foreground"
          >
            Repetir test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h4 className="text-xl font-semibold text-foreground !m-0 !mb-6">
        Marca la opción con la que más te sientas identificado(a)
      </h4>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{!momentos.uno ? "Momento 1 de 2" : "Momento 2 de 2"}</span>
          <span>{Math.round(!momentos.uno ? 50 : 100)}%</span>
        </div>
        <Progress value={!momentos.uno ? 50 : 100} className="h-2" />
      </div>

      <div className="mb-8">
        {!momentos.uno && !momentos.dos ? (
          <Momento1 onSetMomento={onSetMomento} />
        ) : (
          <Momento2
            momentos={momentos}
            onSend={send}
            onSetMomento={onSetMomento}
            onClearMomentos={onClearMomentos}
          />
        )}
      </div>

      <Modal show={show} setShow={setShow} />
    </>
  );
};
