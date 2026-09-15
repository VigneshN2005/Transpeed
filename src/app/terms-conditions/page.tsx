import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { companyEmail } from "@/data/contact";

export const metadata = {
  title: "Terms & Conditions | Transpeed Logistics",
};

export default function TermsConditionsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions" lastUpdated="September 2026">
      <LegalSection heading="1. About These Terms">
        <p>
          These Terms &amp; Conditions govern your use of the Transpeed Logistics
          website and your engagement of our freight forwarding, customs
          clearance, and logistics services. By using this website or
          instructing us to handle a shipment, you accept these terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Our Services">
        <p>
          Transpeed Logistics Pvt Ltd provides freight forwarding (air, sea,
          and road), customs clearance, warehousing, and related logistics
          services across our offices in India and through our overseas
          sourcing and procurement network. The scope, cost, and timeline of
          any specific shipment are agreed separately with each client and
          are not governed by the general descriptions on this website.
        </p>
      </LegalSection>

      <LegalSection heading="3. Carriage &amp; Liability">
        <p>
          Unless a separate written contract says otherwise, all carriage,
          forwarding, and customs work we undertake is carried out subject to
          the standard trading conditions customary in the Indian freight
          forwarding industry, and to the liability limits set by the
          carriers, shipping lines, airlines, and customs authorities
          actually involved in a shipment. We act as agents in arranging
          carriage and customs formalities and do not guarantee delivery
          dates, which depend on carriers, ports, customs processing, and
          circumstances outside our control.
        </p>
      </LegalSection>

      <LegalSection heading="4. Client Responsibilities">
        <p>
          Clients are responsible for providing accurate shipment,
          consignee, and customs documentation. Transpeed Logistics is not
          liable for delays, penalties, or losses arising from incomplete or
          incorrect information supplied by the client or by third parties.
        </p>
      </LegalSection>

      <LegalSection heading="5. Payment">
        <p>
          Freight, customs duties, and service charges are payable as agreed
          in the applicable quotation or invoice for each shipment. Charges
          quoted on this website, if any, are indicative only.
        </p>
      </LegalSection>

      <LegalSection heading="6. Force Majeure">
        <p>
          We are not liable for delay or failure to perform caused by events
          beyond our reasonable control, including port congestion, customs
          action, strikes, weather, or other circumstances affecting
          carriers or infrastructure we rely on.
        </p>
      </LegalSection>

      <LegalSection heading="7. Governing Law">
        <p>
          These terms are governed by the laws of India, and disputes are
          subject to the jurisdiction of the courts at Bangalore, Karnataka,
          where Transpeed Logistics is headquartered.
        </p>
      </LegalSection>

      <LegalSection heading="8. Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${companyEmail}`} className="text-brand hover:underline">
            {companyEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
