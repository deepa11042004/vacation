import React from "react";
import { LucideIcon } from "lucide-react";

// ─── Types
export type BadgeVariant = "white" | "black";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
 
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  className?: string;
}

// ── Size Config 
const sizeConfig: Record<
  BadgeSize,
  { padding: string; fontSize: string; gap: string; icon: string }
> = {
  sm: {
    padding: "px-3 py-1.5",
    fontSize: "text-xs",
    gap: "gap-1.5",
    icon: "w-3 h-3",
  },
  md: {
    padding: "px-4 py-2",
    fontSize: "text-sm",
    gap: "gap-2",
    icon: "w-3.5 h-3.5",
  },
  lg: {
    padding: "px-5 py-2.5",
    fontSize: "text-base",
    gap: "gap-2.5",
    icon: "w-4 h-4",
  },
};

// ─── Component
const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "white",
  size = "md",
  icon: Icon,
  className = "",
}) => {
  const cfg = sizeConfig[size];
  const isBlack = variant === "black";

  const badgeClasses = [
    "inline-flex items-center rounded-full border",
    "transition-all duration-300 pointer-events-none",
    cfg.padding,
    cfg.fontSize,
    cfg.gap,
    isBlack
      ? "border-black/30 bg-black/5 text-black"
      : "border-white/30 bg-white/5 text-white",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconClasses = [cfg.icon, isBlack ? "text-black" : "text-white"].join(
    " ",
  );

  return (
    <div className={badgeClasses}>
      {Icon && <Icon className={iconClasses} />}
      <span>{text}</span>
    </div>
  );
};

export default Badge;
