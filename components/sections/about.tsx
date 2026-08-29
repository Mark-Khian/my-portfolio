import {
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { aboutContent } from "@/lib/about-content";
import { cn } from "@/lib/utils";

type ContentCardProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted";
};

function ContentCard({
  title,
  icon: Icon,
  children,
  className,
  variant = "default",
}: ContentCardProps) {
  return (
    <GlassCard
      as="article"
      className={cn(
        "flex h-full flex-col p-6 sm:p-8",
        variant === "muted" && "border-dashed border-white/8",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border",
            variant === "default"
              ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
              : "border-white/10 bg-white/5 text-muted-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </GlassCard>
  );
}

function ProseBlock({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export function About() {
  const {
    label,
    title,
    intro,
    academic,
    journey,
    howIWork,
    careerGoals,
    virtualAssistant,
  } = aboutContent;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <FadeIn>
          <SectionHeader
            label={label}
            title={title}
            description={intro}
            headingId="about-heading"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.05} className="h-full">
            <ContentCard title={academic.title} icon={academic.icon}>
              <ProseBlock paragraphs={academic.paragraphs} />
            </ContentCard>
          </FadeIn>

          <FadeIn delay={0.1} className="h-full">
            <ContentCard title={journey.title} icon={journey.icon}>
              <ProseBlock paragraphs={journey.paragraphs} />
            </ContentCard>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-2">
            <ContentCard title={howIWork.title} icon={howIWork.icon}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {howIWork.traits.map(({ icon: TraitIcon, text }) => (
                  <li
                    key={text}
                    className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base"
                  >
                    <TraitIcon
                      className="mt-0.5 size-4 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          </FadeIn>

          <FadeIn delay={0.05}>
            <ContentCard title={careerGoals.title} icon={careerGoals.icon}>
              <ProseBlock paragraphs={careerGoals.paragraphs} />
            </ContentCard>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ContentCard title={virtualAssistant.title} icon={ClipboardList}>
              <ProseBlock paragraphs={[virtualAssistant.description]} />
            </ContentCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
