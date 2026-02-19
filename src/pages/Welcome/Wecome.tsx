import { Welcome as WelcomeComponent } from "@/components/Welcome/Welcome";
import { AppLayout } from "@/components/layout";

const Welcome: React.FC = () => {
  return (
    <AppLayout>
      <div className="h-full bg-background flex flex-col items-center justify-center px-6 py-10">
        <WelcomeComponent />
      </div>
    </AppLayout>
  );
};

export default Welcome;
