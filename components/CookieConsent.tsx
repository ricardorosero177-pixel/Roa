"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("roa_consent");
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(granted: boolean) {
    try {
      localStorage.setItem("roa_consent", granted ? "granted" : "denied");
    } catch {
      /* noop */
    }
    const state = granted ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
    window.fbq?.("consent", granted ? "grant" : "revoke");
    if (granted) window.fbq?.("track", "PageView");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-linea bg-white/95 backdrop-blur">
      <div className="container-roa flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-tinta-70">
          Usamos cookies propias y de terceros para mejorar tu experiencia y medir nuestra publicidad.
          Puedes aceptar o rechazar. Lee más en nuestra{" "}
          <Link href="/privacidad" className="underline">política de privacidad</Link>.
        </p>
        <div className="flex gap-2">
          <button onClick={() => decide(false)} className="btn-ghost text-sm">
            Rechazar
          </button>
          <button onClick={() => decide(true)} className="btn-dorado text-sm">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
