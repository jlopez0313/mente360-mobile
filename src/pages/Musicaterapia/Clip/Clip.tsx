

import { AppLayout } from "@/components/layout";
import { Clip as ClipComponent } from "@/components/Musicaterapia/Clip/Clip";
import { Button } from "@/components/ui/button";
import { useBackButton } from "@/hooks/useBackButton";
import { Check, ChevronLeft, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "sonner";

const Clip: React.FC = () => {

  const history = useHistory();

  const { audioSrc, globalAudio, globalPos, listAudios } = useSelector(
    (state: any) => state.audio
  );

  useBackButton('/musicaterapia')

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => history.go(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Musicoterapia
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsDownloaded(!globalAudio?.audio_local);
              toast.success(globalAudio?.audio_local ? "Eliminado de descargas" : "Descargado para offline");
            }}
          >
            {globalAudio?.audio_local ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </Button>
        </div>
        <ClipComponent />
      </div>
    </AppLayout>
  );
};

export default Clip;
