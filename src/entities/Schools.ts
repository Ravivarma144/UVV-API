import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
import { Student } from "./Student";

@Entity("schools")
export class School {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ default: true })
  is_active!: boolean;

  @OneToMany(() => Student, student => student.school)
  students!: Student[];
}
