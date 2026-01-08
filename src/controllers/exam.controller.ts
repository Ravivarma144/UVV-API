import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Exam } from "../entities/Exams";

const examRepo = AppDataSource.getRepository(Exam);
const studentRepo = AppDataSource.getRepository("Student");
const resultRepo = AppDataSource.getRepository("ExamResult");

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

  result.status = status === "ABSENT" ?false:true;

  if (status) {
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

