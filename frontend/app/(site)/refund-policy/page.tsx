import React from "react";

export const metadata = {
  title: "Refund & Return Policy | MANDARIN WORLDWIDE",
  description:
    "Refund & Return Policy for MANDARIN WORLDWIDE (Mandarin Worldwide Travel Private Limited).",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 md:px-12 lg:px-40">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 lg:p-16">
        <h1 className="text-4xl md:text-5xl font-marcellus text-slate-900 mb-8 pb-8 border-b border-slate-100">
          Refund & Return Policy
        </h1>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section className="space-y-6">
            <p className="text-lg">
              In case of any valid point of dissatisfaction, the member can
              cancel their membership within 7 days of availing their first
              holiday by writing to us at{" "}
              <a
                href="mailto:info@Mandarinworldwidevacation.com"
                className="text-blue-600 hover:underline"
              >
                info@Mandarinworldwidevacation.com
              </a>
              .
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <p>
                Refund will be processed after deducting administration charges,
                ASF, and GST.
              </p>
              <p className="text-sm font-semibold text-slate-800">
                Note: This refund policy will not be applicable for premium
                business membership.
              </p>
            </div>

            <div className="flex items-start gap-4 bg-green-50/50 p-6 rounded-2xl border border-green-100">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
              <p className="text-green-900 font-medium">
                Approved refunds will be processed and credited within 7-14
                business days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
