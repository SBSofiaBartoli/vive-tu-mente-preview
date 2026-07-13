"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const supabaseClient = createSupabaseBrowserClient();
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("No pudimos iniciar sesión con esos datos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbfb] px-4 py-10 text-[#071a2f]">
      <section className="w-full max-w-md rounded-xl border border-[#dcebea] bg-white p-6 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#39b8bb]">
            Fundación Vive Tu Mente
          </p>
          <h1 className="mt-2 text-3xl font-bold">Ingreso administrativo</h1>
          <p className="mt-3 text-sm leading-6 text-[#52708a]">
            Acceso reservado para personas autorizadas a gestionar el sitio.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold">Correo electrónico</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#cfe3e2] px-4 py-3 outline-none transition focus:border-[#39b8bb] focus:ring-4 focus:ring-[#39b8bb]/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#cfe3e2] px-4 py-3 outline-none transition focus:border-[#39b8bb] focus:ring-4 focus:ring-[#39b8bb]/15"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#39b8bb] px-5 py-3 font-bold text-[#071a2f] transition hover:bg-[#7fdadd] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
