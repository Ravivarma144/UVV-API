import { Request, Response } from "express";
import { StudentService } from "../services/student.service";

const service = new StudentService();

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const student = await service.registerStudent(req.body);
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
