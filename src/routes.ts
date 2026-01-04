import { Router } from "express";
import { getSchools } from "./controllers/school.controller";
import { registerStudent, bulkCreateStudents, getStudentsBySchool, getAllStudents, getStudentsCount } from "./controllers/student.controller";

const router = Router();

router.get("/schools", getSchools);
router.post("/students/register", registerStudent);
router.get("/students", getAllStudents);
router.get("/students/counts", getStudentsCount)
router.post("/student/bulk/:schoolId", bulkCreateStudents);
router.get("/students/school/:schoolId", getStudentsBySchool);
router.get("/name-image", (req, res) => {
    const text = req.query.text || "Default Text";

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    res.send(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="50%" y="50%" font-size="64"
        font-family="Arial, Helvetica, sans-serif"
        fill="#000000"
        text-anchor="middle"
        dominant-baseline="middle">
    ${text}
  </text>
</svg>
`);
});



export default router;
