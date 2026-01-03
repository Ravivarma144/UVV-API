import "reflect-metadata"; // MUST be first import
import express from "express";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./data-source";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api",router);

AppDataSource.initialize().then(() => {
  app.listen(4000, () => {
    console.log("Backend running on http://localhost:4000");
  });
});
