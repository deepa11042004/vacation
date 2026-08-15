"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
    age: "",
    email: "",
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          city: formData.city,
          age: formData.age,
          email: formData.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", mobile: "", city: "", age: "", email: "", consent: false });
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-end px-4 py-12 md:px-12 lg:px-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80"
          alt="Family vacation background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Subtle dark gradient overlay to ensure the white card pops */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-[550px] bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 leading-snug">
          Know More About <br /> Mandarin Vacations
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Row 1: Name and Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 font-medium">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: City and Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Select City"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors pr-10"
                  required
                />
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 font-medium">
                Age <span className="text-red-500">*</span>
              </label>
              <select
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500 transition-colors appearance-none"
                required
              >
                <option value="" disabled>
                  Age Group
                </option>
                <option value="18-25">18 - 25</option>
                <option value="26-35">26 - 35</option>
                <option value="36-45">36 - 45</option>
                <option value="46-55">46 - 55</option>
                <option value="56+">56+</option>
              </select>
            </div>
          </div>

          {/* Row 3: Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-500 font-medium">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              required
            />
          </div>

          {/* reCAPTCHA UI Mockup */}
          <div className="flex justify-center my-2">
            <div className="flex items-center justify-between w-full max-w-[300px] border border-gray-300 bg-gray-50 rounded px-3 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 border-2 border-gray-300 rounded bg-white flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  {/* Fake checkbox for recaptcha */}
                </div>
                <span className="text-sm text-gray-700">I'm not a robot</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/Img/newlogo.jpeg"
                  alt="reCAPTCHA"
                  width={24}
                  height={24}
                  className="opacity-50 grayscale mix-blend-multiply"
                />
                <span className="text-[10px] text-gray-400 mt-1">reCAPTCHA</span>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              name="consent"
              id="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 w-4 h-4 border-gray-300 rounded text-black focus:ring-black cursor-pointer"
              required
            />
            <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed select-none cursor-pointer">
              I agree to be contacted by Mandarin Vacations regarding my interest via phone call, WhatsApp or any other medium. I hereby provide my consent as per the T&C and Declaration.
            </label>
          </div>

          {/* Error / Success feedback */}
          {error && (
            <p className="text-sm text-red-600 text-center -mb-2">{error}</p>
          )}
          {submitted && (
            <p className="text-sm text-green-600 text-center font-medium -mb-2">
              ✓ Thank you! We&apos;ll get in touch soon.
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white font-semibold rounded-full py-4 mt-2 hover:bg-neutral-800 transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
