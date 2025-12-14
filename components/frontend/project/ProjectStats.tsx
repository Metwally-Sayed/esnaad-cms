
type ProjectStat = {
  value: string;
  label: string;
};

type ProjectStatsProps = {
  stats: ProjectStat[];
};

export function ProjectStats({ stats }: ProjectStatsProps) {
  // Always render the section wrapper to ensure the ID exists for scrolling
  // If no stats, render minimal empty section
  if (!stats || stats.length === 0) {
    return <section id="amenities" className="min-h-screen snap-start bg-background py-4" />;
  }

  return (
    <section id="amenities" className="min-h-screen snap-start bg-background py-12 sm:py-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest text-foreground/80 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
