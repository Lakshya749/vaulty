import React from "react";

export type PillVariant = "violet" | "pink" | "emerald" | "amber" | "muted" | "neutral";

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: PillVariant;
  className?: string;
  dot?: boolean;
}

export const Pill: React.FC<PillProps> = ({
  children,
  variant = "violet",
  className = "",
  dot = false,
  ...props
}) => {
  const variantStyles: Record<PillVariant, { pill: string; dot: string }> = {
    violet: {
      pill: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      dot: "bg-violet-400",
    },
    pink: {
      pill: "bg-pink-500/10 text-pink-500 border-pink-500/20",
      dot: "bg-pink-500",
    },
    emerald: {
      pill: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      dot: "bg-emerald-400 animate-pulse",
    },
    amber: {
      pill: "bg-amber-400/10 text-amber-400 border-amber-400/20",
      dot: "bg-amber-400",
    },
    muted: {
      pill: "bg-white/5 text-text-muted border-white/10",
      dot: "bg-text-muted",
    },
    neutral: {
      pill: "bg-white/5 text-text-secondary border-white/10",
      dot: "bg-text-secondary",
    },
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.pill} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      {children}
    </span>
  );
};
