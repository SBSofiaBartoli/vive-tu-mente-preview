"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase-client";

export function AdminAuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const supabaseClient = createSupabaseBrowserClient();

    const checkSession = async () => {
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setIsCheckingSession(false);
    };

    void checkSession();
  }, [router]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfb] px-4 text-[#071a2f]">
        <p className="text-sm font-semibold text-[#52708a]">
          Verificando acceso...
        </p>
      </main>
    );
  }

  return children;
}
