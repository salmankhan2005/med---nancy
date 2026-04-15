import express from "express";
import { db } from "../db/index.js";
import { reports, users, patients } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Get reports (filtered by role later, for now we return all or query by patient)
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { patientId } = req.query;
    let query = db.select({
      id: reports.id,
      testName: reports.testName,
      category: reports.category,
      status: reports.status,
      date: reports.date,
      labName: reports.labName,
      doctorNotes: reports.doctorNotes,
      results: reports.results,
      patientName: users.name, 
      patientId: patients.id
    })
    .from(reports)
    .leftJoin(patients, eq(reports.patientId, patients.id))
    .leftJoin(users, eq(patients.userId, users.id))
    .orderBy(desc(reports.date));
    
    if (patientId) {
      // @ts-ignore
      query = query.where(eq(reports.patientId, parseInt(patientId as string)));
    }

    const result = await query;
    res.json(result);
  } catch (error) {
    console.error("Get Reports Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { patientId, testName, category, labName, results } = req.body;
    
    // We should get labId from the authenticated user
    const userResult = await db.select().from(users).where(eq(users.firebaseUid, req.user?.uid!)).limit(1);
    const labId = userResult.length > 0 ? userResult[0].id : null;

    const newReport = await db.insert(reports).values({
      patientId: parseInt(patientId),
      labId,
      testName,
      category,
      labName,
      status: "processing", // Initial status
      results
    }).returning();

    // ToDo: Trigger real-time notification here if needed, 
    // or frontend will trigger it based on this successful response.
    
    res.json(newReport[0]);
  } catch (error) {
    console.error("Create Report Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status, doctorNotes } = req.body;
    const reportId = parseInt(req.params.id);

    const updated = await db.update(reports)
      .set({ 
        ...(status && { status }),
        ...(doctorNotes && { doctorNotes })
      })
      .where(eq(reports.id, reportId))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error("Update Report Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
