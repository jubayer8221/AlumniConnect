import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Box } from "@mui/material";

interface DeferredSectionProps {
  children: ReactNode;
  id?: string;
  minHeight: number;
}

export default function DeferredSection({
  children,
  id,
  minHeight,
}: DeferredSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      id={id}
      aria-busy={isNearViewport ? undefined : true}
      sx={{ minHeight: isNearViewport ? undefined : minHeight }}
    >
      {isNearViewport ? (
        <Suspense fallback={<Box aria-hidden="true" sx={{ minHeight }} />}>
          {children}
        </Suspense>
      ) : null}
    </Box>
  );
}
