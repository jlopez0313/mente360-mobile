import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { useHistory } from "react-router";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EneatipoModal({ open, onOpenChange }: ModalProps) {
  const history = useHistory();

  return (
    <>
      <Dialog open={open} onOpenChange={( )=> onOpenChange(true)}>
        <DialogContent className="max-w-sm mx-auto rounded-xl border-0 bg-gradient-to-b from-night/10 to-background p-0 overflow-hidden">
          <div className="relative">
            {/* Content */}
            <div className="p-6 pt-4">
							<DialogHeader className="text-center mb-4">
								<DialogTitle className="text-xl font-bold text-sos">
									¿Aún no conoces tu eneatipo?
                </DialogTitle>
              </DialogHeader>

              {/* Affirmation Message */}
              <div className="mb-8">
                <p className="text-foreground font-medium text-center">
									Completa nuestro test y descúbrelo. ¡Es el primer paso para entenderte mejor!
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    history.replace("/perfil");
                  }}
                  className="w-full !rounded-xl h-12 text-base font-semibold"
                >
                  Sí lo conozco
                </Button>

                <Button
                  variant="outline"
                  className="w-full !rounded-xl h-12 text-base font-semibold"
                  onClick={() => {
                    history.replace("/test");
                  }}
                >
                  Quiero descubrirlo
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
