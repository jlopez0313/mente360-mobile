import {
  AlarmClock,
  Bell,
  BookText,
  MessageCircle,
  Moon,
  Music,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface OnboardingTip {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** A dónde navega el checklist "Primeros pasos" de Home. */
  route: string;
}

/**
 * Registro central de tips de onboarding contextual (ver TipCard /
 * useOnboardingTips). El orden acá es el orden en que aparecen en el
 * checklist "Primeros pasos" de Home. Agregar una pantalla nueva: sumarla acá
 * y poner <TipCard tipKey="..." /> donde corresponda en esa pantalla.
 */
export const ONBOARDING_TIPS: OnboardingTip[] = [
  {
    key: "comunidades",
    title: "Comunidades",
    description:
      "Únete a grupos de apoyo y comparte tu camino con personas que te entienden.",
    icon: Users,
    route: "/comunidades",
  },
  {
    key: "musicaterapia",
    title: "Música",
    description:
      "Sonidos y música pensada para bajar el estrés, dormir mejor y concentrarte.",
    icon: Music,
    route: "/musicaterapia",
  },
  {
    key: "chat",
    title: "Chat",
    description: "Habla en privado o en grupo con tu comunidad de apoyo.",
    icon: MessageCircle,
    route: "/chat",
  },
  {
    key: "mi-noche",
    title: "Mi noche",
    description:
      "Cierra tu día con una reflexión guiada y un audio pensado para ayudarte a dormir.",
    icon: Moon,
    route: "/mi-noche",
  },
  {
    key: "diario",
    title: "Tu diario",
    description:
      "Cada cierre de día que hagas en \"Mi noche\" queda guardado aquí, para que revivas tu progreso.",
    icon: BookText,
    route: "/diario",
  },
  {
    key: "recordatorios",
    title: "Recordatorios",
    description:
      "Configura alarmas para tus momentos de mindfulness o cualquier hábito que quieras sostener.",
    icon: AlarmClock,
    route: "/recordatorios",
  },
  {
    key: "notificaciones",
    title: "Alertas",
    description:
      "Aquí llegan tus avisos: mensajes, recordatorios y novedades de tu comunidad.",
    icon: Bell,
    route: "/notificaciones",
  },
  {
    key: "perfil",
    title: "Tu perfil",
    description:
      "Revisa tu eneatipo, tu suscripción y tu progreso personal.",
    icon: User,
    route: "/perfil",
  },
];

export const getOnboardingTip = (key: string): OnboardingTip | undefined =>
  ONBOARDING_TIPS.find((t) => t.key === key);
