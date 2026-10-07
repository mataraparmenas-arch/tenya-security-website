import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  as?: ElementType;
  variant?: "up" | "left" | "right" | "fade";
  delay?: number;
  className?: string;
  children?: ReactNode;
  id?: string;
};

/** Fades/slides content in once, when it scrolls into view. */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      className={cn(
        "reveal",
        variant === "left" && "reveal-left",
        variant === "right" && "reveal-right",
        variant === "fade" && "reveal-fade",
        visible && "is-visible",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
