export interface Report {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  category: string;
  date: string;
  status: "completed" | "processing" | "pending" | "reviewed";
  labName: string;
  doctorName?: string;
  doctorNotes?: string;
  results?: Record<string, { value: string; unit: string; range: string; status: "normal" | "high" | "low" }>;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  bloodType: string;
  lastVisit: string;
  reportsCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
}

export const mockReports: Report[] = [
  { id: "RPT-001", patientName: "Sarah Johnson", patientId: "PAT-001", testName: "Complete Blood Count", category: "Hematology", date: "2026-03-08", status: "completed", labName: "Metro Diagnostics", doctorName: "Dr. Smith", results: { "WBC": { value: "7.2", unit: "×10³/μL", range: "4.5-11.0", status: "normal" }, "RBC": { value: "4.8", unit: "×10⁶/μL", range: "4.0-5.5", status: "normal" }, "Hemoglobin": { value: "14.2", unit: "g/dL", range: "12.0-16.0", status: "normal" }, "Platelets": { value: "250", unit: "×10³/μL", range: "150-400", status: "normal" } } },
  { id: "RPT-002", patientName: "James Wilson", patientId: "PAT-002", testName: "Lipid Panel", category: "Biochemistry", date: "2026-03-07", status: "completed", labName: "City Lab Center", doctorName: "Dr. Patel", results: { "Total Cholesterol": { value: "220", unit: "mg/dL", range: "<200", status: "high" }, "HDL": { value: "55", unit: "mg/dL", range: ">40", status: "normal" }, "LDL": { value: "140", unit: "mg/dL", range: "<100", status: "high" }, "Triglycerides": { value: "150", unit: "mg/dL", range: "<150", status: "normal" } } },
  { id: "RPT-003", patientName: "Emily Chen", patientId: "PAT-003", testName: "Thyroid Function", category: "Endocrinology", date: "2026-03-06", status: "processing", labName: "Metro Diagnostics" },
  { id: "RPT-004", patientName: "Michael Brown", patientId: "PAT-004", testName: "Liver Function Test", category: "Biochemistry", date: "2026-03-05", status: "completed", labName: "HealthFirst Labs", doctorName: "Dr. Lee", results: { "ALT": { value: "25", unit: "U/L", range: "7-56", status: "normal" }, "AST": { value: "30", unit: "U/L", range: "10-40", status: "normal" }, "Bilirubin": { value: "0.8", unit: "mg/dL", range: "0.1-1.2", status: "normal" } } },
  { id: "RPT-005", patientName: "Sarah Johnson", patientId: "PAT-001", testName: "HbA1c", category: "Diabetes", date: "2026-03-04", status: "reviewed", labName: "Metro Diagnostics", doctorName: "Dr. Smith", doctorNotes: "HbA1c is within normal range. Continue current diet.", results: { "HbA1c": { value: "5.4", unit: "%", range: "<5.7", status: "normal" } } },
  { id: "RPT-006", patientName: "Robert Davis", patientId: "PAT-005", testName: "Urinalysis", category: "Clinical Pathology", date: "2026-03-03", status: "pending", labName: "City Lab Center" },
  { id: "RPT-007", patientName: "Lisa Wang", patientId: "PAT-006", testName: "Vitamin D", category: "Biochemistry", date: "2026-03-02", status: "completed", labName: "HealthFirst Labs", results: { "Vitamin D": { value: "18", unit: "ng/mL", range: "30-100", status: "low" } } },
  { id: "RPT-008", patientName: "James Wilson", patientId: "PAT-002", testName: "Kidney Function", category: "Nephrology", date: "2026-03-01", status: "completed", labName: "Metro Diagnostics", doctorName: "Dr. Patel", results: { "Creatinine": { value: "1.0", unit: "mg/dL", range: "0.7-1.3", status: "normal" }, "BUN": { value: "15", unit: "mg/dL", range: "7-20", status: "normal" }, "eGFR": { value: "95", unit: "mL/min", range: ">60", status: "normal" } } },
];

export const mockPatients: Patient[] = [
  { id: "PAT-001", name: "Sarah Johnson", age: 34, gender: "Female", email: "sarah@email.com", phone: "+1-555-0101", bloodType: "A+", lastVisit: "2026-03-08", reportsCount: 12 },
  { id: "PAT-002", name: "James Wilson", age: 45, gender: "Male", email: "james@email.com", phone: "+1-555-0102", bloodType: "O+", lastVisit: "2026-03-07", reportsCount: 8 },
  { id: "PAT-003", name: "Emily Chen", age: 28, gender: "Female", email: "emily@email.com", phone: "+1-555-0103", bloodType: "B+", lastVisit: "2026-03-06", reportsCount: 5 },
  { id: "PAT-004", name: "Michael Brown", age: 52, gender: "Male", email: "michael@email.com", phone: "+1-555-0104", bloodType: "AB-", lastVisit: "2026-03-05", reportsCount: 15 },
  { id: "PAT-005", name: "Robert Davis", age: 61, gender: "Male", email: "robert@email.com", phone: "+1-555-0105", bloodType: "O-", lastVisit: "2026-03-03", reportsCount: 20 },
  { id: "PAT-006", name: "Lisa Wang", age: 39, gender: "Female", email: "lisa@email.com", phone: "+1-555-0106", bloodType: "A-", lastVisit: "2026-03-02", reportsCount: 7 },
];

export const mockNotifications: Notification[] = [
  { id: "N-001", title: "Report Ready", message: "Your Complete Blood Count report is ready to view.", type: "success", date: "2026-03-08", read: false },
  { id: "N-002", title: "Appointment Reminder", message: "You have an appointment with Dr. Smith tomorrow at 10:00 AM.", type: "info", date: "2026-03-08", read: false },
  { id: "N-003", title: "High Cholesterol Alert", message: "Your LDL cholesterol levels are above the recommended range.", type: "warning", date: "2026-03-07", read: true },
  { id: "N-004", title: "Report Processing", message: "Your Thyroid Function test is being processed.", type: "info", date: "2026-03-06", read: true },
  { id: "N-005", title: "Vitamin D Deficiency", message: "Your Vitamin D levels are below normal. Please consult your doctor.", type: "error", date: "2026-03-02", read: false },
];

export const mockAppointments: Appointment[] = [
  { id: "APT-001", patientName: "Sarah Johnson", doctorName: "Dr. Smith", date: "2026-03-11", time: "10:00 AM", type: "Follow-up", status: "scheduled" },
  { id: "APT-002", patientName: "James Wilson", doctorName: "Dr. Patel", date: "2026-03-12", time: "2:30 PM", type: "Consultation", status: "scheduled" },
  { id: "APT-003", patientName: "Emily Chen", doctorName: "Dr. Lee", date: "2026-03-09", time: "11:00 AM", type: "Lab Review", status: "completed" },
  { id: "APT-004", patientName: "Michael Brown", doctorName: "Dr. Smith", date: "2026-03-13", time: "9:00 AM", type: "Annual Checkup", status: "scheduled" },
];

export const healthMetrics = {
  bloodPressure: [
    { month: "Oct", systolic: 120, diastolic: 80 },
    { month: "Nov", systolic: 118, diastolic: 78 },
    { month: "Dec", systolic: 122, diastolic: 82 },
    { month: "Jan", systolic: 119, diastolic: 79 },
    { month: "Feb", systolic: 121, diastolic: 81 },
    { month: "Mar", systolic: 117, diastolic: 77 },
  ],
  bloodSugar: [
    { month: "Oct", fasting: 95, postMeal: 140 },
    { month: "Nov", fasting: 92, postMeal: 135 },
    { month: "Dec", fasting: 98, postMeal: 145 },
    { month: "Jan", fasting: 90, postMeal: 130 },
    { month: "Feb", fasting: 93, postMeal: 138 },
    { month: "Mar", fasting: 88, postMeal: 128 },
  ],
  reportsByMonth: [
    { month: "Oct", count: 45 },
    { month: "Nov", count: 52 },
    { month: "Dec", count: 38 },
    { month: "Jan", count: 61 },
    { month: "Feb", count: 55 },
    { month: "Mar", count: 48 },
  ],
  reportsByCategory: [
    { name: "Hematology", value: 30 },
    { name: "Biochemistry", value: 25 },
    { name: "Endocrinology", value: 15 },
    { name: "Clinical Pathology", value: 18 },
    { name: "Microbiology", value: 12 },
  ],
};
