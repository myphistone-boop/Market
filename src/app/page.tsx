"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import KnowledgePanel from "@/components/KnowledgePanel";

// Dynamic import to avoid SSR issues with Three.js / WebGL
const BrainMap = dynamic(() => import("@/components/BrainMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neural-bg">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-neural-accent/30 border-t-neural-accent
                        rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neural-muted text-sm">Initialisation du cerveau...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  if (dimensions.width === 0) return null;

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 3D Brain Map - Full screen background */}
      <div className="absolute inset-0">
        <BrainMap width={dimensions.width} height={dimensions.height} />
      </div>

      {/* Knowledge Panel - Overlay on right */}
      <KnowledgePanel />
    </main>
  );
}
