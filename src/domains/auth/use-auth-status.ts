"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/domains/user/store";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function useAuthStatus() {
  const demoSession = useUserStore((state) => state.demoSession);
  const [realSession, setRealSession] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setLoading(false); return; }
    void supabase.auth.getSession().then(({ data }) => { setRealSession(Boolean(data.session)); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setRealSession(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);
  return { authenticated: demoSession || realSession, demoSession, loading };
}
