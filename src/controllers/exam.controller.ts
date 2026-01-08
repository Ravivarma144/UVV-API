import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Exam } from "../entities/Exams";

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
