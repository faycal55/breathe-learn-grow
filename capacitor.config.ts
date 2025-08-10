import type { CapacitorConfig } from '@capacitor/cli';

// Capacitor configuration for Respira mobile builds with live-reload from the Lovable sandbox
const config: CapacitorConfig = {
  appId: 'app.lovable.12cb29f086544df0b579361b355d06a2',
  appName: 'breathe-learn-grow',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Enable hot reload from the sandbox preview URL
    url: 'https://12cb29f0-8654-4df0-b579-361b355d06a2.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
