import type React from "react"

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: [Current Date]</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the TriGo app ("the Service"), you agree to be bound by these Terms of Service
          ("Terms"). If you disagree with any part of these terms, you may not access the Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
        <p>
          TriGo is a community-based tricycle ride-hailing platform that connects passengers with local tricycle
          drivers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
        <p>
          (3.1). You must create an account to use the Service. You are responsible for maintaining the confidentiality
          of your account and password.
        </p>
        <p>
          (3.2). You agree to provide accurate, current, and complete information during the registration process and to
          update such information to keep it accurate, current, and complete.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Service for any illegal purpose or in violation of any local, state, national, or international law
          </li>
          <li>Harass, abuse, or harm another person</li>
          <li>Impersonate or misrepresent your affiliation with any person or entity</li>
          <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Payments and Fees</h2>
        <p>(5.1). Passengers agree to pay the fare shown in the app for each completed ride.</p>
        <p>(5.2). Drivers agree to the commission structure set by TriGo for each completed ride.</p>
        <p>(5.3). All payments are processed through our third-party payment processors.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Cancellation Policy</h2>
        <p>(6.1). Passengers may cancel a ride request without penalty within a specified time frame.</p>
        <p>(6.2). Repeated cancellations may result in penalties or account suspension.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Safety and Insurance</h2>
        <p>
          (7.1). While TriGo strives to ensure safety, we are not responsible for the actions of drivers or passengers.
        </p>
        <p>(7.2). Drivers are required to maintain appropriate insurance as required by local laws.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Modifications to the Service</h2>
        <p>
          TriGo reserves the right to modify or discontinue, temporarily or permanently, the Service with or without
          notice.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">9. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason
          whatsoever, including without limitation if you breach these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">10. Limitation of Liability</h2>
        <p>
          In no event shall TriGo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
          for any indirect, incidental, special, consequential or punitive damages.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of [Your Country / State], without
          regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">12. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your
          responsibility to check these Terms periodically for changes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">13. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at [contact email].</p>
      </section>
    </div>
  )
}

export default TermsOfService

