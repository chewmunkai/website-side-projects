"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  strength?: number;
  className?: string;
  dataCursor?: string;
  ariaLabel?: string;
}

/**
 * A button/link that leans toward the cursor (magnetic) and snaps back on
 * leave. Hash links route through Lenis for a smooth in-page glide; external
 * links open safely in a new tab.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  strength = 0.4,
  className = "",
  dataCursor,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3" });
    if (label)
      gsap.to(label, {
        x: x * strength * 0.4,
        y: y * strength * 0.4,
        duration: 0.6,
        ease: "power3",
      });
  };

  const onLeave = () => {
    const el = ref.current;
    const label = labelRef.current;
    if (el) gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    if (label)
      gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  const handleClick = (e: MouseEvent) => {
    if (href?.startsWith("#")) {
      e.preventDefault();
      scrollTo(href, { offset: -40 });
    }
    onClick?.();
  };

  const classes = `btn btn--${variant} ${className}`;
  const inner = (
    <span ref={labelRef} className="btn__label">
      {children}
    </span>
  );

  const isExternal = href && /^https?:\/\//.test(href);

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={handleClick}
        className={classes}
        data-cursor={dataCursor}
        aria-label={ariaLabel}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
      className={classes}
      data-cursor={dataCursor}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
