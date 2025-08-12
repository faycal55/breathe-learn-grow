import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.lovable.breathelearngrow',
  appName: 'breathe-learn-grow',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Live-reload depuis le bac à sable Lovable
    url: 'https://12cb29f0-8654-4df0-b579-361b355d06a2.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
}

export default config
