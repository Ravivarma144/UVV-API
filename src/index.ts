import "reflect-metadata"; // MUST be first import
import express from "express";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./data-source";
import { env } from "./env";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api",router);

AppDataSource.initialize().then(() => {
    console.info("*********************")
    console.log("Database connected !")
  app.listen(env.PORT || 3000, () => {
    console.log(`Backend running on http://localhost:${env.PORT||3000}`);
     console.info("*********************")
  });
});
