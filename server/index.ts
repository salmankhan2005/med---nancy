import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Allow Firebase Google popup to communicate with the opener
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Routes will be imported here
import authRoutes from "./routes/auth";
import reportsRoutes from "./routes/reports";
import patientsRoutes from "./routes/patients";
import appointmentsRoutes from "./routes/appointments";
import adminRoutes from "./routes/admin";
import seedRoutes from "./routes/seed";

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seed", seedRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
