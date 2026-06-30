"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CtaButton from "@/UI/CtaButton";

/*  Data */

const navItems: { label: string; url: string; dropdown?: boolean }[] = [
  { label: "About Us", url: "/about" },
  { label: "Activities", url: "/activities" },
  { label: "Stays", url: "/stays" },
  { label: "Membership", url: "/membership" },
  { label: "Pages", url: "#", dropdown: true },
  { label: "Contact", url: "/contact" },
];

/*  Component */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const useLightStyle = isScrolled || pathname === "/stays" || pathname === "/contact";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /*  Layer 4 — navigation */
    <nav className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-40 transition-all duration-300 ${
      isScrolled ? "bg-transparent  py-4" : "bg-transparent py-6"
    }`}>
      <Link href="/" className={`text-xl md:text-3xl font-semibold transition-colors duration-300 ${!useLightStyle ? "text-white" : "text-gray-900"}`}>
        Tourvia.
      </Link>

      <div className={`hidden items-center gap-1 rounded-full px-2 py-2 lg:flex transition-colors duration-300 ${
        !useLightStyle 
          ? "border border-white/25 bg-white/10 backdrop-blur-md" 
          : "bg-blue-50"
      }`}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.url}
            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
              !useLightStyle 
                ? "text-white/90 hover:bg-white/20" 
                : "text-gray-700 hover:bg-blue-100/50 hover:text-gray-900"
            }`}
          >
            {item.label}
            {item.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
          </Link>
        ))}
      </div>

      <CtaButton 
        text="Join Now" 
        variant={!useLightStyle ? "outline" : "blue"} 
        href="/join"
        size="sm" 
      />
    </nav>
  );
}
