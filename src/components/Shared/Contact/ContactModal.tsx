import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { NetworkContext } from "@/context/NetworkContext";
import { enneagramTypes, mockCommunities } from "@/lib/mockData";
import {
    Calendar,
    ChevronRight,
    Mail,
    Phone,
    Sparkles,
    User,
    Users,
} from "lucide-react";
import { useContext } from "react";

export interface ContactInfo {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  enneagramType?: number;
  communityIds?: string[];
}

interface ContactDetailModalProps {
  contact: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDetailModal({
  contact,
  open,
  onOpenChange,
}: ContactDetailModalProps) {
  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);

  if (!contact) return null;

  const contactCommunities = contact.communityIds
    ? mockCommunities.filter((c) => contact.communityIds?.includes(c.id))
    : [];

  const enneagramLabel = contact.enneagramType
    ? enneagramTypes.find((t) => t.value === contact.enneagramType)?.label
    : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleCommunityClick = (communityId: string) => {
    onOpenChange(false);
    // navigate(`/comunidades/${communityId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-98 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={status ? baseURL + contact.photo : AvatarLogo}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl">{contact.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-3">
            {contact.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Teléfono</p>
                  <p className="text-foreground">{contact.phone}</p>
                </div>
              </div>
            )}

            {contact.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-foreground">{contact.email}</p>
                </div>
              </div>
            )}

            {contact.birthDate && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Fecha de nacimiento
                  </p>
                  <p className="text-foreground">
                    {formatDate(contact.birthDate)}
                  </p>
                </div>
              </div>
            )}

            {contact.gender && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Género</p>
                  <p className="text-foreground">{contact.gender}</p>
                </div>
              </div>
            )}

            {enneagramLabel && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Eneagrama</p>
                  <p className="text-foreground">{enneagramLabel}</p>
                </div>
              </div>
            )}
          </div>

          {/* Communities */}
          {contactCommunities.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Comunidades ({contactCommunities.length})
                </h4>
                <div className="space-y-2">
                  {contactCommunities.map((community) => (
                    <Button
                      key={community.id}
                      variant="ghost"
                      className="w-full justify-between h-auto py-3 px-3"
                      onClick={() => handleCommunityClick(community.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={community.logo} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {community.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-foreground">
                            {community.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {community.channels.length} canales •{" "}
                            {community.memberCount} miembros
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {contactCommunities.length === 0 && (
            <>
              <Separator />
              <div className="text-center py-4">
                <Users className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Este contacto no está en ninguna comunidad
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
