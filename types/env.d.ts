declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_NEON_DATABASE_URL: string;
      EXPO_PUBLIC_GROQ_API_KEY: string;
      EXPO_PUBLIC_TELEGRAM_BOT_TOKEN: string;
    }
  }
}

export {};