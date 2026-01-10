import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Exam } from "../entities/Exams";

const examRepo = AppDataSource.getRepository(Exam);
const studentRepo = AppDataSource.getRepository("Student");
const resultRepo = AppDataSource.getRepository("ExamResult");


type Marks = {
  telugu: number;
  hindi: number;
  english: number;
  maths: number;
  physicalScience: number;
  naturalScience: number;
  socialStudies: number;
  gk: number;
};

type SortedResult = {
  studentId: string;
  rollNumber: string;
  surName: string;
  fullName: string;
  schoolId: string;
  schoolName: string;
  totalMarks: number;
  isAbsent: boolean;
  marks: Marks;
};

function sortResults(data: SortedResult[]) {
  return [...data].sort((a, b) => {
    if (a.isAbsent && !b.isAbsent) return 1;
    if (!a.isAbsent && b.isAbsent) return -1;

    if (b.totalMarks !== a.totalMarks)
      return b.totalMarks - a.totalMarks;

    const priority: (keyof Marks)[] = [
      "maths",
      "physicalScience",
      "naturalScience",
      "socialStudies",
      "english",
      "gk",
      "telugu",
      "hindi",
    ];

    for (const key of priority) {
      if (b.marks[key] !== a.marks[key]) {
        return b.marks[key] - a.marks[key];
      }
    }

    return String(a.rollNumber).localeCompare(
      String(b.rollNumber),
      undefined,
      { numeric: true }
    );
  });
}


export const getExams = async (_: Request, res: Response) => {
  const exams = await AppDataSource.getRepository(Exam).find({
    order: { examDate: "DESC" },
  });
  res.json(exams);
};

export const createExam = async (req: Request, res: Response) => {
  try {
    const examRepo = AppDataSource.getRepository(Exam);
    const exam = examRepo.create(req.body);
    const savedExam = await examRepo.save(exam);
    res.status(201).json(savedExam);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const examRepo = AppDataSource.getRepository(Exam);
    const exam = await examRepo.findOneBy({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const examRepo = AppDataSource.getRepository(Exam);
    let exam = await examRepo.findOneBy({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    examRepo.merge(exam, req.body);
    const updatedExam = await examRepo.save(exam);
    res.json(updatedExam);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const examRepo = AppDataSource.getRepository(Exam);
    const exam = await examRepo.findOneBy({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    await examRepo.remove(exam);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getExamsCount = async (_: Request, res: Response) => {
  try {
    const examRepo = AppDataSource.getRepository(Exam);
    const count = await examRepo.count();
    res.json({ count });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addExamResult = async (req: Request, res: Response) => {
    try {
  const { examId } = req.params;
  const { studentId, status, marks } = req.body;

  const exam = await examRepo.findOneBy({ id: examId });
  if (!exam) return res.status(404).json({ message: "Exam not found" });

  const student = await studentRepo.findOneBy({ id: studentId });
  if (!student) return res.status(404).json({ message: "Student not found" });

  let result = await resultRepo.findOne({
    where: { exam: { id: examId }, student: { id: studentId } },
  });

  if (!result) {
    result = resultRepo.create({ exam, student });
  }

  result.status = status === "ABSENT" ? true : false;

  if (status==="ABSENT") {
    console.log("Absent Student - Setting all marks to 0");
    Object.assign(result, {
      telugu: 0,
      hindi: 0,
      english: 0,
      maths: 0,
      physicalScience: 0,
      naturalScience: 0,
      socialStudies: 0,
      gk: 0,
    });
  } else {
    console.log("Present Student - Saving provided marks");
    Object.assign(result, marks);
  }

  await resultRepo.save(result);

  res.json({ message: "Marks saved successfully" });
} catch (err: any) {
    res.status(400).json({ message: err.message });
  }

};

export const getExamResultsByExamId = async (
  req: Request,
  res: Response
) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    }

    // const resultRepo = AppDataSource.getRepository(ExamResult);

    const results = await resultRepo
      .createQueryBuilder("result")
      .leftJoinAndSelect("result.student", "student")
      .leftJoinAndSelect("student.school", "school")
      .leftJoin("result.exam", "exam")
      .where("exam.id = :examId", { examId })
      .orderBy("student.rollNumber", "ASC")
      .getMany();

    const formatted = results.map((r) => ({
      resultId: r.id,
      isAbsent: r.isAbsent,

      rollNumber: r.student.rollNumber,
      studentId: r.student.id,
      name: `${r.student.surName} ${r.student.fullName}`,
      studentSchool: r.student.school.name,
      studentSchoolId: r.student.school.id,

      marks: {
        telugu: r.telugu,
        hindi: r.hindi,
        english: r.english,
        maths: r.maths,
        physicalScience: r.physicalScience,
        naturalScience: r.naturalScience,
        socialStudies: r.socialStudies,
        gk: r.gk,
      },

      totalMarks: r.totalMarks,
    }));

    return res.json({
      examId,
      count: formatted.length,
      students: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolToppersByExamId = async (
  req: Request,
  res: Response
) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    }

    // 🔹 Fetch results
    const results = await resultRepo.find({
      where: {
        exam: { id: examId },
        isAbsent: false,
      },
      relations: ["student", "student.school"],
    });

    // 🔹 Normalize DB rows → SortedResult[]
    const normalized: SortedResult[] = results.map((r) => ({
      studentId: r.student.id,
      rollNumber: String(r.student.rollNumber),
      surName: r.student.surName,
      fullName: r.student.fullName,
      schoolId: r.student.school.id,
      schoolName: r.student.school.name,
      totalMarks: r.totalMarks,
      isAbsent: r.isAbsent,
      marks: {
        telugu: r.telugu,
        hindi: r.hindi,
        english: r.english,
        maths: r.maths,
        physicalScience: r.physicalScience,
        naturalScience: r.naturalScience,
        socialStudies: r.socialStudies,
        gk: r.gk,
      },
    }));

    // 1️⃣ Sort ALL students (overall ranking)
    const sortedOverall = sortResults(normalized);

    // 2️⃣ Extract overall TOP 10 student IDs
    const overallTop10Ids = new Set(
      sortedOverall.slice(0, 10).map((r) => r.studentId)
    );

    // 3️⃣ Group remaining students by school
    const schoolMap = new Map<string, SortedResult[]>();

    for (const r of sortedOverall) {
      if (overallTop10Ids.has(r.studentId)) continue; // ❌ exclude top 10

      if (!schoolMap.has(r.schoolId)) {
        schoolMap.set(r.schoolId, []);
      }
      schoolMap.get(r.schoolId)!.push(r);
    }

    // 4️⃣ Prepare school-wise toppers
    const schools = [];

    for (const [schoolId, rows] of schoolMap.entries()) {
      if (rows.length === 0) continue;

      const sortedSchool = sortResults(rows);
      const topScore = sortedSchool[0].totalMarks;

      const toppers = sortedSchool
        .filter((r) => r.totalMarks === topScore)
        .map((r) => ({
          studentId: r.studentId,
          rollNumber: r.rollNumber,
          name: `${r.surName} ${r.fullName}`,
          totalMarks: r.totalMarks,
          rank: 1,
        }));

      schools.push({
        schoolId,
        schoolName: rows[0].schoolName,
        toppers,
      });
    }

    // ✅ FINAL RESPONSE
    return res.json({
      examId,
      excludedOverallTop10Count: overallTop10Ids.size,
      schools,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to generate school toppers",
      error: error.message,
    });
  }
};



