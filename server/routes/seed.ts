import express from "express";
import { db } from "../db/index.js";
import { users, patients, reports, appointments, notifications, healthMetrics } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// POST /api/seed  — Seeds realistic demo data for the logged-in user
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid!;

    // 1. Get the current user
    const [currentUser] = await db.select().from(users).where(eq(users.firebaseUid, uid)).limit(1);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // 2. Ensure a doctor + lab user exist (seeded system users)
    let doctorUser = (await db.select().from(users).where(eq(users.email, "dr.sharma@diagaccess.demo")).limit(1))[0];
    if (!doctorUser) {
      [doctorUser] = await db.insert(users).values({
        firebaseUid: "seed-doctor-001",
        email: "dr.sharma@diagaccess.demo",
        name: "Dr. Priya Sharma",
        role: "doctor",
      }).returning();
    }

    let labUser = (await db.select().from(users).where(eq(users.email, "lab@diagaccess.demo")).limit(1))[0];
    if (!labUser) {
      [labUser] = await db.insert(users).values({
        firebaseUid: "seed-lab-001",
        email: "lab@diagaccess.demo",
        name: "MedLab Diagnostics",
        role: "lab",
      }).returning();
    }

    // 3. Ensure patient record exists for current user
    let patientRecord = (await db.select().from(patients).where(eq(patients.userId, currentUser.id)).limit(1))[0];
    if (!patientRecord) {
      [patientRecord] = await db.insert(patients).values({
        userId: currentUser.id,
        age: 29,
        gender: "Other",
        phone: "+91-9876543210",
        bloodType: "O+",
      }).returning();
    }

    // 4. Seed reports
    const seedReports = [
      {
        patientId: patientRecord.id,
        labId: labUser.id,
        doctorId: doctorUser.id,
        testName: "Complete Blood Count (CBC)",
        category: "Hematology",
        labName: "MedLab Diagnostics",
        status: "completed",
        doctorNotes: "All values within normal range. Continue current medication.",
        results: {
          Hemoglobin:   { value: "14.2", unit: "g/dL", status: "normal" },
          WBC:          { value: "7500", unit: "cells/µL", status: "normal" },
          Platelets:    { value: "250000", unit: "cells/µL", status: "normal" },
          RBC:          { value: "4.8", unit: "million/µL", status: "normal" },
        },
      },
      {
        patientId: patientRecord.id,
        labId: labUser.id,
        doctorId: doctorUser.id,
        testName: "Thyroid Panel (T3, T4, TSH)",
        category: "Endocrinology",
        labName: "MedLab Diagnostics",
        status: "reviewed",
        doctorNotes: "Mild hypothyroidism detected. Starting low-dose thyroxine.",
        results: {
          TSH:  { value: "6.2", unit: "mIU/L", status: "high" },
          T3:   { value: "3.1", unit: "pg/mL", status: "normal" },
          T4:   { value: "0.8", unit: "ng/dL", status: "low" },
        },
      },
      {
        patientId: patientRecord.id,
        labId: labUser.id,
        testName: "Lipid Profile",
        category: "Biochemistry",
        labName: "MedLab Diagnostics",
        status: "processing",
        results: null,
      },
      {
        patientId: patientRecord.id,
        labId: labUser.id,
        testName: "Blood Glucose (Fasting)",
        category: "Biochemistry",
        labName: "MedLab Diagnostics",
        status: "pending",
        results: null,
      },
    ];

    for (const r of seedReports) {
      await db.insert(reports).values(r as any);
    }

    // 5. Seed appointments
    const seedAppointments = [
      {
        patientId: patientRecord.id,
        doctorId: doctorUser.id,
        date: "2026-04-20",
        time: "10:30 AM",
        type: "Follow-up Consultation",
        status: "scheduled",
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorUser.id,
        date: "2026-03-15",
        time: "09:00 AM",
        type: "General Checkup",
        status: "completed",
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorUser.id,
        date: "2026-05-05",
        time: "03:00 PM",
        type: "Lab Results Review",
        status: "scheduled",
      },
    ];

    for (const a of seedAppointments) {
      await db.insert(appointments).values(a);
    }

    // 6. Seed notifications
    const seedNotifications = [
      {
        userId: currentUser.id,
        title: "Report Ready",
        message: "Your Complete Blood Count (CBC) report is ready to view.",
        type: "success",
        read: false,
      },
      {
        userId: currentUser.id,
        title: "Doctor Note Added",
        message: "Dr. Priya Sharma added notes to your Thyroid Panel report.",
        type: "info",
        read: false,
      },
      {
        userId: currentUser.id,
        title: "Appointment Reminder",
        message: "You have a Follow-up Consultation on April 20 at 10:30 AM.",
        type: "warning",
        read: false,
      },
      {
        userId: currentUser.id,
        title: "Report Processing",
        message: "Your Lipid Profile is currently being processed by the lab.",
        type: "info",
        read: true,
      },
    ];

    for (const n of seedNotifications) {
      await db.insert(notifications).values(n);
    }

    // 7. Seed health metrics
    const now = new Date();
    const metricsData = [
      { metricType: "bloodPressure", value: { systolic: 118, diastolic: 76 }, daysAgo: 0 },
      { metricType: "bloodPressure", value: { systolic: 122, diastolic: 80 }, daysAgo: 1 },
      { metricType: "bloodPressure", value: { systolic: 125, diastolic: 82 }, daysAgo: 2 },
      { metricType: "bloodSugar", value: { level: 94 }, daysAgo: 0 },
      { metricType: "bloodSugar", value: { level: 102 }, daysAgo: 1 },
      { metricType: "bloodSugar", value: { level: 98 }, daysAgo: 2 },
      { metricType: "heartRate", value: { bpm: 72 }, daysAgo: 0 },
      { metricType: "heartRate", value: { bpm: 75 }, daysAgo: 1 },
      { metricType: "weight", value: { kg: 68.5 }, daysAgo: 0 },
    ];

    for (const m of metricsData) {
      const recordedAt = new Date(now);
      recordedAt.setDate(now.getDate() - m.daysAgo);
      await db.insert(healthMetrics).values({
        patientId: patientRecord.id,
        metricType: m.metricType,
        value: m.value,
        recordedAt,
      });
    }

    res.json({ success: true, message: "Demo data seeded successfully!", patientId: patientRecord.id });
  } catch (error) {
    console.error("Seed Error:", error);
    res.status(500).json({ error: "Seeding failed", details: String(error) });
  }
});

export default router;
