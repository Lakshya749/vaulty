import React from "react";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className = "",
  size = "md",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-semibold h-8",
    md: "px-5 py-2.5 text-sm font-semibold h-11",
    lg: "px-7 py-3.5 text-base font-bold h-13",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary-gradient text-text-primary shadow-glow-violet transition-all duration-200 ease-out hover:brightness-110 active:scale-98 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
