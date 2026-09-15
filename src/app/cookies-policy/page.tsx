import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { companyEmail } from "@/data/contact";

export const metadata = {
  title: "Cookie Policy | Transpeed Logistics",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="September 2026">
      <LegalSection heading="1. What Cookies Are">
        <p>
          Cookies are small text files a website can place on your device to
          remember information between visits.
        </p>
      </LegalSection>

      <LegalSection heading="2. Cookies We Use">
        <p>
          This website keeps things simple. We do not use advertising
          cookies, analytics cookies, or any third-party tracking cookies —
          there are no such scripts anywhere on this site.
        </p>
        <p>
          The only cookie in use is a strictly necessary session cookie,
          created only when a member of our team signs in to the site&apos;s
          Admin area to manage enquiries and content. It identifies that
          logged-in session so the Admin area works correctly, is not used
          to track visitors, and is not set for anyone browsing the public
          website.
        </p>
      </LegalSection>

      <LegalSection heading="3. Managing Cookies">
        <p>
          Because this site sets no tracking cookies, there is nothing for
          general visitors to opt out of. If you&apos;d prefer, you can still
          clear or block cookies at any time through your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="4. Changes to This Policy">
        <p>
          If that ever changes — for example, if we add a new feature that
          needs a cookie — we will update this page and the date above.
        </p>
      </LegalSection>

      <LegalSection heading="5. Contact">
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${companyEmail}`} className="text-brand hover:underline">
            {companyEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
