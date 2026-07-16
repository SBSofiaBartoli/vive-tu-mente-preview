import { AdminSummaryPanel } from "./admin-summary-panel";

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Resumen</h2>
        <p className="mt-2 max-w-2xl text-[#52708a]">
          Vista general del estado actual del contenido y las revisiones del
          sitio.
        </p>
      </div>

      <AdminSummaryPanel />
    </section>
  );
}
