import express from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/register", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, role } = req.body;
    const uid = req.user?.uid!;
    const email = req.user?.email!;

    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.firebaseUid, uid)).limit(1);
    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    // Insert new user
    const newUser = await db.insert(users).values({
      firebaseUid: uid,
      email,
      name,
      role: role || "patient"
    }).returning();

    res.json(newUser[0]);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid!;
    
    const userResult = await db.select().from(users).where(eq(users.firebaseUid, uid)).limit(1);
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(userResult[0]);
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update user role (called during onboarding)
router.patch("/me/role", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid!;
    const { role } = req.body;

    const validRoles = ["patient", "lab", "doctor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updated = await db
      .update(users)
      .set({ role })
      .where(eq(users.firebaseUid, uid))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Update Role Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
