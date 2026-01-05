import { Router } from "express";
import { getSchools } from "./controllers/school.controller";
import { registerStudent, bulkCreateStudents, getStudentsBySchool, getAllStudents, getStudentsCount } from "./controllers/student.controller";

const router = Router();

router.get("/schools", getSchools);
router.post("/students/register", registerStudent);
router.get("/students", getAllStudents);
router.get("/students/counts", getStudentsCount);
// router.get("/students/json/school", bulkCreateStudents);
router.post("/student/bulk/:schoolId", bulkCreateStudents);
router.get("/students/school/:schoolId", getStudentsBySchool);
router.get("/name-image", (req, res) => {

const rawText = String(req.query.text || "")
  const safeText = rawText.replace(/[<>]/g, "");

  const words = safeText.trim().split(/\s+/);

  const line1 = words.slice(0, 2).join(" ");
  const line2 = words.slice(2).join(" ");

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  res.send(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160">
  <rect width="100%" height="100%" fill="#ffffff"/>

  <text x="50%" y="50%"
        font-family="Arial, Helvetica, sans-serif"
        fill="#000000"
        text-anchor="middle"
        dominant-baseline="middle">

    <tspan x="50%" dy="-0.6em" font-size="28">${line1}</tspan>
    <tspan x="50%" dy="1.4em" font-size="18">• ${line2}</tspan>

  </text>
</svg>
`);

});



export default router;
