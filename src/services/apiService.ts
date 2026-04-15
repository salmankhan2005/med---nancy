import { fetchApi } from '../lib/api';

export const reportsService = {
  getReports: async (patientId?: string) => {
    const url = patientId ? `/api/reports?patientId=${patientId}` : "/api/reports";
    return fetchApi(url);
  },
  createReport: async (data: any) => {
    return fetchApi("/api/reports", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  updateReport: async (id: number, data: any) => {
    return fetchApi(`/api/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  }
};

export const patientsService = {
  getPatients: async () => {
    return fetchApi("/api/patients");
  }
};

export const appointmentsService = {
  getAppointments: async () => {
    return fetchApi("/api/appointments");
  }
};

export const adminService = {
  getStats: async () => {
    return fetchApi("/api/admin/stats");
  },
  getAuditLogs: async () => {
    return fetchApi("/api/admin/audit-logs");
  }
};
