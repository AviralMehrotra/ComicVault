import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Fetch profile whenever session changes
  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [session]);

  // Listen to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Sign up
  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  // Sign in
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
