"use client";

import { Phone, Mail, MapPin, Sparkles } from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Call Us",
    lines: [
      { label: "Reservations & Support", value: "+91 9990942211", href: "tel:+919990942211" },
      { label: "Mon – Sat, 10 AM to 6 PM (holidays off)", value: null, href: null },
    ],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: [
      { label: "General Enquiries", value: "info@mandarinworldwidevacations.com", href: "mailto:info@mandarinworldwidevacations.com" },
      { label: "Customer Support", value: "support@mwvpl.com", href: "mailto:support@mwvpl.com" },
    ],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [
      { label: "Head Office — Delhi", value: null, href: null },
      { label: "D-22 LGF, Pandav Nagar, Near Laxmi Nagar, Delhi – 110092, India", value: null, href: null },
    ],
  },
];

export default function Contact() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0b0b0f] text-white pt-32 pb-16 sm:pt-40 sm:pb-20 px-6 sm:px-10 lg:px-14">
      {/* soft glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#E8C15B]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8C15B]/40 bg-[#E8C15B]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E8C15B]">
            <Sparkles className="h-3.5 w-3.5" />
            Get in Touch
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Contact <span className="italic font-medium text-[#E8C15B]">Us</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Have questions or need assistance? We&apos;re here to help you plan
            your perfect getaway. Reach out through any of the channels below and
            our dedicated team will get back to you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-[#E8C15B]/30"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8C15B] to-[#b38b40] shadow-lg shadow-[#b38b40]/20">
                <card.icon className="h-5 w-5 text-[#141414]" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
              <div className="mt-2 space-y-2">
                {card.lines.map((line, i) => (
                  <div key={i} className="text-sm leading-relaxed">
                    <p className="text-white/45">{line.label}</p>
                    {line.value &&
                      (line.href ? (
                        <a
                          href={line.href}
                          className="font-medium text-[#E8C15B] break-words hover:underline"
                        >
                          {line.value}
                        </a>
                      ) : (
                        <p className="font-medium text-white/90">{line.value}</p>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
