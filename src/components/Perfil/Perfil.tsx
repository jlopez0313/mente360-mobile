import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/hooks/useDexie";
import { updateData } from "@/services/realtime-db";
import { update } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Perfil = () => {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const generos = useLiveQuery(() => db.generos.toArray(), []);
  const eneatipos = useLiveQuery(() => db.eneatipos.toArray(), []);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    fecha_nacimiento: user.fecha_nacimiento,
    genero: user.genero,
    eneatipo: user.eneatipo,
    country: user.country || "CO",
  });

  const handleSaveProfile = () => {
    setUser({ ...user, ...editForm });
    onUpdateUser();
    setEditProfileOpen(false);
    toast.success("Perfil actualizado");
  };

  const onUpdateUser = async () => {
    try {
      const { data } = await update(editForm, user.id);

      dispatch(setUser(data.data));

      const obj = {
        name: data.data.name,
        phone: data.data.phone,
        photo: data.data.photo,
        eneatipo: data.data.eneatipo,
        genero: data.data.genero,
      };

      await updateData(`users/${user.id}`, obj);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          <Edit2 className="w-4 h-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 ">
          <div>
            <Label className="text-foreground">Nombre completo</Label>
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label className="text-foreground">Email</Label>
            <Input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((prev: any) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label className="text-foreground">Teléfono</Label>
            <div className="relative">
              <PhoneInput
                defaultCountry={editForm.country}
                value={editForm.phone}
                className="border rounded-md px-3 py-2 w-full"
                placeholder="Teléfono"
                onChange={(e) => setEditForm((prev: any) => ({
                  ...prev,
                  phone: e,
                }))}
                onCountryChange={(e) => setEditForm((prev: any) => ({
                  ...prev,
                  country: e,
                }))}
                initialValueFormat="national"
                inputFormat="NATIONAL"
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">Fecha de nacimiento</Label>
            <Input
              type="date"
              value={editForm.fecha_nacimiento}
              onChange={(e) =>
                setEditForm((prev: any) => ({
                  ...prev,
                  fecha_nacimiento: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label className="text-foreground">Género</Label>
            <Select
              value={editForm.genero}
              onValueChange={(v) =>
                setEditForm((prev: any) => ({ ...prev, genero: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generos?.map((opt, index) => (
                  <SelectItem key={index} value={opt.key}>
                    {opt.valor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-foreground">Tipo de Eneagrama</Label>
            <Select
              value={String(editForm.eneatipo)}
              onValueChange={(v) =>
                setEditForm((prev: any) => ({
                  ...prev,
                  eneatipo: parseInt(v),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eneatipos?.map((type, index) => (
                  <SelectItem key={index} value={type.key}>
                    {type.valor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSaveProfile}
            className="w-full gradient-primary text-primary-foreground"
          >
            Guardar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Perfil;
