import { useCMS } from "../store";
import type { HeroProps } from "../store";

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface HeroComponentProps extends HeroProps {
  id: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function Hero({ title, subtitle, bg, id }: HeroComponentProps) {
  const { selectedSection, updateProp } = useCMS();

  const active = selectedSection?.id === id;

  return (
    <section className="p-20 text-center rounded" style={{ background: bg }}>
      {active ? (
        <>
          <input
            className="text-4xl font-bold text-white bg-transparent outline-none"
            value={title}
            onChange={(e) => updateProp(id, "title", e.target.value)}
          />
          <input
            className="block mt-2 text-white bg-transparent outline-none"
            value={subtitle}
            onChange={(e) => updateProp(id, "subtitle", e.target.value)}
          />
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <p className="text-white mt-2">{subtitle}</p>
        </>
      )}
    </section>
  );
}
