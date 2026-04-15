import express from "express";
import { db } from "../db/index.js";
import { patients, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all patients
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await db.select({
      id: patients.id,
      name: users.name,
      email: users.email,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      bloodType: patients.bloodType,
    })
    .from(patients)
    .innerJoin(users, eq(patients.userId, users.id));

    res.json(result);
  } catch (error) {
    console.error("Get Patients Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
