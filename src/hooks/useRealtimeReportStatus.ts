import { useEffect, useState } from "react";
import { subscribeToReportStatus } from "../lib/realtimeDb";

export function useRealtimeReportStatus(reportId: string, initialStatus: string) {
  const [status, setStatus] = useState<string>(initialStatus);

  useEffect(() => {
    if (!reportId) return;
    
    const unsubscribe = subscribeToReportStatus(reportId, (newStatus) => {
      if (newStatus) setStatus(newStatus);
    });

    return () => unsubscribe();
  }, [reportId]);

  return status;
}
