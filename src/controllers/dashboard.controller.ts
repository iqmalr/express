import { Request, Response } from "express";

export const getDashboard = (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    message: "Welcome to Dashboard 🎉",
    user,
  });
};
