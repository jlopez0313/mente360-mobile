import { AppLayout } from "@/components/layout";
import { ArrowLeft } from "lucide-react";


const Suscripcion = () => {
  return (
    <AppLayout>
      <div className="h-full bg-background flex flex-col px-4 py-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => history.go(-1)}
              className="w-10 h-10 !rounded-full !bg-card !border !border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Mu suscripción</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6">
          
        </div>
      </div>
    </AppLayout>
  );
};

export default Suscripcion;
