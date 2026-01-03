import { AppDataSource } from "../data-source";
import { Student } from "../entities/Student";
import { School } from "../entities/Schools";

export class StudentService {
  private studentRepo = AppDataSource.getRepository(Student);
  private schoolRepo = AppDataSource.getRepository(School);

  async registerStudent(data: {
    fullName: string;
    email?: string;
    schoolId: string;
    surName: string;
    phoneNumber?: string

  }) {
    const school = await this.schoolRepo.findOne({
      where: { id: data.schoolId, is_active: true },
    });

    if (!school) {
      throw new Error("School not authorized");
    }

    const student = this.studentRepo.create({
      fullName: data.fullName,
      email: data.email,
      school,
      surName: data.surName,
      phoneNumber: data.phoneNumber

    });

    return this.studentRepo.save(student);
  }
}
