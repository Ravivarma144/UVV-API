import "reflect-metadata";
import { DataSource } from "typeorm";
import { School } from "./entities/Schools";
import { Student } from "./entities/Student";

// psql -h db.hajbmltibptdkqslkbfh.supabase.co -p 5432 -d postgres -U postgres

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db.hajbmltibptdkqslkbfh.supabase.co",
  port: 5432,
  username: "postgres",
  password: "qbn14P14buejFioJ",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [School, Student],
});
