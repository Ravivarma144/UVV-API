import { DataSource } from "typeorm";
import { School } from "./entities/Schools";
import { Student } from "./entities/Student";
import { Exam } from "./entities/Exams";
import { ExamResult } from "./entities/ExamResults";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL, // ✅ USE URL
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: false,
  entities: [School, Student , Exam, ExamResult],
});
