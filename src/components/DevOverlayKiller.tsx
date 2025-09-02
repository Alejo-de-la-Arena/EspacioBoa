// components/DevOverlayKiller.tsx
"use client";
import { useEffect } from "react";

export default function DevOverlayKiller() {
    useEffect(() => {
        const kill = () => {
            document
                .querySelectorAll(
                    '[data-nextjs-toast], .nextjs-toast, [data-next-badge-root], [data-nextjs-dev-tools-button], [data-nextjs-toast-wrapper]'
                )
                .forEach((el) => {
                    const n = el as HTMLElement;
                    n.style.display = "none";
                    n.style.visibility = "hidden";
                    n.style.pointerEvents = "none";

                });
        };
        kill();
        const mo = new MutationObserver(kill);
        mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
        return () => mo.disconnect();
    }, []);
    return null;
}
