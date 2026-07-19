import { useEffect } from "react";

// Klein-blue circles (and the odd star) that spark off the cursor and fade.
function CursorFx() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.className = "cursor-fx";
    document.body.appendChild(layer);

    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 45) return; // throttle so we don't flood the DOM
      last = now;

      const p = document.createElement("span");
      p.className = Math.random() < 0.22 ? "fx star" : "fx dot";
      p.style.left = `${e.clientX}px`;
      p.style.top = `${e.clientY}px`;
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 26}px`);
      p.style.setProperty("--dy", `${(Math.random() - 0.5) * 20 - 12}px`);
      p.style.setProperty("--s", (0.6 + Math.random() * 0.8).toFixed(2));
      p.addEventListener("animationend", () => p.remove());
      layer.appendChild(p);
    };

    // click: burst of circles + stars in all directions
    const onClick = (e) => {
      const N = 16;
      for (let i = 0; i < N; i++) {
        const p = document.createElement("span");
        p.className = i % 3 === 0 ? "fx star burst" : "fx dot burst";
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY}px`;
        const ang = (Math.PI * 2 * i) / N + Math.random() * 0.35;
        const dist = 45 + Math.random() * 55;
        p.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
        p.style.setProperty("--dy", `${Math.sin(ang) * dist}px`);
        p.style.setProperty("--s", (0.7 + Math.random() * 0.9).toFixed(2));
        p.addEventListener("animationend", () => p.remove());
        layer.appendChild(p);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      layer.remove();
    };
  }, []);

  return null;
}

export default CursorFx;
