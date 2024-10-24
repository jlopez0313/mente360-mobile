import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
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
