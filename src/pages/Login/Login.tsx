import { AppLayout } from "@/components/layout";
import {
  LoginComponent,
  RegisterComponent,
  ResetComponent,
} from "@/components/Login/Index";
import { setGlobalAudio } from "@/store/slices/audioSlice";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type AuthMode = "login" | "register" | "reset";

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  useEffect(() => {
    dispatch(setGlobalAudio(null));
  }, []);

  return (
    <AppLayout>
      <div className="min-h-full pb-24 bg-background flex flex-col">
        {/* Header */}
        <header className="p-4">
          {mode !== "login" && (
            <button
              onClick={() => switchMode("login")}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
        </header>

        {mode === "login" && (
          <LoginComponent
            isLoading={isLoading}
            switchMode={switchMode}
            setIsLoading={setIsLoading}
          />
        )}
        {mode === "register" && (
          <RegisterComponent
            isLoading={isLoading}
            switchMode={switchMode}
            setIsLoading={setIsLoading}
          />
        )}
        {mode === "reset" && (
          <ResetComponent isLoading={isLoading} setIsLoading={setIsLoading} />
        )}
      </div>
    </AppLayout>
  );
};

export default Login;
