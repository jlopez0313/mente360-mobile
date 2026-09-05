import {
  BookOpen,
  Compass,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  type LucideIcon,
  MessageCircle,
  Moon,
  Music,
  Sparkles,
  Sun,
  Target,
  Users,
} from "lucide-react";

/**
 * Contenido del onboarding de primera vez (flujo de 7 pantallas del doc).
 * Los textos salen tal cual de las "Indicaciones de onboarding".
 */

// ── Pantalla 2 · Tu ruta de crecimiento (3 momentos) ──────────────────────────
export interface RutaMomento {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

export const RUTA_MOMENTOS: RutaMomento[] = [
  {
    icon: Sun,
    titulo: "Comienza tu día",
    descripcion: "Día Guiado: unos minutos para orientar tu mente y tu corazón.",
  },
  {
    icon: Music,
    titulo: "Mente360 te acompaña",
    descripcion: "Tu música favorita y sonidos que te acompañan durante el día.",
  },
  {
    icon: Moon,
    titulo: "Cierra tu día",
    descripcion: "Un audio de la noche pensado para detenerte, descansar y cerrar el día.",
  },
];

// ── Pantalla 3 · Conocerte un poco mejor ──────────────────────────────────────
export interface Tema {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const ONBOARDING_TEMAS: Tema[] = [
  { key: "ansiedad", label: "Ansiedad o estrés", icon: HeartPulse },
  { key: "autoestima", label: "Autoestima", icon: Sparkles },
  { key: "relaciones", label: "Relaciones", icon: HeartHandshake },
  { key: "habitos", label: "Hábitos", icon: Target },
  { key: "descanso", label: "Descanso", icon: Moon },
  { key: "gestion_emocional", label: "Gestión emocional", icon: HeartPulse },
  { key: "proposito", label: "Propósito", icon: Compass },
  { key: "crecimiento_espiritual", label: "Crecimiento espiritual", icon: Sparkles },
];

export const TEMAS_MAX = 3;
export const TIEMPOS_DIARIOS = [10, 15, 20, 30] as const;
export const TIEMPO_DIARIO_DEFAULT = 10;

// ── Pantalla 4 · Carrusel de herramientas (4.1 – 4.8) ─────────────────────────
export interface CarruselSlide {
  key: string;
  nombre: string;
  icon: LucideIcon;
  mensaje: string;
  secundario?: string;
  /** Etiquetas que se dibujan dentro del mockup para evocar la pantalla real. */
  mockChips?: string[];
}

export const CARRUSEL_SLIDES: CarruselSlide[] = [
  {
    key: "musicoterapia",
    nombre: "Musicoterapia",
    icon: Music,
    mensaje: "Encuentra música según lo que necesitas vivir y cómo quieres sentirte.",
    mockChips: ["Categorías", "Buscador", "Favoritos"],
  },
  {
    key: "comunidades",
    nombre: "Comunidades",
    icon: Users,
    mensaje:
      "Encuentra espacios de crecimiento según tus intereses, necesidades y camino personal.",
    mockChips: ["Comunidades", "Canales", "Rutas"],
  },
  {
    key: "canales",
    nombre: "Canales y rutas de crecimiento",
    icon: Compass,
    mensaje:
      "Dentro de los canales encontrarás contenidos organizados por niveles para avanzar progresivamente.",
    mockChips: ["Niveles", "Podcasts", "Progreso"],
  },
  {
    key: "conexiones",
    nombre: "Conexiones",
    icon: MessageCircle,
    mensaje: "Comunícate con personas que también están creciendo.",
    secundario: "Porque crecer también puede ser compartir el camino.",
    mockChips: ["Chats", "Grupos", "Contactos"],
  },
  {
    key: "tarea_semanal",
    nombre: "Tarea semanal",
    icon: Target,
    mensaje:
      "Cada semana tendrás una práctica concreta para llevar tu proceso a la vida cotidiana.",
    secundario: "No solo comprender. También practicar.",
  },
  {
    key: "mensaje_diario",
    nombre: "Mensaje diario",
    icon: BookOpen,
    mensaje:
      "Cada día recibirás un mensaje breve relacionado con tu proceso y tu personalidad.",
  },
  {
    key: "sos_emocional",
    nombre: "S.O.S Emocional",
    icon: LifeBuoy,
    mensaje:
      "Cuando necesites detenerte y recuperar la calma, tendrás un recurso inmediato para acompañarte.",
    secundario: "Un acompañamiento, no un sustituto de atención de urgencia.",
  },
  {
    key: "mi_noche",
    nombre: "Mi noche",
    icon: Moon,
    mensaje: "Cierra el día de acuerdo con lo que necesitas vivir esta noche.",
    mockChips: ["Mi secuencia", "Noche guiada", "Hipnosis sanadoras"],
  },
];

// ── Copys sueltos ────────────────────────────────────────────────────────────
export const ONBOARDING_COPY = {
  skip: "Explorar por mi cuenta",
  skipShort: "Saltar",
  perfecto: {
    titulo: "Perfecto",
    cuerpo: "Ya tienes todo para comenzar tu camino en Mente360.",
    frase: "No se trata de hacerlo todo, sino de dar el siguiente paso.",
    cta: "Ir a mi primer día",
  },
  primerDia: {
    titulo: "Tu primer día ha comenzado",
    cuerpo: "Hoy ya diste tu primer paso.",
    volver: "Volver a Inicio",
    explorar: "Explorar Mente360",
  },
};
