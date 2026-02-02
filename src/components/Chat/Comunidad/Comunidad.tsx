import { invitar, misContactos } from "@/services/user";
import { Contacts } from "@capacitor-community/contacts";
import { useIonAlert, useIonLoading } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Share2, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";

export const Comunidad = ({ searchQuery }: any) => {
  const invitationLink = "https://soymente360.com/#invitacion";

  const { user } = useSelector((state: any) => state.user);

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  // const [allContacts, setAllContacts] = useState<any>([]);
  // const [contacts, setContacts] = useState<any>([]);
  const [userContacts, setUserContacts] = useState<any>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const filteredUserContacts = useMemo(() => {
    if (searchQuery) {
      const lista = userContacts.filter((u: any) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return [...lista];
    } else {
      return [...userContacts];
    }
  }, [userContacts, searchQuery]);

  const onInvitar = async (contact: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const body = {
        nombre: contact.name?.display,
        phone: contact.phone,
        users_id: user.id,
      };

      const { data } = await invitar(body);
    } catch (error: any) {
      console.log(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast({
        title: "Link copiado",
        description: "El link de invitación se copió al portapapeles",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar el link",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "¡Únete a Mente360!",
          text: "Descubre contenido exclusivo y mejora tu bienestar con Mente360. ¡Haz clic para saber más!",
          url: invitationLink,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

  useEffect(() => {
    const getContacts = async () => {
      try {
        present({
          message: "Cargando ...",
        });

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
              let phone = mainPhone;

              try {
                const phoneNumber = parsePhoneNumber(mainPhone);
                phone = (!phoneNumber?.country ? "+57" : "") + mainPhone;
              } catch {
                phone = "+57" + mainPhone;
              }

              return {
                ...item,
                phone,
                invitado:
                  user.invitados?.find((x: any) => x.phone == phone) || false,
              };
            })
            .sort((a: any, b: any) =>
              a.name?.display?.toLowerCase() > b.name?.display?.toLowerCase()
                ? 1
                : -1
            ) ?? [];

        const body = {
          user_id: user.id,
          lista: lista.map((x) => x.phone),
        };

        const {
          data: { data },
        } = await misContactos(body);

        if (!data) throw new Error("El backend no devolvió contactos válidos.");

        // Usuarios que tienen cuenta en 360
        setUserContacts(data);

        // Contactos de mi teléfono
        // setAllContacts(lista);
        // setContacts(lista);
      } catch (error: any) {
        console.error(error);

        presentAlert({
          header: "Alerta!",
          subHeader: "Mensaje importante.",
          message: error.data?.message || error?.message || "Error Interno",
          buttons: ["OK"],
        });
      } finally {
        dismiss();
      }
    };

    getContacts();
  }, []);

  return (
    <>
      {/* Invitation Link */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-2">
          Invita a tus amigos
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Comparte este link para que tus amigos se unan a Mente 360
        </p>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-xl mb-3">
          <span className="flex-1 text-sm text-foreground truncate">
            {invitationLink}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Button onClick={handleShareLink} className="w-full gap-2">
          <Share2 className="w-4 h-4" />
          Compartir en redes
        </Button>
      </div>

      {/* Contacts with App */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Tus contactos en Mente 360
        </h3>

        {filteredUserContacts.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Ninguno de tus contactos tiene la app aún
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUserContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={contact.avatar}
                    alt={contact.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="!m-0 font-semibold text-foreground truncate">
                    {contact.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {contact.phone}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-success/10 text-success"
                >
                  En la app
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
