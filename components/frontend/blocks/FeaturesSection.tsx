type Feature = {
  icon?: string;
  title?: string;
  description?: string;
};

type FeaturesContent = {
  title?: string;
  subtitle?: string;
  features?: Feature[];
};

const FeaturesSection = ({ content }: { content: FeaturesContent }) => {
  const features = content.features ?? [];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 rounded-[40px] bg-white/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
        <div className="space-y-2 text-center">
          {content.title ? (
            <h2 className="font-serif text-3xl uppercase tracking-[0.25em] text-neutral-900">
              {content.title}
            </h2>
          ) : null}
          {content.subtitle ? (
            <p className="text-sm text-muted-foreground">{content.subtitle}</p>
          ) : null}
        </div>

        {features.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={`${feature.title}-${index}`}
                className="space-y-3 rounded-2xl border border-border/40 bg-background/80 p-5 text-center shadow-sm"
              >
                {feature.icon ? (
                  <div className="text-2xl">{feature.icon}</div>
                ) : null}
                <p className="font-semibold uppercase tracking-[0.3em]">
                  {feature.title}
                </p>
                {feature.description ? (
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Add feature items to showcase differentiators.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
