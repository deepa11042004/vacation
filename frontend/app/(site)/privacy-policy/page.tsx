import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Tourvia',
  description: 'Privacy Policy for Tourvia (Rosewood Worldwide Travel Private Limited).',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 md:px-12 lg:px-40">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 lg:p-16">
        <h1 className="text-4xl md:text-5xl font-marcellus text-slate-900 mb-8 pb-8 border-b border-slate-100">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mb-6">Introduction</h2>
            <p>
              This Privacy Policy describes how ROSEWOOD WORLDWIDE TRAVEL PRIVATE LIMITED and its affiliates (collectively &quot;we, our, us&quot;) collect, use, share, protect or otherwise process your information/personal data through our website (www.rosewoodworldwidetravel.com) (&quot;Platform&quot;).
            </p>
            <p>
              You may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service outside India, and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information, or availing any product/service offered on the Platform, you agree to be bound by the terms of this Privacy Policy and applicable Indian laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Collection</h2>
            <p>
              We collect your personal data when you use our Platform, services, or otherwise interact with us. This includes information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-slate-400">
              <li>Personal details: name, date of birth, address, telephone/mobile number, email ID.</li>
              <li>Proof of identity or address.</li>
              <li>Sensitive information: bank account details, payment information, biometric data, etc., with your consent.</li>
            </ul>
            <p>
              We may track your behavior and preferences on the Platform, and collect transaction-related data. Third-party platforms linked to our Platform will have their privacy policies, and we recommend reviewing them before sharing any information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Usage</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-slate-400">
              <li>Provide services and fulfill your requests.</li>
              <li>Enhance customer experience and resolve disputes.</li>
              <li>Prevent fraud and comply with legal obligations.</li>
              <li>Conduct research and customize your experience.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Sharing</h2>
            <p>We may share your personal data with:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-slate-400">
              <li>Internal group entities and affiliates for marketing purposes.</li>
              <li>Third parties such as business partners, service providers, and law enforcement agencies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Security Precautions</h2>
            <p>
              We adopt reasonable security measures to protect your data from unauthorized access. However, transmission over the internet cannot be guaranteed as completely secure, and users must safeguard their login credentials.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Data Deletion and Retention</h2>
            <p>
              You can delete your account through the Platform&apos;s settings. However, certain information may be retained for legitimate purposes such as fraud prevention and legal compliance. Retained data may be anonymized for research purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Your Rights</h2>
            <p>
              You may access, rectify, and update your personal data through the Platform. You can also withdraw your consent for data processing by contacting the Grievance Officer. Withdrawal of consent may limit the services we can provide to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Consent</h2>
            <p>
              By using our Platform, you consent to the collection, use, and processing of your information as outlined in this Privacy Policy. You may withdraw your consent by contacting us, subject to applicable laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Significant changes will be notified as required under applicable laws. Please review this policy regularly for updates.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus mt-12 mb-6">Grievance Officer</h2>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <p className="font-semibold text-slate-800">ROSEWOOD WORLDWIDE TRAVEL PRIVATE LIMITED</p>
              <p className="mt-1">2202, ATS DOLCE ZETA 1, GREATER NOIDA</p>
              
              <div className="mt-6 space-y-2">
                <p className="font-semibold text-slate-800">Contact us</p>
                <p>8851018470</p>
                <p>Phone Time: Monday - Friday (9:00 - 18:00)</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}