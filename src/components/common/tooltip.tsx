import React, { useState } from "react";

interface TooltipProps {
  /** Tooltip text to display */
  text?: string;
  /**
   * Where to place the tooltip relative to the child:
   * "top" | "bottom" | "left" | "right" | "under"
   * Defaults to "top".
   */
  position?: "top" | "bottom" | "left" | "right" | "under";
  /** The element that triggers the tooltip on hover */
  children: React.ReactNode;
}

/**
 * A tooltip with an arrow that properly points toward
 * the child element in all four directions.
 */
const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = "top",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * For each position, we define:
   * 1) container: absolute placement relative to child
   * 2) arrow: which border is colored for the arrow direction
   */
  const tooltipStyles: Record<
    "top" | "bottom" | "left" | "right" | "under",
    { container: string; arrow: string }
  > = {
    /** TOP: arrow points DOWN (color top border) */
    top: {
      container: `
        bottom-full left-1/2 -translate-x-1/2 mb-2
      `,
      arrow: `
        w-0 h-0
        border-l-4 border-r-4 border-t-4
        border-l-transparent border-r-transparent border-t-gray-800
      `,
    },
    /** BOTTOM: arrow points UP (color bottom border) */
    bottom: {
      container: `
        top-full left-1/2 -translate-x-1/2 mt-2
      `,
      arrow: `
        w-0 h-0
        border-l-4 border-r-4 border-b-4
        border-l-transparent border-r-transparent border-b-gray-800
      `,
    },
    /** UNDER: arrow points UP (color under border) */
    under: {
      container: `
        top-full left-1/2 -translate-x-1/2 mt-2
      `,
      arrow: `
        w-0 h-0
        border-l-4 border-r-4 border-b-4
        border-l-transparent border-r-transparent border-b-gray-800
      `,
    },
    /** LEFT: arrow points RIGHT (color left border) */
    left: {
      container: `
        right-full top-1/2 -translate-y-1/2 mr-2
      `,
      arrow: `
        w-0 h-0
        border-t-4 border-b-4 border-l-4
        border-t-transparent border-b-transparent border-l-gray-800
      `,
    },
    /** RIGHT: arrow points LEFT (color right border) */
    right: {
      container: `
        left-full top-1/2 -translate-y-1/2 ml-2
      `,
      arrow: `
        w-0 h-0
        border-t-4 border-b-4 border-r-4
        border-t-transparent border-b-transparent border-r-gray-800
      `,
    },
  };

  // Extract container & arrow classes from the chosen position
  const { container, arrow } = tooltipStyles[position];

  /**
   * We must decide if it's a "vertical" layout (top/bottom)
   * or "horizontal" layout (left/right). That changes
   * how we flex the arrow vs. text.
   */
  const isVertical = position === "top" || position === "bottom";

  /**
   * For arrow order:
   * - If top/left => show text, then arrow
   * - If bottom/right => show arrow, then text
   */
  const isArrowFirst = position === "bottom" || position === "right";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && text && (
        <div
          className={`
            absolute z-50
            flex
            ${isVertical ? "flex-col items-center" : "flex-row items-center"}
            ${container}
          `}
        >
          {isArrowFirst && <div className={arrow} />}
          <div className="whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-lg">
            {text}
          </div>
          {!isArrowFirst && <div className={arrow} />}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
