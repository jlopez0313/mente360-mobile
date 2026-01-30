// Mock data for Mente 360 app

// User data
export const mockUser = {
    id: "user-1",
    name: "María García",
    email: "maria@ejemplo.com",
    phone: "+52 55 1234 5678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    birthDate: "1990-05-15",
    gender: "Femenino",
    enneagramType: 4,
    subscription: {
      type: "premium" as const,
      expiresAt: "2025-03-15",
      isActive: true,
    },
    stats: {
      daysActive: 45,
      tasksCompleted: 23,
      minutesListened: 1250,
    },
  };
  
  // Weekly calendar
  export const weekDays = ["D", "L", "M", "M", "J", "V", "S"];
  
  // Quick access items for home
  export const quickAccessItems = [
    {
      id: "task",
      title: "Tarea de la semana",
      icon: "ClipboardList",
      color: "primary",
      route: "/comunidades/1/tareas",
    },
    {
      id: "message",
      title: "Mensaje del día",
      icon: "MessageCircle",
      color: "accent",
      route: "/mensaje-del-dia",
    },
    {
      id: "morning-audio",
      title: "Audio del día",
      icon: "Sun",
      color: "morning",
      route: "/audio/dia",
    },
    {
      id: "night-audio",
      title: "Audio de la noche",
      icon: "Moon",
      color: "night",
      route: "/audio/noche",
    },
    {
      id: "sos",
      title: "S.O.S Emocional",
      icon: "Heart",
      color: "sos",
      route: "/sos",
    },
  ];
  
  // Communities
  export const mockCommunities = [
    {
      id: "1",
      name: "Comunidad Principal",
      leader: "Dr. Carlos Mendoza",
      leaderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      logo: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=200&h=200&fit=crop",
      description: "Tu comunidad base para comenzar tu viaje de bienestar emocional. Accede a contenido exclusivo, tareas semanales y apoyo continuo de nuestra comunidad.",
      videoUrl: "https://example.com/intro.mp4",
      isPremium: false,
      isSubscribed: true,
      price: 0,
      memberCount: 1250,
      channels: [
        { id: "c1", name: "Bienvenida", icon: "Sparkles" },
        { id: "c2", name: "Crecimiento Personal", icon: "TrendingUp" },
        { id: "c3", name: "Manejo del Estrés", icon: "Wind" },
        { id: "c4", name: "Relaciones", icon: "Users" },
      ],
    },
    {
      id: "2",
      name: "Ansiedad y Calma",
      leader: "Dra. Laura Sánchez",
      leaderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      logo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
      description: "Especializada en técnicas de manejo de ansiedad, respiración consciente y mindfulness para recuperar tu paz interior.",
      videoUrl: "https://example.com/ansiedad.mp4",
      isPremium: true,
      isSubscribed: false,
      price: 9.99,
      memberCount: 890,
      channels: [
        { id: "c5", name: "Técnicas de Respiración", icon: "Wind" },
        { id: "c6", name: "Mindfulness", icon: "Brain" },
        { id: "c7", name: "Ejercicios Prácticos", icon: "Dumbbell" },
      ],
    },
    {
      id: "3",
      name: "Parejas y Familia",
      leader: "Dr. Roberto Vega",
      leaderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      logo: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop",
      description: "Fortalece tus relaciones de pareja y familiares con herramientas prácticas de comunicación y conexión emocional.",
      videoUrl: "https://example.com/parejas.mp4",
      isPremium: true,
      isSubscribed: true,
      price: 14.99,
      memberCount: 560,
      channels: [
        { id: "c8", name: "Comunicación", icon: "MessageSquare" },
        { id: "c9", name: "Resolución de Conflictos", icon: "Handshake" },
        { id: "c10", name: "Intimidad Emocional", icon: "Heart" },
      ],
    },
  ];
  
  // Podcasts/Audio content
  export const mockPodcasts = [
    {
      id: 1,
      title: "Encontrando tu propósito",
      description: "Un viaje de autoconocimiento para descubrir lo que realmente te motiva",
      duration: 1845, // seconds
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/audio1.mp3",
      channelId: 2,
      communityId: 1,
      level: 1,
      isDownloaded: false,
      progress: 0.3,
    },
    {
      id: 2,
      title: "Respiración 4-7-8 para calmar",
      description: "Técnica guiada de respiración para momentos de ansiedad",
      duration: 600,
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/audio2.mp3",
      channelId: 1,
      communityId: 1,
      level: 1,
      isDownloaded: true,
      progress: 1,
    },
    {
      id: 3,
      title: "Manejo del estrés laboral",
      description: "Estrategias prácticas para equilibrar trabajo y bienestar",
      duration: 2100,
      coverImage: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/audio3.mp3",
      channelId: 3,
      communityId: 1,
      level: 2,
      isDownloaded: false,
      progress: 0,
    },
  ];
  
  // Weekly tasks
  export const mockTasks = [
    {
      id: 1,
      title: "Escucha el podcast de bienvenida",
      description: "Conoce a tu comunidad y los recursos disponibles",
      type: "audio" as const,
      contentId: "p2",
      isCompleted: true,
      dueDate: "2025-01-02",
      communityId: 1,
    },
    {
      id: 2,
      title: "Practica la respiración 4-7-8",
      description: "Realiza el ejercicio al menos 3 veces esta semana",
      type: "practice" as const,
      contentId: null,
      isCompleted: false,
      dueDate: "2025-01-05",
      communityId: 1,
    },
    {
      id: 3,
      title: "Escucha: Encontrando tu propósito",
      description: "Podcast sobre autoconocimiento y motivación",
      type: "audio" as const,
      contentId: "p1",
      isCompleted: false,
      dueDate: "2025-01-07",
      communityId: 1,
    },
  ];
  
  // Music therapy categories
  export const musicCategories = [
    { id: "mc1", name: "Pop", icon: "Music" },
    { id: "mc2", name: "Espiritualidad", icon: "Sparkles" },
    { id: "mc3", name: "Infantil", icon: "Baby" },
    { id: "mc4", name: "Instrumental", icon: "Piano" },
    { id: "mc5", name: "Naturaleza", icon: "TreePine" },
    { id: "mc6", name: "Meditación", icon: "Brain" },
    { id: "mc7", name: "Clásica", icon: "Music2" },
  ];
  
  // Music tracks
  export const mockMusicTracks = [
    {
      id: "m1",
      title: "Amanecer en calma",
      artist: "Sonidos Naturales",
      category: "mc5",
      duration: 245,
      coverImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/music1.mp3",
      isDownloaded: false,
    },
    {
      id: "m2",
      title: "Lluvia suave",
      artist: "Naturaleza Viva",
      category: "mc5",
      duration: 180,
      coverImage: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/music2.mp3",
      isDownloaded: true,
    },
    {
      id: "m3",
      title: "Melodía para soñar",
      artist: "Piano Dreams",
      category: "mc4",
      duration: 320,
      coverImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/music3.mp3",
      isDownloaded: false,
    },
    {
      id: "m4",
      title: "Respiración guiada",
      artist: "Mente 360",
      category: "mc6",
      duration: 420,
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/music4.mp3",
      isDownloaded: false,
    },
    {
      id: "m5",
      title: "Canción de cuna",
      artist: "Dulces Sueños",
      category: "mc3",
      duration: 195,
      coverImage: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=300&h=300&fit=crop",
      audioUrl: "https://example.com/music5.mp3",
      isDownloaded: false,
    },
  ];
  
  // Playlists
  export const mockPlaylists = [
    {
      id: "pl1",
      name: "Para dormir",
      description: "Sonidos relajantes para conciliar el sueño",
      coverImage: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=300&fit=crop",
      trackIds: ["m1", "m2", "m3"],
      trackCount: 12,
    },
    {
      id: "pl2",
      name: "Meditación matutina",
      description: "Comienza tu día con energía positiva",
      coverImage: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=300&h=300&fit=crop",
      trackIds: ["m4", "m1"],
      trackCount: 8,
    },
    {
      id: "pl3",
      name: "Concentración",
      description: "Música para trabajar y estudiar",
      coverImage: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=300&h=300&fit=crop",
      trackIds: ["m3", "m4"],
      trackCount: 15,
    },
  ];
  
  // Notifications
  export const mockNotifications = [
    {
      id: "n1",
      message: "Recuerda que cada pequeño paso cuenta. ¡Hoy es un buen día para avanzar!",
      date: "2025-01-02T09:00:00",
      isRead: false,
    },
    {
      id: "n2",
      message: "Tu tarea semanal te espera. ¿Listo para crecer?",
      date: "2025-01-02T08:00:00",
      isRead: true,
    },
    {
      id: "n3",
      message: "La calma es tu superpoder. Tómate un momento para respirar.",
      date: "2025-01-01T20:00:00",
      isRead: true,
    },
    {
      id: "n4",
      message: "¡Felicidades! Completaste tu primera semana en Mente 360.",
      date: "2024-12-28T10:00:00",
      isRead: true,
    },
  ];
  
  // Chats
  export const mockChats = [
    {
      id: "chat1",
      participant: {
        id: "u2",
        name: "Ana Martínez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
      },
      lastMessage: {
        text: "¡Gracias por el consejo! Me ayudó mucho",
        date: "2025-01-02T14:30:00",
        isFromMe: false,
      },
      unreadCount: 2,
    },
    {
      id: "chat2",
      participant: {
        id: "u3",
        name: "Pedro López",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        isOnline: false,
      },
      lastMessage: {
        text: "¿Pudiste escuchar el podcast?",
        date: "2025-01-01T18:45:00",
        isFromMe: true,
      },
      unreadCount: 0,
    },
    {
      id: "chat3",
      participant: {
        id: "u4",
        name: "Carmen Ruiz",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
      },
      lastMessage: {
        text: "¡Nos vemos en el grupo de mañana!",
        date: "2024-12-31T09:00:00",
        isFromMe: false,
      },
      unreadCount: 0,
    },
  ];
  
  // Groups
  export const mockGroups = [
    {
      id: "g1",
      name: "Meditación Diaria",
      avatar: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop",
      memberCount: 24,
      lastMessage: {
        sender: "Laura",
        text: "¿Alguien para meditar a las 7am?",
        date: "2025-01-02T22:00:00",
      },
    },
    {
      id: "g2",
      name: "Apoyo Mutuo",
      avatar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&h=150&fit=crop",
      memberCount: 45,
      lastMessage: {
        sender: "Carlos",
        text: "Gracias a todos por sus palabras 💚",
        date: "2025-01-02T19:30:00",
      },
    },
  ];
  
  // Reminders/Alarms
  export const mockReminders = [
    {
      id: "r1",
      name: "Meditación matutina",
      time: "07:00",
      days: [1, 2, 3, 4, 5], // L-V
      isActive: true,
    },
    {
      id: "r2",
      name: "Respiración consciente",
      time: "13:00",
      days: [1, 2, 3, 4, 5, 6, 0], // Todos
      isActive: true,
    },
    {
      id: "r3",
      name: "Gratitud nocturna",
      time: "21:30",
      days: [0, 6], // Fin de semana
      isActive: false,
    },
  ];
  
  // SOS Content
  export const sosContent = {
    breathing: {
      title: "Respiración de emergencia",
      description: "Técnica 4-7-8 para calmar la ansiedad en segundos",
      steps: [
        { action: "Inhala", duration: 4, instruction: "Respira profundo por la nariz" },
        { action: "Mantén", duration: 7, instruction: "Sostén el aire suavemente" },
        { action: "Exhala", duration: 8, instruction: "Suelta lentamente por la boca" },
      ],
    },
    grounding: {
      title: "Técnica de anclaje 5-4-3-2-1",
      description: "Conecta con el presente usando tus sentidos",
      steps: [
        { sense: "Vista", count: 5, instruction: "Nombra 5 cosas que puedas ver" },
        { sense: "Tacto", count: 4, instruction: "Nombra 4 cosas que puedas tocar" },
        { sense: "Oído", count: 3, instruction: "Nombra 3 cosas que puedas oír" },
        { sense: "Olfato", count: 2, instruction: "Nombra 2 cosas que puedas oler" },
        { sense: "Gusto", count: 1, instruction: "Nombra 1 cosa que puedas saborear" },
      ],
    },
    affirmations: [
      "Esto también pasará",
      "Estoy seguro/a en este momento",
      "Puedo manejar esto",
      "Mi respiración me calma",
      "Soy más fuerte de lo que creo",
    ],
    emergencyAudio: {
      id: "sos-audio",
      title: "Calma inmediata",
      duration: 180,
      audioUrl: "https://example.com/sos-audio.mp3",
    },
  };
  
  // Daily message
  export const dailyMessage = {
    id: "dm1",
    message: "La paz interior no es la ausencia de problemas, sino la capacidad de mantener la calma en medio de ellos.",
    author: "Dalai Lama",
    date: "2025-01-02",
  };
  
  // Morning/Night audio
  export const dailyAudio = {
    morning: {
      id: "da-morning",
      title: "Despertar con energía",
      description: "Meditación guiada para comenzar tu día con intención y claridad",
      duration: 600,
      coverImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/morning.mp3",
    },
    night: {
      id: "da-night",
      title: "Descanso profundo",
      description: "Relajación guiada para liberar el día y prepararte para un sueño reparador",
      duration: 900,
      coverImage: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/night.mp3",
    },
  };
  
  // Enneagram types
  export const enneagramTypes = [
    { value: 1, label: "Tipo 1 - El Perfeccionista" },
    { value: 2, label: "Tipo 2 - El Ayudador" },
    { value: 3, label: "Tipo 3 - El Triunfador" },
    { value: 4, label: "Tipo 4 - El Individualista" },
    { value: 5, label: "Tipo 5 - El Investigador" },
    { value: 6, label: "Tipo 6 - El Leal" },
    { value: 7, label: "Tipo 7 - El Entusiasta" },
    { value: 8, label: "Tipo 8 - El Desafiador" },
    { value: 9, label: "Tipo 9 - El Pacificador" },
  ];
  
  // Gender options
  export const genderOptions = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },
    { value: "prefiero-no-decir", label: "Prefiero no decir" },
  ];
  