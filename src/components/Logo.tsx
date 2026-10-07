import { useId } from "react";
import { cn } from "@/utils/cn";

/* TS monogram geometry (traced from the official Tenya Security mark)
   T = #060630, S = #F50406, separated by a diagonal cut */
const T_POINTS = "210,327 293,217 607,217 528,327 495,327 495,475 487,487 355,655 355,327";
const S_POINTS = "650,217 883,217 797,327 710,327 710,655 405,655 537,487 570,487 570,327";

export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="205 212 685 448"
      className={cn("block h-auto", className)}
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={T_POINTS} fill="#060630" />
      <polygon points={S_POINTS} fill="#F50406" />
    </svg>
  );
}

/** Compact horizontal lockup: monogram + wordmark (+ tagline). Used in the navigation. */
export function LogoLockup({
  className,
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Monogram className="w-11 shrink-0 sm:w-12" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-extrabold tracking-[0.02em] text-navy sm:text-[1.05rem]">
          TENYA SECURITY
        </span>
        {showTagline && (
          <span className="mt-1 hidden font-display text-[0.5rem] font-bold tracking-[0.14em] text-signal xs:block sm:text-[0.54rem]">
            INTEGRITY WITH EXCELLENCE
          </span>
        )}
      </span>
    </span>
  );
}

/** Full stacked lockup with the arched tagline, as in the primary logo. */
export function LogoStacked({ className }: { className?: string }) {
  const pathId = useId();
  return (
    <svg
      viewBox="0 0 760 600"
      className={cn("block h-auto", className)}
      role="img"
      aria-label="Tenya Security, Integrity with Excellence"
    >
      <g transform="translate(-57 -153.6) scale(0.8)">
        <polygon points={T_POINTS} fill="#060630" />
        <polygon points={S_POINTS} fill="#F50406" />
      </g>
      <text
        x="380"
        y="478"
        textAnchor="middle"
        fontFamily="Montserrat, Inter, sans-serif"
        fontWeight={800}
        fontSize="72"
        fill="#060630"
        textLength="690"
        lengthAdjust="spacingAndGlyphs"
      >
        TENYA SECURITY
      </text>
      <defs>
        <path id={pathId} d="M 40 520 Q 380 590 720 520" fill="none" />
      </defs>
      <text
        fontFamily="Montserrat, Inter, sans-serif"
        fontWeight={700}
        fontSize="35"
        letterSpacing="1.2"
        fill="#F50406"
        textAnchor="middle"
      >
        <textPath href={`#${pathId}`} startOffset="50%">
          INTEGRITY WITH EXCELLENCE
        </textPath>
      </text>
    </svg>
  );
}
