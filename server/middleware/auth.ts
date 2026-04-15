import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request<any, any, any, any> {
  user?: {
    uid: string;
    email?: string;
  };
}

// Verifies a Firebase ID token using the REST API (no service account needed)
const verifyFirebaseToken = async (token: string): Promise<{ uid: string; email?: string }> => {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("VITE_FIREBASE_API_KEY not set");

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    }
  );

  if (!response.ok) {
    throw new Error("Token verification failed");
  }

  const data = await response.json();
  if (!data.users || data.users.length === 0) {
    throw new Error("No user found for token");
  }

  const user = data.users[0];
  return { uid: user.localId, email: user.email };
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = (req as any).headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer Token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await verifyFirebaseToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid Token" });
  }
};
