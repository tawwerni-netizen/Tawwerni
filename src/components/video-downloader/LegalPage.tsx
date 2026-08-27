export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="muted mt-2 text-sm">{updated}</p>
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </article>
  );
}

export function LegalSection({
  heading,
  body,
}: {
  heading: string;
  body: readonly string[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{heading}</h2>
      {body.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="muted leading-relaxed">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
