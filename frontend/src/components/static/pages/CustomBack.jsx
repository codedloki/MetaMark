import React, { useEffect, useState } from "react";

// 🔧 Simple fallback utility for class merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- Grid Background ---
export const GridBackground = ({
  className,
  children,
  gridSize = 20,
  gridColor = "#e4e4e7",
  darkGridColor = "#262626",
  showFade = true,
  fadeIntensity = 20,
  ...props
}) => {
  const [currentGridColor, setCurrentGridColor] = useState(gridColor);

  useEffect(() => {
    const updateGridColor = () => {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDarkModeActive =
        document.documentElement.classList.contains("dark") || prefersDarkMode;
      setCurrentGridColor(isDarkModeActive ? darkGridColor : gridColor);
    };

    updateGridColor();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") updateGridColor();
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [gridColor, darkGridColor]);

  return (
    <div
      className={cn(
        "relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `
            linear-gradient(to right, ${currentGridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentGridColor} 1px, transparent 1px)
          `,
        }}
      />
      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black"
          style={{
            maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
          }}
        />
      )}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

// --- Dot Background ---
export const DotBackground = ({
  className,
  children,
  dotSize = 1,
  dotColor = "#000",
  darkDotColor = "#fff",
  spacing = 20,
  showFade = true,
  fadeIntensity = 20,
  ...props
}) => {
  const [currentDotColor, setCurrentDotColor] = useState(dotColor);

  useEffect(() => {
    const updateDotColor = () => {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDarkModeActive =
        document.documentElement.classList.contains("dark") || prefersDarkMode;
      setCurrentDotColor(isDarkModeActive ? darkDotColor : dotColor);
    };

    updateDotColor();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") updateDotColor();
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [dotColor, darkDotColor]);

  return (
    <div
      className={cn(
        "relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundImage: `radial-gradient(${currentDotColor} ${dotSize}px, transparent ${dotSize}px)`,
        }}
      />
      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black"
          style={{
            maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
          }}
        />
      )}
      <div className="relative z-20">{children}</div>
    </div>
  );
};
