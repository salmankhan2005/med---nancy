import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("patient"), // "patient" | "lab" | "doctor" | "admin"
  createdAt: timestamp("created_at").defaultNow()
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  age: integer("age"),
  gender: text("gender"),
  phone: text("phone"),
  bloodType: text("blood_type"),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  labId: integer("lab_id").references(() => users.id),
  doctorId: integer("doctor_id").references(() => users.id),
  testName: text("test_name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("pending"), // "completed" | "processing" | "pending" | "reviewed"
  date: timestamp("date").defaultNow(),
  labName: text("lab_name"),
  doctorNotes: text("doctor_notes"),
  results: jsonb("results") // Storing specific test results as JSON
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time").notNull(), // HH:MM AM/PM
  type: text("type").notNull(),
  status: text("status").notNull().default("scheduled") // "scheduled" | "completed" | "cancelled"
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // "info" | "warning" | "success" | "error"
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  metricType: text("metric_type").notNull(), // "bloodPressure", "bloodSugar" etc...
  value: jsonb("value").notNull(), // e.g: { systolic: 120, diastolic: 80 }
  recordedAt: timestamp("recorded_at").defaultNow()
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Can be null if system action
  action: text("action").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});
