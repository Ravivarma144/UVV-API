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

export const bulkCreateStudents = async (req: Request, res: Response) => {
  try {
    const bulkStudent = await service.bulkStudentInsert(req.body,req.params);
    res.status(201).json(bulkStudent);
  }
  catch(err: any)
  {
    res.status(400).json({message: err.message})
  }
};

export const getAllStudents = async (_: Request, res: Response) => {

   try {
    const students = await service.getAllStudents();
    res.status(201).json({
        count: students.length,
        students
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


export const getStudentsCount = async (_: Request, res: Response) => {
  
   try {
    const counts = await service.getStudentCounts();
    res.status(201).json(counts);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getStudentsBySchool = async (
  req: Request,
  res: Response
) => {

     try {
      const { schoolId} =  req.params;
       if (!schoolId) {
      throw new Error("School not authorized");
    }
    const students = await service.getStudentsBySchoolId(schoolId);
    res.json({
    schoolId,
    count: students.length,
    students
  });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
  
};
