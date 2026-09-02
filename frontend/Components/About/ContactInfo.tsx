"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Badge from "@/UI/Badge";
import { Minus } from "lucide-react";

export default function ContactInfo({ hideBackground = false }: { hideBackground?: boolean }) {
  return (
    <section className={`w-full px-6 py-20 sm:px-10 lg:px-14 font-display ${hideBackground ? '' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Side - Details */}
          <div className="flex flex-col items-start lg:col-span-5 relative">
            <Badge
              text="GET IN TOUCH"
              variant="black"
              size="lg"
              icon={Minus}
              className="mb-5"
            />
            <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl tracking-tight mb-8">
              Contact Information
            </h2>

            <div className="flex flex-col gap-8 w-full">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Support Email</h4>
                  <a href="mailto:info@mandarinworldwidevacations.com" className="block text-gray-600 hover:text-blue-600 transition-colors">
                    info@mandarinworldwidevacations.com
                  </a>
                  <a href="mailto:support@mwvpl.com" className="block text-gray-600 hover:text-blue-600 transition-colors mt-1">
                    support@mwvpl.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Phone</h4>
                  <a href="tel:+919990942211" className="block text-gray-600 hover:text-green-600 transition-colors">
                    +91 9990942211
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <MapPin className="text-orange-600" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Mandarin Worldwide Vacation Pvt. Ltd.<br />
                    D-22, LGF, Pandav Nagar, Near Ram Leela Park,<br />
                    D-Block, Opposite Mother Dairy Main Plant,<br />
                    Laxmi Nagar, Pandav Nagar, New Delhi – 110092
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-full h-[500px] lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.204364405903!2d77.27961230623351!3d28.628205466827014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3548972af7d%3A0x673e164f16a6cb6e!2sMother%20Dairy%20Plant%2C%20Pandav%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110092!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
