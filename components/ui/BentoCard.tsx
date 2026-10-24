import React from "react";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = "",
  colSpan = 1,
  ...props
}) => {
  const spanClass =
    colSpan === 2
      ? "md:col-span-2"
      : colSpan === 3
      ? "md:col-span-3"
      : "col-span-1";

  return (
    <div
      className={`glass-panel rounded-card p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-glow-violet ${spanClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
