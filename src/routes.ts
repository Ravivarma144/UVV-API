import { Router } from "express";
import { getSchools } from "./controllers/school.controller";
import { registerStudent ,bulkCreateStudents ,getStudentsBySchool, getAllStudents , getStudentsCount} from "./controllers/student.controller";

const router = Router();

router.get("/schools", getSchools);
router.post("/students/register", registerStudent);
router.get("/students",getAllStudents);
router.get("/students/counts",getStudentsCount)
router.post("/student/bulk/:schoolId",bulkCreateStudents);
router.get("/students/school/:schoolId",getStudentsBySchool);


export default router;
