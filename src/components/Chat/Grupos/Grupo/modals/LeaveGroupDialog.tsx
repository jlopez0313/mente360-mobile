import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
  
  interface LeaveGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupName: string;
    onConfirm: () => void;
  }
  
  export default function LeaveGroupDialog({ open, onOpenChange, groupName, onConfirm }: LeaveGroupDialogProps) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Salir del grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas salir de <strong>{groupName}</strong>? Ya no podrás ver los mensajes del grupo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Salir del grupo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  