import Image from "next/image";

export function HeroGraph() {
  return (
    <div className="hero-graph-v2" aria-label="Визуализация поля научных связей">
      <Image
        src="/art/atlas-hero-field.jpg"
        alt=""
        fill
        priority
        sizes="(max-width: 720px) 100vw, 96vw"
        className="hero-field-image"
      />
      <div className="hero-field-chip"><i /> 72 связанных узла</div>
    </div>
  );
}
