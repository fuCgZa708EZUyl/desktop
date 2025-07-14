import { useState, useEffect, useRef, useCallback } from "react";

type DockItem = {
  name: string;
  icon: string;
  onClick?: () => void;
};

const CONFIG = {
  maxScale: 1.5,
  baseScale: 1,
  influenceRadius: 80,
  gaussianStrength: 2.5,
} as const;

const STYLES = {
  container: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
  dock: "flex gap-3 px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg",
  button: "w-12 h-12 flex items-center justify-center transition-transform duration-150 ease-out",
  icon: "w-10 h-10 object-contain pointer-events-none",
} as const;

export function DockWave(props: { items: DockItem[] }) {
  const [scales, setScales] = useState<number[]>(
    Array(props.items.length).fill(CONFIG.baseScale)
  );

  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<HTMLButtonElement[]>([]);

  const calculateScale = (mouseX: number, iconRef: HTMLButtonElement) => {
    const iconRect = iconRef.getBoundingClientRect();
    const iconCenterX = iconRect.left + iconRect.width / 2;
    const distance = Math.abs(mouseX - iconCenterX);
    
    if (distance > CONFIG.influenceRadius) return CONFIG.baseScale;
    
    const normalizedDistance = distance / CONFIG.influenceRadius;
    const gaussianFactor = Math.exp(-CONFIG.gaussianStrength * normalizedDistance * normalizedDistance);
    return CONFIG.baseScale + gaussianFactor * (CONFIG.maxScale - CONFIG.baseScale);
  };

  const updateScales = useCallback((e: MouseEvent) => {
    if (!dockRef.current || iconRefs.current.length !== props.items.length) return;
    
    const newScales = iconRefs.current.map(iconRef => 
      iconRef ? calculateScale(e.clientX, iconRef) : CONFIG.baseScale
    );
    setScales(newScales);
  }, [props.items.length]);

  const resetScales = useCallback(() => setScales(Array(props.items.length).fill(CONFIG.baseScale)), [props.items.length]);

  useEffect(() => {
    const dockElement = dockRef.current;
    if (dockElement) {
      dockElement.addEventListener("mousemove", updateScales);
      dockElement.addEventListener("mouseleave", resetScales);
    }

    return () => {
      if (dockElement) {
        dockElement.removeEventListener("mousemove", updateScales);
        dockElement.removeEventListener("mouseleave", resetScales);
      }
    };
  }, [updateScales, resetScales]);

  return (
    <div className={STYLES.container}>
      <div ref={dockRef} className={STYLES.dock}>
        {props.items.map((item, i) => (
          <button
            key={i}
            ref={(el) => {
              if (el) iconRefs.current[i] = el;
            }}
            className={STYLES.button}
            style={{
              transform: `scale(${scales[i] || CONFIG.baseScale})`,
            }}
            onClick={item.onClick}
            title={item.name}
          >
            <img 
              src={item.icon} 
              alt={item.name} 
              className={STYLES.icon}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
