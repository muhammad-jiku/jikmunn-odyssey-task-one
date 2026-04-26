"use client";

import { firebaseEnabled, getFirebaseAuth, googleProvider } from "@/lib/firebase";
import
    {
        GoogleAuthProvider,
        createUserWithEmailAndPassword,
        onAuthStateChanged,
        signInWithEmailAndPassword,
        signInWithPopup,
        signOut,
        updateProfile,
        type User,
    } from "firebase/auth";
import
    {
        createContext,
        useCallback,
        useContext,
        useEffect,
        useMemo,
        useState,
        type ReactNode,
    } from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  firebaseEnabled: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function ensureAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.",
    );
  }
  return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(ensureAuth(), email, password);
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const cred = await createUserWithEmailAndPassword(
        ensureAuth(),
        email,
        password,
      );
      if (displayName && cred.user) {
        await updateProfile(cred.user, { displayName });
        setUser({ ...cred.user });
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    const provider =
      googleProvider instanceof GoogleAuthProvider
        ? googleProvider
        : new GoogleAuthProvider();
    await signInWithPopup(ensureAuth(), provider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(ensureAuth());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      firebaseEnabled,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, loading, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

