import { useEffect, useRef } from "react";
import { mountRuntime } from "@fne/runtime";
import { SHELL_HEIGHT_PX, SHELL_WIDTH_PX } from "@fne/shared";
import "./app.css";

export function App() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (host === null) {
      return;
    }

    const runtime = mountRuntime(host);

    return () => {
      runtime.destroy();
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-copy" aria-label="shell copy">
        <p className="eyebrow">Browser prototype</p>
        <h1>Friday Night English</h1>
        <p className="subtitle">
          React owns the shell. Phaser owns the playable surface.
        </p>
      </section>
      <section className="game-frame" aria-label="game canvas">
        <div
          ref={hostRef}
          className="phaser-host"
          data-testid="phaser-host"
          style={
            {
              "--shell-width": `${SHELL_WIDTH_PX}px`,
              "--shell-height": `${SHELL_HEIGHT_PX}px`
            } as React.CSSProperties
          }
        />
      </section>
    </main>
  );
}
