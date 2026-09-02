"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";

const DURATION_MS = 10_000; // visible loading time
const FADE_MS = 600; // fade-out transition
const SEEN_KEY = "mwv_preloader_seen";

// useLayoutEffect on the client, no-op on the server (avoids SSR warning)
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Preloader() {
  const [done, setDone] = useState(false); // bar finished -> start fade
  const [gone, setGone] = useState(false); // fully removed from DOM

  // Before paint: if the loader has already been shown this session, skip it.
  useIsoLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) {
        setGone(true);
        return;
      }
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // storage blocked -> just show it once for this mount
    }
  }, []);

  useEffect(() => {
    if (gone) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const finish = setTimeout(() => setDone(true), DURATION_MS);
    const remove = setTimeout(() => setGone(true), DURATION_MS + FADE_MS);

    return () => {
      clearTimeout(finish);
      clearTimeout(remove);
      document.body.style.overflow = overflow;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden={done}
      role="status"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040B31] transition-opacity duration-[600ms] ease-out"
      style={{ opacity: done ? 0 : 1 }}
    >
      <div className="preloader-logo flex flex-col items-center">
        <Image
          src="/Img/fanlogo.png"
          alt="Mandarin Worldwide Vacations"
          width={260}
          height={107}
          priority
          className="w-[190px] sm:w-[240px] md:w-[260px] h-auto object-contain"
        />

        {/* progress track */}
        <div className="mt-8 h-[2px] w-[180px] sm:w-[220px] overflow-hidden rounded-full bg-white/15">
          <div className="preloader-bar-fill h-full w-full rounded-full bg-gradient-to-r from-[#E8C15B] to-[#F5D98B]" />
        </div>
      </div>

      <span className="sr-only">Loading Mandarin Worldwide Vacations</span>
    </div>
  );
}
