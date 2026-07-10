import Link from "next/link";

const adminNavItems = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/participation", label: "Participación" },
  { href: "/admin/articles", label: "Artículos" },
  { href: "/admin/testimonials", label: "Testimonios" },
  { href: "/admin/education", label: "Educación" },
  { href: "/admin/content", label: "Contenido" },
  { href: "/admin/files", label: "Archivos" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#f7fbfb] text-[#071a2f]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#dcebea] bg-white px-6 py-6">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#39b8bb]">
              Fundación Vive Tu Mente
            </p>
            <h1 className="mt-2 text-2xl font-bold">Dashboard</h1>
          </div>

          <nav className="space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-sm font-semibold text-[#1d3351] transition hover:bg-[#e7f8f8] hover:text-[#0b777b]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="border-b border-[#dcebea] bg-white px-6 py-5">
            <p className="text-sm font-medium text-[#52708a]">
              Panel administrativo
            </p>
          </header>

          <div className="flex-1 px-6 py-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
