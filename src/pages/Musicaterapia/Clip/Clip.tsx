import { AppLayout } from "@/components/layout";
import { Clip as ClipComponent } from "@/components/Musicaterapia/Clip/Clip";
import { Button } from "@/components/ui/button";
import { useBackButton } from "@/hooks/useBackButton";
import { ChevronLeft } from "lucide-react";
import { useHistory } from "react-router-dom";

const Clip: React.FC = () => {

  const history = useHistory();

  useBackButton('/musicaterapia')

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 safe-top">
          <Button variant="ghost" size="icon" onClick={() => history.replace('/musicaterapia')}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Musicoterapia
          </span>
          <div className="w-10" />
        </div>
        <ClipComponent />
      </div>
    </AppLayout>
  );
};

export default Clip;
