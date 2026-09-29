import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { companyEmail } from "@/data/contact";

export const metadata = {
  title: "General Terms & Conditions | Transpeed Logistics",
};

// Replaced 2026-09-29 with Vignesh's new Terms & Conditions doc
// (TP_NEW_WEB.docx) — full rewrite, not a patch, so this page matches that
// document section-for-section rather than the earlier shorter draft. The
// doc's own numbering started at "2. Our Services" (its opening paragraph
// was unnumbered scope/definitions text with no heading of its own) — per
// Vignesh, given a proper "1." heading below so the page numbers 1-15
// straight through; sections 2-15 needed no change since they were
// already sequential.
export default function TermsConditionsPage() {
  return (
    <LegalPage
      title="General Terms &amp; Conditions"
      subtitle="Applicable to Domestic and International"
      lastUpdated="October 2026"
    >
      <LegalSection heading="1. Scope &amp; Definitions">
        <p>
          These General Terms &amp; Conditions (&quot;Terms&quot;) apply
          uniformly to all parties engaging with Transpeed Logistics Pvt.
          Ltd. (&quot;Transpeed Logistics,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), whether as a customer/client
          availing our freight forwarding, customs clearance, warehousing,
          or logistics services, or as a vendor/service provider engaged
          by us to support, supply, or fulfill any part of our operations
          — across both domestic transactions within India and
          international engagements spanning global trade routes.
        </p>
      </LegalSection>

      <LegalSection heading="2. Our Services">
        <p>
          Transpeed Logistics Pvt Ltd provides freight forwarding (air, sea
          and road), customs clearance, warehousing, project logistics and
          procurement and sourcing related logistics services across our
          offices in India or globally. The scope, cost and timeline of any
          specific shipment are agreed separately with each client via a
          written quotation, booking confirmation, or service agreement
          and are not governed by the general descriptions on this
          website.
        </p>
      </LegalSection>

      <LegalSection heading="3. Carriage &amp; Liability">
        <p>
          Unless a separate written contract says otherwise, all carriage,
          forwarding, and customs work we undertake is carried out subject
          to the standard trading conditions customary in the Indian
          freight forwarding industry — including, where applicable, the
          Standard Trading Conditions of the Federation of Freight
          Forwarders&apos; Associations in India (FFFAI) — and to the
          liability limits set by the carriers, shipping lines, NVOCC
          airlines and customs authorities actually involved in a
          shipment.
        </p>
        <p>
          We act as agents in arranging carriage, warehousing and customs
          formalities on behalf of our clients. We do not act as a carrier
          and do not guarantee delivery dates, which depend on carriers,
          ports, customs processing, weather and other circumstances
          outside our control. Our liability, where it arises, is limited
          to the extent permitted under the applicable trading conditions
          and Indian law and in no case shall exceed the amount of our
          service fee for the shipment in question, unless a higher
          liability is expressly agreed in writing.
        </p>
      </LegalSection>

      <LegalSection heading="4. Client Responsibilities">
        <p>
          Clients are responsible for providing accurate, complete and
          timely shipment, consignee and customs documentation, including
          correct cargo descriptions, values and classifications.
          Transpeed Logistics is not liable for delays, penalties, fines,
          or losses arising from incomplete, inaccurate, or misleading
          information supplied by the client or by third parties acting on
          the client&apos;s behalf.
        </p>
        <p>
          Clients are solely responsible for ensuring that goods tendered
          for shipment are accurately declared and do not consist of
          prohibited, restricted, hazardous, or dangerous goods unless full
          prior written disclosure has been made to Transpeed Logistics
          and all applicable regulatory requirements have been met.
          Transpeed Logistics reserves the right to refuse, suspend, or
          return any shipment that does not comply with this requirement of
          our principals.
        </p>
      </LegalSection>

      <LegalSection heading="5. Insurance">
        <p>
          Unless expressly agreed in writing, cargo insurance is not
          included in our services and remains the client&apos;s
          responsibility. We recommend clients arrange appropriate
          insurance cover for the full value of their goods prior to
          shipment. Transpeed Logistics accepts no liability for uninsured
          loss or damage beyond the limits set out in Section 3.
        </p>
      </LegalSection>

      <LegalSection heading="6. Payment &amp; Lien">
        <p>
          Freight, customs duties and service charges are payable as
          agreed in the applicable quotation or invoice for each shipment.
          Charges quoted on this website, if any, are indicative only and
          subject to change.
        </p>
        <p>
          Transpeed Logistics shall have a general and continuing lien on
          all goods, documents and property of the client in our
          possession or control, for all amounts due to us, whether
          relating to the specific shipment or any other outstanding
          account with the client. We may retain such goods or documents
          until payment is received in full and may recover storage and
          associated costs incurred during such retention.
        </p>
      </LegalSection>

      <LegalSection heading="7. Claims">
        <p>
          All claims relating to loss, damage, delay, or shortage of cargo
          shall be governed by and subject to, the terms and conditions,
          limits of liability and time bars stipulated by the carrier,
          airline, shipping line, NVOCC and any other government or
          statutory authority actually involved in the shipment. Transpeed
          Logistics acts solely as an agent in arranging such carriage and
          shall not accept any claim or liability that exceeds, conflicts
          with, or falls outside the Liner Terms and Conditions, or the
          terms and conditions of the respective carrier, airline, shipping
          line, or NVOCC.
        </p>
        <p>
          Once goods have been delivered to and accepted by client (or the
          client&apos;s authorized representative), Transpeed Logistics
          shall consider the shipment and associated services to have been
          accepted in good faith and in good condition. No further claims
          of any nature shall be entertained after such acceptance, except
          where a claim has been notified in writing prior to delivery
          acceptance and remains pending resolution.
        </p>
      </LegalSection>

      <LegalSection heading="8. Indemnity">
        <p>
          The client agrees to indemnify and hold Transpeed Logistics
          harmless against all claims, penalties, fines, losses, damages
          and costs (including legal costs) arising from: (a) inaccurate
          or incomplete documentation or declarations provided by the
          client; (b) mis-declared, prohibited, or hazardous goods
          tendered without proper disclosure; (c) breach of applicable
          customs, export, or import regulations attributable to the
          client; or (d) any third-party claim arising from the
          client&apos;s goods or instructions.
        </p>
      </LegalSection>

      <LegalSection heading="9. Force Majeure">
        <p>
          Transpeed Logistics is not liable for delay or failure to
          perform which causes by events beyond our reasonable control,
          including port congestion, customs action, strikes, natural
          disasters, war, epidemic or pandemic-related restrictions,
          weather or other circumstances affecting carriers, ports, or
          infrastructure we rely on.
        </p>
      </LegalSection>

      <LegalSection heading="10. Website Use">
        <p>
          This website and its content — including text, graphics, logos
          and images — are the property of Transpeed Logistics Pvt Ltd
          unless otherwise stated and may not be copied, reproduced, or
          used without prior written consent. While we take reasonable
          care to keep website information accurate and current, we do
          not warrant that all content is complete, error-free, or up to
          date and information on this website does not constitute a
          binding offer of service. This website may contain links to
          third-party websites; we are not responsible for the content,
          accuracy, or practices of any linked third-party sites.
        </p>
      </LegalSection>

      <LegalSection heading="11. Amendments">
        <p>
          We may update these Terms &amp; Conditions from time to time to
          reflect changes in our services, legal requirements, or business
          practices. The version published on this website at the time of
          your use or instruction shall apply. We encourage clients to
          review this page periodically.
        </p>
      </LegalSection>

      <LegalSection heading="12. Dispute Resolution &amp; Governing Law">
        <p>
          These terms are governed by the laws of India. Any dispute
          arising out of or in connection with these terms or our services
          shall first be attempted to be resolved through good-faith
          negotiation between the parties. If unresolved within a
          reasonable period, the dispute shall be referred to arbitration
          and Legal rescue in Bangalore, Karnataka, in accordance with
          the Arbitration and Conciliation Act, 1996 and shall be
          conducted in English. Subject to the above, the courts at
          Bangalore, Karnataka shall have exclusive jurisdiction over any
          matters not resolved through arbitration.
        </p>
      </LegalSection>

      <LegalSection heading="13. Severability">
        <p>
          If any provision of these Terms &amp; Conditions is found to be
          invalid or unenforceable under applicable law, the remaining
          provisions shall continue in full force and effect and the
          invalid provision shall be deemed modified to the minimum extent
          necessary to make it enforceable.
        </p>
      </LegalSection>

      <LegalSection heading="14. Entire Agreement">
        <p>
          These Terms &amp; Conditions, together with any specific
          quotation, booking confirmation, or written service agreement
          for a shipment, constitute the entire agreement between
          Transpeed Logistics and the client in relation to the services
          described and supersede any prior discussions or understandings
          on the same subject matter, unless expressly stated otherwise in
          writing.
        </p>
      </LegalSection>

      <LegalSection heading="15. Contact Us">
        <p>For questions regarding these Terms &amp; Conditions, please contact us at:</p>
        <p>
          Transpeed Logistics Pvt Ltd
          <br />
          #19, Kaveriappa Layout, Miller Road, Tank Bund Road, Opp. Jain
          Hospital, Vasanth Nagar, Bangalore – 560052
          <br />
          Email:{" "}
          <a href={`mailto:${companyEmail}`} className="text-brand hover:underline">
            {companyEmail}
          </a>
          <br />
          Phone:{" "}
          <a href="tel:+916360751645" className="text-brand hover:underline">
            +91 6360 751 645
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
