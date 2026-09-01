import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  headingId?: string;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  headingId,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="font-mono text-sm font-medium tracking-wide text-blue-600 dark:text-blue-400 uppercase">
        {label}
      </p>
      <h2
        id={headingId}
        className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
