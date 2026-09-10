"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Check, MapPin, Phone, Mail } from "lucide-react";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enquiry: string;
  message: string;
};

const ENQUIRY_OPTIONS = [
  "General Enquiry",
  "Reservation Assistance",
  "Partnership Opportunity",
  "Feedback",
  "Customer Support",
  "Other",
];

const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  enquiry: "",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#E8C15B]/60 focus:bg-white/[0.06]";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
      {children} <span className="text-[#E8C15B]">*</span>
    </label>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0b0b0f] text-white pb-24 px-6 sm:px-10 lg:px-14">
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Send Us a Message</h2>
          <p className="mt-2 text-sm text-white/55">
            Fill in the form below and we&apos;ll respond within one business day.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-9">
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#E8C15B] to-[#b38b40]">
                <Check className="h-7 w-7 text-[#141414]" strokeWidth={3} />
              </span>
              <h3 className="mt-5 text-xl font-bold">Thank you for reaching out!</h3>
              <p className="mt-2 max-w-sm text-sm text-white/55">
                Our team has received your message and will get back to you at{" "}
                <span className="text-[#E8C15B]">{values.email || "your email"}</span>{" "}
                shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setValues(defaultValues);
                  setSubmitted(false);
                }}
                className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel>First Name</FieldLabel>
                  <input
                    required
                    type="text"
                    placeholder="John"
                    value={values.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel>Last Name</FieldLabel>
                  <input
                    required
                    type="text"
                    placeholder="Doe"
                    value={values.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    required
                    type="tel"
                    placeholder="+91 90000 00000"
                    value={values.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Enquiry</FieldLabel>
                <div className="relative">
                  <select
                    required
                    value={values.enquiry}
                    onChange={(e) => handleChange("enquiry", e.target.value)}
                    className={`${inputClass} appearance-none pr-10 ${
                      values.enquiry ? "text-white" : "text-white/30"
                    }`}
                  >
                    <option value="" disabled className="bg-[#141414] text-white/50">
                      Select an option
                    </option>
                    {ENQUIRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#141414] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                </div>
              </div>

              <div>
                <FieldLabel>Message</FieldLabel>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#E8C15B] to-[#b38b40] px-6 py-3.5 text-sm font-bold text-[#141414] shadow-lg shadow-[#b38b40]/25 transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Office / Red Fort */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-white/10">
          <div className="relative h-64 w-full sm:h-80">
            <Image
              src="https://images.unsplash.com/photo-1705524220939-dac17cf94236?auto=format&fit=crop&w=1600&q=80"
              alt="The Red Fort in Delhi at dusk"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent" />
          </div>
          <div className="bg-white/[0.03] p-6 sm:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E8C15B]">
              Head Office
            </span>
            <h3 className="mt-2 text-xl font-bold">Delhi</h3>
            <p className="mt-2 flex items-start gap-2 text-sm text-white/60">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E8C15B]" />
              D-22 LGF, Pandav Nagar, Near Laxmi Nagar, Delhi – 110092, India
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
              <a href="tel:+919990942211" className="flex items-center gap-2 text-white/80 hover:text-[#E8C15B]">
                <Phone className="h-4 w-4 text-[#E8C15B]" />
                +91 9990942211
              </a>
              <a
                href="mailto:info@mandarinworldwidevacations.com"
                className="flex items-center gap-2 text-white/80 hover:text-[#E8C15B]"
              >
                <Mail className="h-4 w-4 text-[#E8C15B]" />
                info@mandarinworldwidevacations.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
