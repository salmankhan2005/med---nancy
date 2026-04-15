import { create } from "zustand";
import { auth, googleProvider } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { fetchApi } from "../lib/api";

export type UserRole = "patient" | "lab" | "doctor" | "admin";

export interface User {
  id?: number;
  firebaseUid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

const autoRegister = async (firebaseUser: any): Promise<{ user: User; isNew: boolean }> => {
  try {
    const profile = await fetchApi("/api/auth/me");
    return { user: profile, isNew: false };
  } catch (error: any) {
    if (error.message?.includes("User not found") || error.message?.includes("404") || error.message?.includes("not found")) {
      // New user — register them
      const newProfile = await fetchApi("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, role: "patient" })
      });
      return { user: newProfile, isNew: true };
    }
    throw error;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  needsOnboarding: false,

  login: async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged handles the rest
  },

  loginWithGoogle: async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged handles the rest
  },

  register: async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await fetchApi("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, role: "patient" })
    });
    // onAuthStateChanged handles redirect; mark as new user for onboarding
  },

  selectRole: async (role: UserRole) => {
    const updated = await fetchApi("/api/auth/me/role", {
      method: "PATCH",
      body: JSON.stringify({ role })
    });
    set({ user: { ...get().user!, role: updated.role }, needsOnboarding: false });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false, needsOnboarding: false });
  },

  initialize: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      set({ isLoading: true });
      if (firebaseUser) {
        try {
          const { user, isNew } = await autoRegister(firebaseUser);
          set({ user, isAuthenticated: true, isLoading: false, needsOnboarding: isNew });
        } catch (err) {
          console.error("Auth init failed", err);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false, needsOnboarding: false });
      }
    });
  },
}));

