import {
  ContactDetailModal,
  ContactInfo,
} from "@/components/Shared/Contact/ContactModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NetworkContext } from "@/context/NetworkContext";
import User from "@/database/user";
import { getData } from "@/services/realtime-db";
import { Search } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberIds: string[];
  groupName: string;
}

export default function GroupMembersSheet({
  open,
  onOpenChange,
  memberIds,
  groupName,
}: Props) {
  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);

  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(
    null
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const usersCacheRef = useRef<{ [key: string]: any }>({});
  const [members, setMembers] = useState<User[]>([]);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleMemberClick = (contact: User) => {
    setSelectedContact({
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      phone: contact.phone,
      email: contact.email,
      birthDate: contact.birthDate,
      gender: contact.gender,
      enneagramType: contact.enneagramType,
      communityIds: contact.communityIds,
    });
    setIsContactModalOpen(true);
  };

  useEffect(() => {
    if (!memberIds || memberIds.length === 0) {
      setMembers([]);
      return;
    }

    let cancelled = false;

    const loadMembers = async () => {
      const promises = memberIds.map(async (user: any) => {
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
  }, [memberIds]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>Miembros ({members.length})</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar miembro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 px-4 space-y-3 pb-4">
            {filtered.map((member: User) => (
              <button
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-accent/50 transition-colors text-left"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={status ? baseURL + member.photo : AvatarLogo}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.phone}
                  </p>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No se encontraron miembros
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ContactDetailModal
        contact={selectedContact}
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </>
  );
}
