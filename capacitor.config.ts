import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.torchlearn.app',
  appName: 'TorchLearn',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;