"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DonationsPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-slate-900">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/vive-tu-mente.png"
                alt="Fundación Vive Tu Mente"
                width={56}
                height={56}
                className="h-12 w-auto"
                priority
              />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fundación Vive Tu Mente
              </span>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/"
              >
                Inicio
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/programs"
              >
                Programas
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/training"
              >
                Educación
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/about_us"
              >
                Sobre Nosotros
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/participate"
              >
                Participar
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <details className="group/mobile-menu relative lg:hidden">
                <summary
                  className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-primary/20 text-slate-900 transition-colors hover:bg-primary/10 [&::-webkit-details-marker]:hidden"
                  aria-label="Abrir menú"
                >
                  <span className="material-symbols-outlined group-open/mobile-menu:hidden">
                    menu
                  </span>
                  <span className="material-symbols-outlined hidden group-open/mobile-menu:inline">
                    close
                  </span>
                </summary>

                <div className="absolute right-0 top-12 z-[60] w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/"
                  >
                    Inicio
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/programs"
                  >
                    Programas
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/training"
                  >
                    Educación
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/about_us"
                  >
                    Sobre Nosotros
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/participate#formulario"
                  >
                    Participar
                  </Link>
                </div>
              </details>

              <Link
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-all hover:shadow-lg hover:shadow-primary/20"
                href="/donations"
                aria-current="page"
              >
                Donación
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Apoya nuestra misión
              </span>

              <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl">
                Transformando vidas a través del{" "}
                <span className="text-primary">bienestar mental.</span>
              </h1>

              <p className="mb-8 max-w-lg text-lg text-slate-600">
                Tu contribución financia directamente asesoramiento, recursos
                educativos y intervención en crisis para quienes más lo
                necesitan.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="no-scrollbar mb-10 flex overflow-x-auto border-b border-primary/10">
            <button
              type="button"
              className="flex items-center gap-2 border-b-4 border-primary px-6 py-4 text-sm font-bold text-slate-900"
            >
              <span className="material-symbols-outlined text-[20px]">
                account_balance
              </span>
              Transferencia Bancaria
            </button>

            <button
              type="button"
              className="flex cursor-not-allowed items-center gap-2 whitespace-nowrap border-b-4 border-transparent px-6 py-4 text-sm font-medium text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">
                credit_card
              </span>
              Pago en Línea (Próximamente)
            </button>

            <button
              type="button"
              className="flex cursor-not-allowed items-center gap-2 whitespace-nowrap border-b-4 border-transparent px-6 py-4 text-sm font-medium text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">
                smartphone
              </span>
              Pagos PAC/PAT (Próximamente)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-6">
              <div className="rounded-2xl border border-primary/10 bg-white p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <span className="material-symbols-outlined text-primary">
                    info
                  </span>
                  Instrucciones de Transferencia
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                    <span className="text-sm text-slate-500">Banco</span>
                    <span className="text-sm font-bold">Banco Estado</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                    <span className="text-sm text-slate-500">
                      Titular de la Cuenta
                    </span>
                    <span className="text-end text-sm font-bold">
                      FUNDACION VIVE TU MENTE <br />
                      PARA LA SALUD MENTAL INCLUSION Y BIENESTAR DE PERSONAS
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                    <span className="text-sm text-slate-500">Rut Cuenta</span>
                    <span className="text-sm font-bold">65.260.111-1</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                    <span className="text-sm text-slate-500">
                      Número de Cuenta
                    </span>
                    <span className="text-sm font-bold">30471587059</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Tipo Cuenta</span>
                    <span className="text-sm font-bold">
                      Chequera Electrónica
                    </span>
                  </div>
                </div>

                <div className="mt-8 rounded-lg border border-primary/20 bg-primary/10 p-4">
                  <p className="flex gap-3 text-xs text-slate-600">
                    <span className="material-symbols-outlined shrink-0 text-[20px] text-primary">
                      verified_user
                    </span>
                    Utilice &quot;FVTM-DONATION&quot; seguido de su apellido
                    como referencia de transferencia al momento de indicar un
                    mensaje, para una conciliación más rápida.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8 text-center">
                <h3 className="mb-2 font-bold">Promesa de Transparencia</h3>
                <p className="text-sm text-slate-500">
                  El 100% de su donación se destina directamente a los costos
                  del proyecto. Nuestros gastos administrativos están cubiertos
                  por patrocinadores corporativos.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-primary/10 bg-white p-8 shadow-sm">
                <h2 className="mb-2 text-xl font-bold">Informar tu donación</h2>
                <p className="mb-8 text-sm text-slate-500">
                  Una vez que haya completado la transferencia bancaria,
                  complete este formulario para que podamos reconocer su
                  donación y enviarle su recibo.
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-semibold"
                        htmlFor="donor-name"
                      >
                        Nombre Completo
                      </label>
                      <input
                        id="donor-name"
                        name="donor_name"
                        type="text"
                        required
                        placeholder="María González"
                        className="w-full rounded-lg border border-primary/10 bg-background px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-semibold"
                        htmlFor="donor-email"
                      >
                        Correo Electrónico
                      </label>
                      <input
                        id="donor-email"
                        name="donor_email"
                        type="email"
                        required
                        placeholder="nombre@correo.com"
                        className="w-full rounded-lg border border-primary/10 bg-background px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="donation-amount"
                    >
                      Monto de la donación ($)
                    </label>
                    <input
                      id="donation-amount"
                      name="donation_amount"
                      type="number"
                      min="0"
                      placeholder="0.000"
                      className="w-full rounded-lg border border-primary/10 bg-background px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="donation-receipt"
                    >
                      Subir Comprobante de Transferencia
                    </label>

                    <div className="group relative cursor-pointer">
                      <input
                        id="donation-receipt"
                        name="donation_receipt"
                        type="file"
                        aria-describedby="donation-receipt-help"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />

                      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 py-10 transition-colors group-hover:border-primary/40">
                        <span className="material-symbols-outlined mb-2 text-4xl text-primary">
                          cloud_upload
                        </span>
                        <p className="text-sm font-medium">
                          Clic para subir o arrastrar y soltar
                        </p>
                        <p
                          className="mt-1 text-xs text-slate-400"
                          id="donation-receipt-help"
                        >
                          PDF, JPG, o PNG (Máx 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary py-4 text-sm font-black uppercase tracking-widest text-background-dark shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    Enviar Informe de Donación
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-slate-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6 flex items-center gap-2 text-white">
                <Image
                  src="/images/vive-tu-mente.png"
                  alt="Fundación Vive Tu Mente"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold">
                  Fundación Vive Tu Mente
                </span>
              </div>

              <p className="max-w-sm text-sm leading-relaxed">
                Dedicada a romper el estigma en torno a la salud mental y
                proporcionar sistemas de apoyo accesibles para comunidades
                globales. Organización sin fines de lucro registrada N° 386717.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/programs"
                  >
                    Programas
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/training"
                  >
                    Educación
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/blog"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/about_us"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/participate#formulario"
                  >
                    Participación
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex min-w-0 items-start gap-2">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: "16px" }}
                  >
                    mail
                  </span>
                  <a
                    className="min-w-0 break-all transition-colors hover:text-primary"
                    href="mailto:contacto@tuautocuidado.cl"
                  >
                    contacto@tuautocuidado.cl
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: "16px" }}
                  >
                    link
                  </span>
                  <a
                    className="transition-colors hover:text-primary"
                    href="https://www.linkedin.com/company/vivetumente/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            <p>
              © 2026 Fundación Vive Tu Mente. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        {isHelpOpen ? (
          <div className="flex w-[calc(100vw-2rem)] flex-col gap-4 rounded-2xl border-t-4 border-primary bg-white p-5 shadow-2xl sm:w-96">
            <div className="flex items-start justify-between gap-2">
              <p className="brand-title text-base font-bold leading-snug text-slate-900">
                ¿Necesitás ayuda ahora?
              </p>

              <button
                type="button"
                aria-label="Cerrar"
                className="text-lg leading-none text-slate-400 transition-colors hover:text-primary"
                onClick={() => setIsHelpOpen(false)}
              >
                ×
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
              Si estás pasando por un momento difícil, hay personas capacitadas
              esperando escucharte. Es gratis y confidencial.
            </p>

            <a
              href="tel:*4141"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-background px-3 py-3 transition-all hover:border-primary hover:bg-primary/5"
            >
              <span className="flex-shrink-0 text-2xl">📞</span>
              <div className="flex flex-col gap-0.5">
                <span className="block text-sm font-bold text-slate-800">
                  Línea Prevención del Suicidio
                </span>
                <span className="block text-lg font-extrabold tracking-wide text-primary">
                  *4141
                </span>
                <span className="block text-xs text-slate-500">
                  Ministerio de Salud · Gratis · 24/7
                </span>
              </div>
            </a>

            <a
              href="tel:6003607777"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-background px-3 py-3 transition-all hover:border-primary hover:bg-primary/5"
            >
              <span className="flex-shrink-0 text-2xl">🧠</span>
              <div className="flex flex-col gap-0.5">
                <span className="block text-sm font-bold text-slate-800">
                  Salud Responde · Opción 2
                </span>
                <span className="block text-lg font-extrabold tracking-wide text-primary">
                  600 360 7777
                </span>
                <span className="block text-xs text-slate-500">
                  Psicólogos · Gratis · 24/7
                </span>
              </div>
            </a>

            <p className="border-t border-slate-100 pt-3 text-center text-xs leading-relaxed text-slate-500">
              Si estás en peligro inmediato, llamá al{" "}
              <strong className="text-slate-700">131</strong> o acudí a
              urgencias.
            </p>
          </div>
        ) : null}

        <button
          type="button"
          aria-label="Necesitás ayuda ahora"
          className="flex items-center gap-2.5 rounded-full bg-primary px-4 py-4 text-sm font-bold text-background-dark shadow-lg shadow-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/50 sm:px-5 sm:py-3.5"
          onClick={() => setIsHelpOpen((currentValue) => !currentValue)}
        >
          <span className="vtm-pulse-dot h-2 w-2 flex-shrink-0 rounded-full bg-background-dark" />
          ¿Necesitás ayuda ahora?
        </button>
      </div>
    </div>
  );
}
