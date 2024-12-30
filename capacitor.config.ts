import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.soymente360.app',
  appName: 'mente360',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: []
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    allowMixedContent: true
  },
};

export default config;
