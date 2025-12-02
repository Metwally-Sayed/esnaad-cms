import Link from "next/link";

import type { FooterTemplateProps } from "./types";

const ResizableFooter = ({ links = [], isLoading }: FooterTemplateProps) => {
  const midpoint = Math.ceil(links.length / 2);
  const firstColumn = links.slice(0, midpoint);
  const secondColumn = links.slice(midpoint);

  return (
    <footer className="bg-background text-foreground font-sans">
      <div className="mx-auto flex w-full flex-col gap-8 rounded-lg border border-border/60 bg-muted/30 px-6 py-8 shadow-sm lg:px-10">
        <div className="flex flex-col gap-6 border-b border-border/50 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-3xl font-light tracking-[0.35em]">
              ESNAAD
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Tailored footer layout that adapts to the available space. All
              navigation items remain accessible at any breakpoint.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full border border-border/50" />
            <div className="h-10 w-10 rounded-full border border-border/50" />
            <div className="h-10 w-10 rounded-full border border-border/50" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[firstColumn, secondColumn].map((column, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className="space-y-1 rounded-md border border-border/30 bg-background p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Menu {columnIndex + 1}
              </p>
              <div className="flex flex-col text-sm">
                {!isLoading &&
                  column.map((link) => (
                    <Link
                      key={link.id}
                      href={link.slug}
                      className="py-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  ))}

                {column.length === 0 && (
                  <span className="py-1 text-muted-foreground/70">
                    No links available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/50 pt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>Dynamic Layout</span>
          <span>Updated automatically from CMS links</span>
        </div>
      </div>
    </footer>
  );
};

export default ResizableFooter;
