import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NetworkContext } from "@/context/NetworkContext";
import User from "@/database/user";
import { getData, updateData, writeData } from "@/services/realtime-db";
import { misContactos } from "@/services/user";
import { Contacts } from "@capacitor-community/contacts";
import { Check, Search, UserPlus } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface AddMemberSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMemberIds: string[];
  grupoID: number;
}

export default function AddMemberSheet({
  open,
  onOpenChange,
  currentMemberIds,
  grupoID,
}: AddMemberSheetProps) {
  const { user } = useSelector((state: any) => state.user);
  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);

  const [search, setSearch] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const usersCacheRef = useRef<{ [key: string]: any }>({});
  const [members, setMembers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (contact: User) => {
    try {
      const updates = { [grupoID]: true };

      await Promise.all([
        updateData(`users/${contact.id}/grupos`, updates),
        writeData(`grupos/${grupoID}/users/${contact.id}`, {
          writing: false,
        }),
      ]);
    } catch (error: any) {
      console.error("Error al agregar al grupo:", error);
    }

    toast.success(`${contact.name} agregado al grupo`);
  };

  const memberPhones = useMemo(() => {
    return new Set(
      members
        .map((u: any) => u.phone)
        .filter(Boolean)
    );
  }, [members]);



  useEffect(() => {
    if (!currentMemberIds || currentMemberIds.length === 0) {
      setMembers([]);
      return;
    }

    let cancelled = false;

    const loadMembers = async () => {
      const promises = currentMemberIds.map(async (user: any) => {
        if (usersCacheRef.current[user.id]) {
          return usersCacheRef.current[user.id];
        }

        const data = await getData(`users/${user.id}`);
        const userData = data.val();

        usersCacheRef.current[user.id] = userData;
        return userData;
      });

      const listaUsuarios = await Promise.all(promises);

      if (!cancelled) {
        setMembers(listaUsuarios);
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [currentMemberIds]);

  useEffect(() => {
    if (members.length === 0) {
      setContacts([]);
      return;
    }

    const getContacts = async () => {
      try {
        const perm = await Contacts.checkPermissions();

        if (perm.contacts !== "granted") {
          const res = await Contacts.requestPermissions();
          if (res.contacts !== "granted") {
            throw new Error("Permiso de contactos denegado por el usuario.");
          }
        }

        const projection = {
          name: true,
          phones: true,
          postalAddresses: false,
          emails: true,
          image: false,
        };

        const { contacts } = await Contacts.getContacts({
          projection,
        });

        const lista =
          contacts
            .filter((x) => x.name && x.phones)
            .map((item: any) => {
              const mainPhone = item.phones[0]?.number?.replace(/[\s~`-]/g, "");
              const phoneNumber = parsePhoneNumber(mainPhone);
              const phone = (!phoneNumber?.country ? "+57" : "") + mainPhone;

              return {
                ...item,
                phone,
                invitado:
                  user.invitados?.find((x: any) => x.phone == phone) || false,
              };
            })
            .sort((a: any, b: any) =>
              a.name?.display.toLowerCase() > b.name?.display.toLowerCase()
                ? 1
                : -1
            ) || [];

        const body = {
          user_id: user.id,
          lista: lista.map((x) => x.phone),
        };

        const {
          data: { data },
        } = await misContactos(body);

        const filteredContacts = data.filter(
          (contact: any) =>
            !members.find((user: any) => user.phone == contact.phone)
        );

        setContacts(filteredContacts);
      } catch (error: any) {
        console.error(error);
      } finally {
      }
    };

    getContacts();
  }, [members]);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setAddedIds([]);
        setSearch("");
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="pl-4 pr-14 pt-4 pb-2">
          <SheetTitle>Agregar miembro</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-4 space-y-1 pb-4">
          {filtered.map((contact: User) => {
            const alreadyAdded = addedIds.includes(contact.id);
            return (
              <div
                key={contact.id}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={status ? baseURL + contact.photo : AvatarLogo}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contact.phone}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={alreadyAdded ? "secondary" : "default"}
                  disabled={alreadyAdded}
                  onClick={() => handleAdd(contact)}
                  className="flex-shrink-0"
                >
                  {alreadyAdded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay contactos disponibles
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
