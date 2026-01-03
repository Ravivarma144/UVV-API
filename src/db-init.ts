import { AppDataSource } from "./data-source";

let initialized = false;

export const initDB = async () => {
  if (initialized) return;

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected");
    }
    initialized = true;
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);

    // LOCAL / NON-SERVERLESS
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }

    // SERVERLESS (Vercel)
    throw error;
  }
};
