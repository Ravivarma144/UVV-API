import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { School } from "../entities/Schools";

export const getSchools = async (_: Request, res: Response) => {
  const schools = await AppDataSource.getRepository(School).find({
    where: { is_active: true },
  });
  res.json(schools);
};
