"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Member = {
  name?: string;
  role?: string;
  photo?: string;
  bio?: string;
};

type AboutTeamProps = {
  content: {
    sectionTitle?: string;
    subtitle?: string;
    description?: string;
    members?: Member[];
    customColors?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default function AboutTeam({ content, className }: AboutTeamProps) {
  const members = content.members || [];
  const useCustomColors = content.customColors === true;

  const sectionStyle = useCustomColors
    ? { backgroundColor: content.backgroundColor }
    : undefined;
  const titleStyle = useCustomColors ? { color: content.titleColor } : undefined;
  const textStyle = useCustomColors ? { color: content.textColor } : undefined;

  return (
    <section
      className={cn(
        "py-16 md:py-24",
        !useCustomColors && "bg-background",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.sectionTitle && (
            <h2
              className={cn(
                "font-serif text-3xl tracking-[0.2em] md:text-4xl",
                !useCustomColors && "text-foreground"
              )}
              style={titleStyle}
            >
              {content.sectionTitle}
            </h2>
          )}
          {content.subtitle && (
            <p
              className={cn(
                "mt-4 font-serif text-xl tracking-[0.1em]",
                !useCustomColors && "text-foreground/80"
              )}
              style={textStyle}
            >
              {content.subtitle}
            </p>
          )}
          {content.description && (
            <p
              className={cn(
                "mx-auto mt-6 max-w-2xl",
                !useCustomColors && "text-muted-foreground"
              )}
              style={textStyle}
            >
              {content.description}
            </p>
          )}
        </motion.div>

        {/* Team Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
            >
              {member.photo && (
                <div className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full">
                  <Image
                    src={member.photo}
                    alt={member.name || "Team member"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {member.name && (
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    !useCustomColors && "text-foreground"
                  )}
                  style={titleStyle}
                >
                  {member.name}
                </h3>
              )}
              {member.role && (
                <p
                  className={cn(
                    "mt-1 text-sm",
                    !useCustomColors && "text-muted-foreground"
                  )}
                  style={textStyle}
                >
                  {member.role}
                </p>
              )}
              {member.bio && (
                <p
                  className={cn(
                    "mt-3 text-sm",
                    !useCustomColors && "text-foreground/80"
                  )}
                  style={textStyle}
                >
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
