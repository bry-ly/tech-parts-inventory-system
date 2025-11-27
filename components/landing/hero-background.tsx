"use client";

import { useEffect, useRef, useState } from "react";

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y });

      // Check if cursor is within the container
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 h-full w-full bg-white dark:hidden"
    >
      {/* Base subtle grid */}
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Highlighted grid following cursor */}
      <div
        className="absolute h-full w-full bg-[linear-gradient(to_right,#80808060_1px,transparent_1px),linear-gradient(to_bottom,#80808060_1px,transparent_1px)] bg-size-[24px_24px] transition-opacity duration-300"
        style={{
          opacity,
          maskImage: `radial-gradient(400px circle at ${position.x}px ${position.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(400px circle at ${position.x}px ${position.y}px, black, transparent)`,
        }}
      />
    </div>
  );
}
