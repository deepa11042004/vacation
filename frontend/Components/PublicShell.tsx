"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import Preloader from "@/Components/Shared/Preloader";
import SmoothScroll from "@/Provider/SmoothScroll";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Preloader />
      <Navbar />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
