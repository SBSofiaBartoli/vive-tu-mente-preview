import { EducationPanel } from "./education-panel";

export default function AdminEducationPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Educación</h2>
        <p className="mt-2 max-w-2xl text-[#52708a]">
          Administración de cards educativas, segmentos y tips de aprendizaje.
        </p>
      </div>

      <EducationPanel />
    </section>
  );
}
