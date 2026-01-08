import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("exams")
export class Exam {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string; // UVV Talent Test – 2026

  @Column({ default: 120 })
  totalMarks!: number;

  @Column({ type: "date" })
  examDate!: Date;
}
