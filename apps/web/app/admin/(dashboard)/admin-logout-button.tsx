"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabaseClient = createSupabaseBrowserClient();

    await supabaseClient.auth.signOut();

    router.replace("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-[#dcebea] px-4 py-2 text-sm font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91]"
    >
      Cerrar sesión
    </button>
  );
}
