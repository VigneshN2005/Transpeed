// Where "Get a Quote" enquiries go (2026-10-03, per Vignesh relaying
// Sharanya: clear call-to-action buttons on the services, connected to
// WhatsApp and email).
//
// TESTING VALUES: Vignesh's own inbox and WhatsApp while this is verified
// end to end. Before launch, replace both with the company's (e.g.
// info@transpeedlogistics.com and the company WhatsApp number). Nothing
// else needs to change.
export const ENQUIRY_EMAIL = "nvignesh88946@gmail.com"; // TESTING
/** WhatsApp number in international format, digits only (91 = India). */
export const ENQUIRY_WHATSAPP = "919380148456"; // TESTING

/** wa.me link that opens WhatsApp to the enquiry number with a message already typed. */
export function whatsappLink(message: string) {
  return `https://wa.me/${ENQUIRY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
