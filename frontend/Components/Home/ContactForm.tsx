"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";
import { useState } from "react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { Minus } from "lucide-react";

type Field = {
  id: keyof FormValues;
  label: string;
  placeholder: string;
  type?: string;
};

type FormValues = {
  name: string;
  surname: string;
  checkIn: string;
  checkOut: string;
  room: string;
  email: string;
};

const fields: Field[] = [
  { id: "name", label: "Name", placeholder: "George" },
  { id: "surname", label: "Surname", placeholder: "Webbster" },
  { id: "checkIn", label: "Check-in", placeholder: "September" },
  { id: "checkOut", label: "Check-out", placeholder: "October" },
  { id: "room", label: "Room", placeholder: "Amber Suite" },
  {
    id: "email",
    label: "Email",
    placeholder: "webbster.g@example.com",
    type: "email",
  },
];

const defaultValues: FormValues = {
  name: "George",
  surname: "Webbster",
  checkIn: "September",
  checkOut: "October",
  room: "Amber Suite",
  email: "webbster.g@example.com",
};

const orbitImages = [
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(defaultValues);

  const handleChange = (id: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire this up to your booking endpoint
    console.log(values);
  };

  return (
    <section className="relative min-h-[200vh] w-full flex items-center justify-center overflow-hidden bg-white py-36">
      {/* concentric rings */}
      <div className="absolute w-150 h-150 md:w-220 md:h-220 border border-gray-300 rounded-full pointer-events-none animate-[pulse_6s_infinite]" />
      <div className="absolute w-225 h-225 md:w-275 md:h-275 lg:w-300 lg:h-300 border border-gray-300 rounded-full pointer-events-none" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="hidden sm:flex absolute items-center justify-center rounded-full pointer-events-none
          [--orbit-r:480px] [--orbit-img-w:7rem] [--orbit-img-h:9rem]
          md:[--orbit-r:560px] md:[--orbit-img-w:8rem] md:[--orbit-img-h:11rem]
          lg:[--orbit-r:640px] lg:[--orbit-img-w:10rem] lg:[--orbit-img-h:14rem]"
      >
        {orbitImages.map((src, index) => {
          const angle = (index / orbitImages.length) * 360;
          return (
            <div
              key={src}
              className="absolute w-(--orbit-img-w) h-(--orbit-img-h) overflow-hidden rounded-2xl shadow-lg border border-black/5 bg-white"
              style={{
                transform: `rotate(${angle}deg) translateY(calc(-1 * var(--orbit-r))) rotate(-${angle}deg)`,
              }}
            >
              <Image
                src={src}
                alt="Atmospheric hotel snippet"
                fill
                sizes="(min-width: 1024px) 160px, (min-width: 768px) 128px, 112px"
                className="object-cover rounded-2xl"
              />
            </div>
          );
        })}
      </motion.div>

      {/* form, fixed at the center of the rings */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl px-6"
      >
        <div className="text-center mb-12">
          <Badge icon={Minus} text="Book Now" variant="black" className="uppercase tracking-[0.5em]" />
          <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-tight text-black">
            Your perfect stay
            <br />
            starts right here
          </h2>
        </div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-0"
        >
          {fields.map((field) => (
            <motion.div
              key={field.id}
              variants={rowVariants}
              className="grid grid-cols-[110px_1fr] md:grid-cols-[130px_1fr] items-baseline gap-4 border-b border-black/10 py-4"
            >
              <label
                htmlFor={field.id}
                className="text-[11px] tracking-[0.2em] text-black/40 uppercase"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type ?? "text"}
                value={values[field.id]}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-transparent text-black text-base md:text-lg font-medium placeholder:text-black/30 outline-none focus:placeholder:text-black/10 transition-colors"
              />
            </motion.div>
          ))}

          <motion.div
            variants={rowVariants}
            className="flex justify-center pt-10"
          >
            <CtaButton text="Book now" variant="blue" size="md" type="submit" />
          </motion.div>
        </motion.form>
      </motion.div>
    </section>
  );
}
