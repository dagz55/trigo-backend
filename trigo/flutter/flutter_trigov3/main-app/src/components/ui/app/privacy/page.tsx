import type React from "react"

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: [Current Date]</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          TriGo ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use our mobile application and services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Personal information (e.g., name, email address, phone number)</li>
          <li>Location data</li>
          <li>Payment information</li>
          <li>Profile information</li>
          <li>Communication data between passengers and drivers</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Sharing of Information</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Drivers and passengers (as necessary to facilitate rides)</li>
          <li>Service providers (e.g., payment processors, cloud storage providers)</li>
          <li>Law enforcement or government agencies (when required by law)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your personal
          information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
        <p>Depending on your location, you have certain rights regarding your personal information, including:</p>
        <ul className="list-disc list-inside ml-4">
          <li>The right to access your personal information</li>
          <li>The right to correct inaccurate information</li>
          <li>The right to delete your information</li>
          <li>The right to restrict or object to processing</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>
        <p>
          Our service is not intended for use by children under the age of 13. We do not knowingly collect personal
          information from children under 13.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at [contact email].</p>
      </section>
    </div>
  )
}

export default PrivacyPolicy

