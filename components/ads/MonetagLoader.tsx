"use client";

import { useEffect } from "react";
import { monetagEnabled } from "@/lib/monetag-config";

/**
 * Monetag is disabled. This component only unregisters leftover push SWs
 * from earlier Monetag installs so returning visitors stop getting tags.
 */
export default function MonetagLoader() {
  useEffect(() => {
    if (monetagEnabled()) return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) {
        void reg.unregister();
      }
    });
  }, []);

  return null;
}
