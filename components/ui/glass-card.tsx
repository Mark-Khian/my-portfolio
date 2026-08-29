import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
};

export function GlassCard({
  children,
  className,
  as: Tag = "div",
  ...props
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl border border-white/10",
        "bg-[#09090B]/88 [@media(pointer:coarse)]:bg-[#09090B]/92",
        "backdrop-blur-[10px] sm:backdrop-blur-xl [@media(pointer:coarse)]:backdrop-blur-none",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_32px_rgba(0,0,0,0.4)]",
        "transition-[border-color,box-shadow,transform] duration-300 ease-out",
        "hover:border-white/20 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5",

        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[#09090B]/30 [@media(pointer:coarse)]:bg-[#09090B]/10"
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
