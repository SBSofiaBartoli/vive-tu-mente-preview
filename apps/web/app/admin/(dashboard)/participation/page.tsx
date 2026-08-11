import { ParticipationMessagesPanel } from "./participation-messages-panel";

export default function AdminParticipationPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Participación</h2>
        <p className="mt-2 max-w-2xl text-[#52708a]">
          Gestión de mensajes enviados desde el formulario de participación.
        </p>
      </div>
      <ParticipationMessagesPanel />
    </section>
  );
}
