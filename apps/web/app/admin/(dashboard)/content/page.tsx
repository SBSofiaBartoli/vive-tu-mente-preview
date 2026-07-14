import { FaqsPanel } from "./faqs-panel";

export default function AdminContentPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Contenido</h2>
        <p className="mt-2 max-w-2xl text-[#52708a]">
          Edición de textos, preguntas frecuentes y secciones administrables del
          sitio institucional.
        </p>
      </div>

      <FaqsPanel />
    </section>
  );
}
