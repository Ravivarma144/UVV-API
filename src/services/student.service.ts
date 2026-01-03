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

  async bulkStudentInsert(data:[{
    fullName: string;
    email?: string;
    surName: string;
    phoneNumber?: string
  }],params:any)
  {
    const { schoolId } = params;

  if (!schoolId || !Array.isArray(data)) {
      throw new Error("school and students array are required");
  }

  const school = await this.schoolRepo.findOne({
    where: { id: schoolId, is_active: true }
  });

  if (!school) {
    throw new Error("Invalid school");
  }

  const entities: Student[] = [];

  for (const row of data) {
    if (!row.fullName || !row.surName) continue;

    const student = this.studentRepo.create({
      fullName: row.fullName,
      surName: row.surName,
      email: row.email || null,
      phoneNumber: row.phoneNumber || null,
      school
    });

    entities.push(student);
  }

    const saved = await this.studentRepo.save(entities);

    return {
      message: "Students inserted successfully",
      count: saved.length
    }
  }

  async getAllStudents()
  {
     return await this.studentRepo.find({
    relations: ["school"],
    order: { surName: "ASC" }
  });
  }

  async getStudentCounts()
  {
    
      const count = await this.studentRepo.count();

      const result = await AppDataSource.query(`
    SELECT 
      s.id AS "schoolId",
      s.name AS "schoolName",
      s.code as "schoolCode",
      COUNT(st.id) AS "studentCount"
    FROM schools s
    LEFT JOIN students st ON st.school_id = s.id
    GROUP BY s.id, s.name
    ORDER BY s.name
  `);
      return {
        total_count:count,
        school_wise_counts:result
      }
    
    //   res.json({ totalStudents: count });
    
  }

  async getStudentsBySchoolId(schoolId:string)
  {
  return await this.studentRepo.find({
    where: { school: { id: schoolId } },
    relations: ["school"]
  });

  }
  
}
