import { AppLayout } from "@/components/layout";
import RegistroComponent from '@/components/Registro/Registro';

const Registro: React.FC = () => {

  return (
    <AppLayout>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="p-4 safe-top">
        </header>
        
        <RegistroComponent />

      </div>
    </AppLayout>
  );
};

export default Registro;
