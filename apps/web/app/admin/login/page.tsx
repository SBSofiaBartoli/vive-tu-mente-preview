"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8f6] px-4 py-10 text-[#071a2f]">
      <section className="w-full max-w-md rounded-2xl border border-[#dcebea] bg-white p-7 shadow-xl shadow-[#39b8bb]/10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eefafa]">
            <Image
              src="/images/vive-tu-mente.png"
              alt="Fundación Vive Tu Mente"
              width={65}
              height={65}
              className="h-[65px] w-[65px] object-contain"
            />
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#39b8bb]">
            Fundación Vive Tu Mente
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            Ingreso administrativo
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#52708a]">
            Acceso reservado para personas autorizadas.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-bold">
              <span
                className="material-symbols-outlined text-[#39b8bb]"
                style={{ fontSize: "20px" }}
              >
                mail
              </span>
              Correo electrónico
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#cfe3e2] bg-[#fbfdfd] px-4 py-3 outline-none transition focus:border-[#39b8bb] focus:ring-4 focus:ring-[#39b8bb]/15"
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-2 text-sm font-bold">
              <span
                className="material-symbols-outlined text-[#39b8bb]"
                style={{ fontSize: "20px" }}
              >
                lock
              </span>
              Contraseña
            </span>
            <div className="relative mt-2">
              <input
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#cfe3e2] bg-[#fbfdfd] px-4 py-3 pr-12 outline-none transition focus:border-[#39b8bb] focus:ring-4 focus:ring-[#39b8bb]/15"
              />

              <button
                type="button"
                aria-label={
                  isPasswordVisible
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                onClick={() =>
                  setIsPasswordVisible((currentValue) => !currentValue)
                }
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-[#52708a] transition hover:bg-[#eefafa] hover:text-[#39b8bb]"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "21px" }}
                >
                  {isPasswordVisible ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#39b8bb] px-5 py-3 font-bold text-[#071a2f] shadow-lg shadow-[#39b8bb]/20 transition hover:bg-[#7fdadd] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              login
            </span>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
