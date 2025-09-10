import React, { useRef, useEffect } from "react";

export interface IMathfieldProps {
  value: string;
  onInput?: (e: { value: string; rawEvent?: Event }) => void;
  readOnly?: boolean;
  className?: string;
}

export default function MathfieldComponent({ value, onInput, readOnly, className }: IMathfieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mfRef = useRef<any>(null);

  // create math-field imperatively to avoid JSX typing issues
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;
      try {
        await import("mathlive");
      } catch {}
      if (!mounted) return;
      if (!containerRef.current) return;

      const mf = document.createElement("math-field");
      mf.className = className || "";
  if (value) (mf as any).value = value;
      if (readOnly) mf.setAttribute("readonly", "true");

      const handler = (ev: any) => {
        if (onInput) onInput({ value: ev.target?.value ?? "", rawEvent: ev });
      };

      mf.addEventListener("input", handler as EventListener);
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(mf);
      mfRef.current = mf;

      return () => {
        mf.removeEventListener("input", handler as EventListener);
        try { mf.remove(); } catch {}
      };
    })();

    return () => {
      mounted = false;
    };
  }, [className, onInput, readOnly]);

  // keep value in sync
  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;
    if ((mf as any).value !== value) (mf as any).value = value ?? "";
  }, [value]);

  return <div ref={containerRef} />;
}
