import express from "express";
import { db } from "../db";
import { appointments, users, patients } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { alias } from "drizzle-orm/pg-core";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const patientUser = alias(users, "patient_user");
    const doctorUser = alias(users, "doctor_user");

    const result = await db.select({
      id: appointments.id,
      patientName: patientUser.name,
      doctorName: doctorUser.name,
      date: appointments.date,
      time: appointments.time,
      type: appointments.type,
      status: appointments.status,
    })
    .from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .innerJoin(patientUser, eq(patients.userId, patientUser.id))
    .innerJoin(doctorUser, eq(appointments.doctorId, doctorUser.id))
    .orderBy(desc(appointments.date));

    res.json(result);
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

