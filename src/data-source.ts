import "reflect-metadata";
import { DataSource } from "typeorm";
import { School } from "./entities/Schools";
import { Student } from "./entities/Student";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true, // ⚠️ disable in production later
  logging: false,
  ssl: {
    rejectUnauthorized: false, // ✅ REQUIRED for Supabase
  },
  entities: [School, Student],
});

