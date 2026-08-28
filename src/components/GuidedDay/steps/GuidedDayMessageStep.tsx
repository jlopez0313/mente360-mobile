import { Button } from "@/components/ui/button";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { MessageSquare } from "lucide-react";
import React from "react";

interface GuidedDayMessageStepProps {
  onContinue: () => void;
}

export const GuidedDayMessageStep: React.FC<GuidedDayMessageStepProps> = ({
  onContinue,
}) => {
  const dailyMessage = useLiveQuery(() => db.mensajes.toCollection().first());

  const messageText = dailyMessage?.mensaje ?? "";

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 overflow-y-auto">
      <div className="flex flex-col items-center text-center mt-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6 text-amber-500 fill-amber-500" />
        </div>

        <h2 className="text-base font-bold font-display text-foreground mb-8">
          Mensaje del día
        </h2>

        {/* Message quote card */}
        <div className="w-full bg-card rounded-3xl p-6 shadow-card border border-border/50 text-center mb-6">
          {messageText ? (
            <p className="text-foreground text-lg leading-relaxed font-medium">
              {messageText}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay mensaje del día disponible.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button
          onClick={onContinue}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
