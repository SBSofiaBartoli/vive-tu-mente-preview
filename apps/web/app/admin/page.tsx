const summaryCards = [
  {
    title: "Mensajes",
    value: "Participación",
    description: "Solicitudes recibidas desde el formulario.",
  },
  {
    title: "Blog",
    value: "Artículos",
    description: "Propuestas, revisión y publicaciones.",
  },
  {
    title: "Educación",
    value: "Cards y tips",
    description: "Contenido educativo editable por segmento.",
  },
  {
    title: "Archivos",
    value: "Media",
    description: "Imágenes, documentos y materiales cargados.",
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Resumen general</h2>
        <p className="mt-2 max-w-2xl text-[#52708a]">
          Vista inicial del panel para administrar contenido, propuestas,
          mensajes y recursos del sitio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-[#39b8bb]">{card.title}</p>
            <h3 className="mt-3 text-xl font-bold">{card.value}</h3>
            <p className="mt-2 text-sm leading-6 text-[#52708a]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
