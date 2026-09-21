import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const NAMESPACE = "niraj-ag";
const CAL_LINK = "niraj-ag";

/**
 * Inline Cal.com scheduler — the full booking page (all event types).
 *
 * Rendered on the dedicated /contact page. The iframe is the heaviest
 * third-party asset on the site, so it is mounted lazily — only once the
 * element gets close to the viewport. The container reserves its full height
 * from the start, so the calendar never shifts the layout when it appears.
 */
export default function CalEmbed() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          dark: {
            "--cal-brand": "#5B8CFF",
            "--cal-brand-emphasis": "#7DA3FF",
            "--cal-brand-text": "#050505",
          },
          light: {
            "--cal-brand": "#5B8CFF",
            "--cal-brand-emphasis": "#4475E8",
            "--cal-brand-text": "#FFFFFF",
          },
        },
      });
    })();
  }, [mounted]);

  return (
    <div ref={containerRef} className="cal-embed">
      <div className="cal-embed-frame">
        {!mounted ? (
          <div className="cal-skeleton" aria-hidden="true">
            <div className="cal-skeleton-row">
              <span className="cal-skeleton-chip" />
              <span className="cal-skeleton-chip" />
            </div>
            <div className="cal-skeleton-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
            <div className="cal-skeleton-list">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        ) : (
          <Cal
            namespace={NAMESPACE}
            calLink={CAL_LINK}
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
          />
        )}
      </div>
    </div>
  );
}