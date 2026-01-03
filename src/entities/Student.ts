import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert, BeforeUpdate
} from "typeorm";
import { School } from "./Schools";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  surName!: string;

//   // OPTIONAL email
//   @Column({ nullable: true, unique: true })
//   email?: string;

//   // OPTIONAL phone number
//   @Column({ nullable: true, unique: true })
//   phoneNumber?: string;

//   // UNIQUE auto-generated login number
//   @Column({ unique: true })
//   loginNumber: string;

// OPTIONAL email (unique only when present)
  @Column({ type: "varchar", nullable: true, unique: true })
  email!: string | null;

  // OPTIONAL phone number (unique only when present)
  @Column({ type: "varchar", nullable: true, unique: true })
  phoneNumber!: string | null;

  // UNIQUE auto-generated login number
  @Column({ type: "varchar", unique: true })
  loginNumber!: string;

  @ManyToOne(() => School, school => school.students, { nullable: false })
  @JoinColumn({ name: "school_id" })
  school!: School;


  // 🔥 Normalize optional fields
  @BeforeInsert()
  @BeforeUpdate()
  normalizeOptionalFields() {
    this.email = this.email?.trim() || null;
    this.phoneNumber = this.phoneNumber?.trim() || null;
  }


  // Auto-generate unique login number before insert
  @BeforeInsert()
  generateLoginNumber() {
    // Example format: STU-2026-834275
    const random = Math.floor(100000 + Math.random() * 900000);
    this.loginNumber = `UVV-${new Date().getFullYear()}-${random}`;
  }
}
