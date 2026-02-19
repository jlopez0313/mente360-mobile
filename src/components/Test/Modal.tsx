import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const Modal = ({ show, setShow }: Props) => {
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="max-w-sm p-0 overflow-hidden rounded-lg"
        aria-describedby=""
      >
        <div className="bg-gradient-to-b from-accent/20 to-background p-6">
          <h2 className="text-xl font-bold text-accent text-center !m-0 !mb-4">
            El Eneagrama en Mente360
          </h2>
          <ul className="space-y-2 mb-6">
            <li>
              <span className="text-foreground font-medium">
                <strong> Cristo es el centro: </strong> Tu identidad está en ser
                hijo(a) de Dios, no en un eneatipo.
              </span>
            </li>
            <li>
              <span className="text-foreground font-medium">
                <strong> Herramienta, no doctrina: </strong> El eneagrama es
                solo un recurso pedagógico de autoconocimiento.
              </span>
            </li>
            <li>
              <span className="text-foreground font-medium">
                <strong> No sustituye la fe: </strong> No reemplaza la gracia,
                los sacramentos ni la vida espiritual.{" "}
              </span>
            </li>
            <li>
              <span className="text-foreground font-medium">
                <strong> Autoconocimiento para crecer: </strong> Sirve para
                reconocer patrones y mejorar tu vida personal y relacional.
              </span>
            </li>
            <li>
              <span className="text-foreground font-medium">
                <strong> Al servicio del Evangelio: </strong> Todo en Mente360
                busca ayudarte a vivir con mayor libertad, amor y plenitud en
                Cristo.
              </span>
            </li>
          </ul>

          <div className="space-y-6">
            <Button
              onClick={() => setShow(false)}
              className="w-full gradient-accent text-accent-foreground font-semibold py-6"
            >
              Aceptar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
