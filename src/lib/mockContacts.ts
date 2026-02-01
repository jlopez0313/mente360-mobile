export interface Contact {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    hasApp: boolean;
  }
  
  export const mockContacts: Contact[] = [
    {
      id: "c1",
      name: "María González",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      phone: "+34 612 345 678",
      hasApp: true,
    },
    {
      id: "c2",
      name: "Carlos Rodríguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      phone: "+34 623 456 789",
      hasApp: true,
    },
    {
      id: "c3",
      name: "Ana Martínez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      phone: "+34 634 567 890",
      hasApp: true,
    },
    {
      id: "c4",
      name: "Pedro López",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      phone: "+34 645 678 901",
      hasApp: false,
    },
    {
      id: "c5",
      name: "Laura Sánchez",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      phone: "+34 656 789 012",
      hasApp: true,
    },
    {
      id: "c6",
      name: "Miguel Torres",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      phone: "+34 667 890 123",
      hasApp: false,
    },
  ];
  
  export const invitationLink = "https://mente360.app/invite/abc123";
  