"use client";

import { HeroVariantProps } from "./index";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Stat = {
  value?: string;
  label?: string;
  suffix?: string;
};

export default function HeroStats({ content, className }: HeroVariantProps) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const backgroundImage = content.backgroundImage as string;
  const stats = (content.stats as Stat[]) || [];
  const contactLabel = content.contactLabel as string;

  return (
    <section className={cn("relative min-h-screen", className)}>
      {/* Background */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16",
        backgroundImage ? "text-white" : "bg-background text-foreground"
      )}>
        <div className="max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "mb-12 text-lg md:text-xl",
              backgroundImage ? "text-white/80" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                {stat.value}
                {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
              </div>
              <div className={cn(
                "text-sm uppercase tracking-wider",
                backgroundImage ? "text-white/70" : "text-muted-foreground"
              )}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Label */}
        {contactLabel && (
          <div className={cn(
            "mt-12 text-sm uppercase tracking-wider",
            backgroundImage ? "text-white/60" : "text-muted-foreground"
          )}>
            {contactLabel}
          </div>
        )}
      </div>
    </section>
  );
}
