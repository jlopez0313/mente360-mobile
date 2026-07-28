export {};

declare global {
  interface Window {
    ePayco: {
      setPublicKey: (key: string) => void;
      token: {
        create: (
          data: Record<string, unknown>,
          callback: (error: unknown, token: { id: string } | undefined) => void
        ) => void;
      };
    };
  }
}
