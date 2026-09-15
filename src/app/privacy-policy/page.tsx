import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { companyEmail } from "@/data/contact";

export const metadata = {
  title: "Privacy Policy | Transpeed Logistics",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="September 2026">
      <LegalSection heading="1. Overview">
        <p>
          This policy explains how Transpeed Logistics Pvt Ltd handles
          information in connection with this website. We have kept this
          website deliberately simple: it does not run any advertising or
          analytics tracking, and it has no forms that collect your personal
          details.
        </p>
      </LegalSection>

      <LegalSection heading="2. What Information We Receive">
        <p>
          Our Contact page does not include a data-collecting form. Every
          contact option on it — WhatsApp, email, phone, and our on-page
          chatbot — is something you choose to open yourself, on your own
          device, using your own messaging or email application. We only
          receive what you decide to send us that way, such as your name,
          contact details, and shipment enquiry, when you message or email
          us directly.
        </p>
        <p>
          If you use the chatbot widget, the question you type is stored so
          we can improve our answers and, if we don&apos;t have an answer
          yet, so our team can follow up. We do not ask the chatbot for, and
          it does not knowingly collect, sensitive personal information.
        </p>
      </LegalSection>

      <LegalSection heading="3. Cookies">
        <p>
          This website does not use advertising or analytics cookies. See
          our{" "}
          <a href="/cookies-policy" className="text-brand hover:underline">
            Cookie Policy
          </a>{" "}
          for the one cookie we do use.
        </p>
      </LegalSection>

      <LegalSection heading="4. How We Use Information">
        <p>
          Any details you send us through WhatsApp, email, phone, or the
          chatbot are used only to respond to your enquiry and to provide
          our freight forwarding, customs clearance, and logistics services.
          We do not sell or rent your information to third parties.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data Security">
        <p>
          Our systems are built on industry-standard infrastructure with
          access controls in place for our internal team. No method of
          transmission or storage is completely secure, and we work to use
          commercially reasonable safeguards appropriate to the information
          we hold.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your Rights">
        <p>
          You may ask us what information we hold about you, request a
          correction, or ask us to delete it, by writing to{" "}
          <a href={`mailto:${companyEmail}`} className="text-brand hover:underline">
            {companyEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes to This Policy">
        <p>
          We may update this policy as our website or services change. The
          date at the top of this page shows when it was last revised.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
