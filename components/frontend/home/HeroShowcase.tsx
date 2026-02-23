import Image from "next/image";

type HeroShowcaseProps = {
  id?: string;
  eyebrow: string;
  heading: string;
  subheading?: string;
  tagline?: string;
  image?: {
    src: string;
    alt: string;
  };
};

const HeroShowcase = ({
  id,
  eyebrow,
  heading,
  subheading,
  tagline,
  image,
}: HeroShowcaseProps) => {
  return (
    <section
      id={id}
      className="relative isolate -mt-18 sm:-mt-24 w-full px-4 pb-10 sm:pb-12 sm:px-10 lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8 rounded-[24px] sm:rounded-[32px] bg-white/95 p-5 sm:p-8 shadow-[0_35px_120px_rgba(0,0,0,0.25)] ring-1 ring-black/5 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-3 sm:space-y-4 text-gray-900">
          <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.24em] sm:tracking-[0.6em] text-gray-400">
            {eyebrow}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.14em] sm:tracking-[0.3em]">
            {heading}
          </h2>
          {subheading ? (
            <p className="text-sm leading-relaxed text-gray-600">{subheading}</p>
          ) : null}
          {tagline ? (
            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.24em] sm:tracking-[0.6em] text-gray-500">
              {tagline}
            </p>
          ) : null}
        </div>
        {image?.src ? (
          <div className="relative h-44 sm:h-48 w-full flex-1 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 300px, 100vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HeroShowcase;
