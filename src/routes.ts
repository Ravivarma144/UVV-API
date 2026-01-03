import { Router } from "express";
import { getSchools } from "./controllers/school.controller";
import { registerStudent } from "./controllers/student.controller";

const router = Router();

router.get("/schools", getSchools);
router.post("/students/register", registerStudent);

export default router;
