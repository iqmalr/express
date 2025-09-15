import { Router } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/google", async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Access token required" });
    }

    console.log("✅ Google accessToken:", accessToken, "\n");

    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );

    console.log("✅ Response userinfo:", response.data);

    const { sub: googleId, email, name, picture } = response.data;

    let user = await User.findOne({ where: { googleId } });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
    }

    console.log("✅ User in DB:", user.toJSON(), "\n");

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ JWT generated:", token, "\n");

    res.json({ token, user });
  } catch (error: any) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Invalid Google token" });
  }
});
router.delete("/users", authMiddleware, async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Forbidden in production" });
    }

    await User.destroy({ where: {}, truncate: true });
    res.json({ message: "All users deleted successfully" });
  } catch (err: any) {
    console.error("Delete all users error:", err);
    res.status(500).json({ message: "Failed to delete users" });
  }
});
router.delete("/dev/users/reset", async (req, res) => {
  try {
    console.log("🔄 Development reset: Deleting all users...");

    const deletedCount = await User.destroy({
      where: {},
      truncate: true,
    });

    console.log(`✅ Deleted ${deletedCount} users from database`);

    res.json({
      message: "All users deleted. Please sign out on frontend.",
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Development reset error:", error);
    res.status(500).json({
      message: "Failed to reset users",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});
export default router;
