import Image from "next/image";
import Link from "next/link";
import { AdminAuthGuard } from "../admin-auth-guard";
import { AdminLogoutButton } from "./admin-logout-button";

const adminNavItems = [
  { href: "/admin", label: "Resumen", icon: "space_dashboard" },
  { href: "/admin/participation", label: "Participación", icon: "forum" },
  { href: "/admin/articles", label: "Artículos", icon: "article" },
  { href: "/admin/testimonials", label: "Testimonios", icon: "reviews" },
  { href: "/admin/education", label: "Educación", icon: "school" },
  { href: "/admin/content", label: "Contenido", icon: "edit_note" },
  { href: "/admin/files", label: "Archivos", icon: "folder_open" },
  { href: "/admin/donations", label: "Donaciones", icon: "volunteer_activism" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <main className="min-h-screen bg-[#f6f8f6] text-[#071a2f]">
        <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-[#dcebea] bg-white px-4 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
            <div className="mb-6 rounded-2xl bg-[#eefafa] p-4">
              <p className="mt-2 text-sm leading-5 text-[#52708a]">
                Gestión interna del sitio.
              </p>
            </div>

            <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#1d3351] transition hover:bg-[#e7f8f8] hover:text-[#0b777b] lg:w-full"
                >
                  <span
                    className="material-symbols-outlined text-[#39b8bb] transition group-hover:text-[#0b777b]"
                    style={{ fontSize: "22px" }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="flex min-w-0 flex-col">
            <header className="flex flex-col gap-3 border-b border-[#dcebea] bg-white/90 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between lg:px-6 lg:py-5">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/vive-tu-mente.png"
                  alt="Fundación Vive Tu Mente"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
                <div>
                  <p className="text-xl font-extrabold tracking-tight">
                    Fundación Vive Tu Mente
                  </p>
                </div>
              </div>

              <AdminLogoutButton />
            </header>

            <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</div>
          </section>
        </div>
      </main>
    </AdminAuthGuard>
  );
}
