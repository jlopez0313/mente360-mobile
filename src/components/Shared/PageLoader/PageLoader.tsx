import { IonSpinner } from "@ionic/react";

export const PageLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
            <IonSpinner name="crescent" color="primary" />
            <span className="text-sm text-muted-foreground animate-pulse">Cargando...</span>
        </div>
    );
};
