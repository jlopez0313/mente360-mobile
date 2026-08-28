import { Test as TestComponent } from "@/components/Test/Test";

import { AppLayout } from "@/components/layout";
import { useBackButton } from "@/hooks/useBackButton";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

const Test: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { route } = useSelector((state: any) => state.route);

  useBackButton(route);

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
  }, []);

  return (
    <AppLayout hideNav>
      <div className="h-full flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 safe-top">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => history.go(-1)}
              className="p-2 -ml-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Test de Eneagrama
            </h1>
            <div className="w-9" />
          </div>
        </header>

        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <TestComponent />
        </div>
      </div>
    </AppLayout>
  );
};

export default Test;
