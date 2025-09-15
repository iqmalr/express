import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);

    console.log("Incoming token:", token,"\n");

    if (token === "mock-token" && process.env.NODE_ENV === "development") {
      (req as any).user = {
        id: "mock-user-id",
        email: "mock@example.com",
        name: "Mock User",
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error,"\n");
    res.status(401).json({ message: "Invalid token" });
  }
};
