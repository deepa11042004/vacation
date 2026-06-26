import React from "react";
import { ArrowUpRight } from "lucide-react";

// ─── Types
export type CtaButtonVariant = "blue" | "white" | "outline";
export type CtaButtonSize = "sm" | "md" | "lg";

export interface CtaButtonProps {
  text: string;
  variant?: CtaButtonVariant;
  size?: CtaButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

// ── Size Config
const sizeConfig: Record<
  CtaButtonSize,
  {
    padding: string;
    fontSize: string;
    gap: string;
    circle: string;
    icon: string;
  }
> = {
  sm: {
    padding: "pl-5 pr-1 py-1",
    fontSize: "text-sm",
    gap: "gap-2",
    circle: "w-10 h-10",
    icon: "w-4 h-4",
  },
  md: {
    padding: "pl-5 pr-1 py-1",
    fontSize: "text-base",
    gap: "gap-3",
    circle: "w-12 h-12",
    icon: "w-5 h-5 ",
  },
  lg: {
    padding: "px-9 py-4",
    fontSize: "text-lg",
    gap: "gap-4",
    circle: "w-10 h-10",
    icon: "w-5 h-5",
  },
};

// ── Variant Configurations
const variantConfig: Record<
  CtaButtonVariant,
  {
    outer: string;
    viewport: string;
    hoverCircle: string;
    restIcon: string;
    hoverIcon: string;
  }
> = {
  blue: {
    outer:
      "bg-blue-600 text-white border border-blue-600 hover:bg-white hover:text-blue-600",
    viewport: "bg-white",
    hoverCircle: "bg-blue-600",
    restIcon: "text-blue-600",
    hoverIcon: "text-white",
  },
  white: {
    outer:
      "bg-white text-gray-900 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600",
    viewport: "bg-blue-600",
    hoverCircle: "bg-white",
    restIcon: "text-white",
    hoverIcon: "text-blue-600",
  },
  outline: {
    outer:
      "bg-transparent text-white/90 border border-white/25 hover:bg-white hover:text-black",
    viewport: "bg-white",
    hoverCircle: "bg-blue-600",
    restIcon: "text-blue-600",
    hoverIcon: "text-white",
  },
};

// ─── Component
const CtaButton: React.FC<CtaButtonProps> = ({
  text,
  variant = "blue",
  size = "md",
  onClick,
  href,
  className = "",
  disabled = false,
  ...rest
}) => {
  const cfg = sizeConfig[size];
  const vCfg = variantConfig[variant];

  // Outer pill — background + border swap on hover
  const outerClasses = [
    "group relative inline-flex items-center rounded-full font-semibold",
    "transition-all duration-500 ease-out cursor-pointer",
    cfg.padding,
    cfg.fontSize,
    cfg.gap,
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    vCfg.outer,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Circle viewport — clips the sliding circles
  const circleViewportClasses = [
    "relative flex items-center justify-center rounded-full overflow-hidden",
    "transition-all duration-500 ease-out",
    cfg.circle,
    vCfg.viewport,
  ]
    .filter(Boolean)
    .join(" ");

  // 1. Rest circle (visible by default, slides UP-RIGHT and out on hover)
  const restCircleClasses = [
    "absolute inset-0 flex items-center justify-center rounded-full",
    "transition-transform duration-500 ease-out",
    "translate-x-0 translate-y-0 group-hover:translate-x-full group-hover:-translate-y-full",
  ]
    .filter(Boolean)
    .join(" ");

  // 2. Hover circle (hidden at bottom-left, slides UP-RIGHT into center on hover)
  const hoverCircleClasses = [
    "absolute inset-0 flex items-center justify-center rounded-full",
    "transition-transform duration-500 ease-out",
    "-translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0",
    vCfg.hoverCircle,
  ]
    .filter(Boolean)
    .join(" ");

  // Arrow icon colors
  const restIconClasses = [cfg.icon, vCfg.restIcon].join(" ");
  const hoverIconClasses = [cfg.icon, vCfg.hoverIcon].join(" ");

  const content = (
    <>
      <span className="relative z-10 whitespace-nowrap">{text}</span>

      {/* Circle area with diagonal swap animation */}
      <span className={circleViewportClasses}>
        {/* Rest circle — slides up-right and out */}
        <span className={restCircleClasses}>
          <ArrowUpRight className={restIconClasses} />
        </span>
        {/* Hover circle — slides in from bottom-left */}
        <span className={hoverCircleClasses}>
          <ArrowUpRight className={hoverIconClasses} />
        </span>
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} className={outerClasses} role="button" {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={outerClasses}
      {...rest}
    >
      {content}
    </button>
  );
};

export default CtaButton;
