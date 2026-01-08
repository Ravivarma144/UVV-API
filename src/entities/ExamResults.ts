import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Exam } from "./Exams";
import { Student } from "./Student";
import {
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  Unique
} from "typeorm";

@Entity("exam_results")
@Unique(["exam", "student"])
export class ExamResult {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Exam)
  exam!: Exam;

  @ManyToOne(() => Student)
  student!: Student;

  @Column({ default: false })
  isAbsent!: boolean;

  // SUBJECT MARKS
  @Column({ default: 0 }) telugu!: number;
  @Column({ default: 0 }) hindi!: number;
  @Column({ default: 0 }) english!: number;
  @Column({ default: 0 }) maths!: number;
  @Column({ default: 0 }) physicalScience!: number;
  @Column({ default: 0 }) naturalScience!: number;
  @Column({ default: 0 }) socialStudies!: number;
  @Column({ default: 0 }) gk!: number;

  @Column({ default: 0 })
  totalMarks!: number;
  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    if (this.isAbsent) {
      this.totalMarks = 0;
      return;
    }

    this.totalMarks =
      this.telugu +
      this.hindi +
      this.english +
      this.maths +
      this.physicalScience +
      this.naturalScience +
      this.socialStudies +
      this.gk;
  }
}
