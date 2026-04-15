import express from "express";
import { db } from "../db/index.js";
import { users, reports, auditLogs } from "../db/schema.js";
import { count, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalReports = await db.select({ count: count() }).from(reports);
    
    // In a real scenario, would calculate active labs
    res.json({
      totalUsers: totalUsers[0].count,
      totalReports: totalReports[0].count,
      activeLabs: 24, // Mocked for UI parity right now
      systemHealth: "99.9%"
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/audit-logs", requireAuth, async (req, res) => {
  try {
    const logs = await db.select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(20);
    res.json(logs);
  } catch (error) {
    console.error("Audit Logs Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
