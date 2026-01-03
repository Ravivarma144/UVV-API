import "dotenv/config";

const required = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return value;
};

export const env = {
    // App
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,

    // Database (Supabase / Postgres)
    // DATABASE_URL: required("DATABASE_URL"),

    // Optional / future
    JWT_SECRET: process.env.JWT_SECRET || "",
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
};
