import type { Location, ContactChannel } from "@/types";

export const companyEmail = "info@transpeedlogistics.com";

// Real addresses from Gokul's "TP - Website.docx" + follow-up
// "TP - Website1.docx" (which supplied the Mysore address). Chennai: he
// separately confirmed using the "present" office address, not the new one
// that was also shared. Pune and Kanpur (the latter added 2026-09-25, per
// Vignesh) are still genuinely pending — new offices, listed as branches
// for now with their addresses to follow.
export const locations: Location[] = [
  {
    city: "Bangalore",
    address:
      "#19, Kaveriapp Layout, Miller Tank Bund Road, Opp Jain Hospital, Vasanth Nagar, Bangalore – 560052",
    isHeadquarters: true,
  },
  {
    city: "Delhi",
    address:
      "203, 1st Floor, 84D, Khasra No. 548, Lal Singh Building, Near Choti Red Light (Axis Bank), Main Mehrouli–Mahipalpur Road, Mahipalpur, New Delhi – 110037",
  },
  {
    city: "Kolkata",
    address: "Poddar Point, 113 Park Street, 5th Floor, Suite No. 514, Kolkata – 700016",
  },
  {
    city: "Chennai",
    address: "No.23/11, 3rd Floor, Linghi Chetty Street, Mannadi, Chennai – 600001",
  },
  {
    city: "Trivandrum",
    address:
      "Flat No. 1, Abis Apartment, Puliyoorkonam, Kottukal P.O., Uchakkada, Thiruvananthapuram – 695521",
  },
  {
    city: "Mumbai",
    address:
      "Gundecha Onclave, 1D4, 1st Floor, Saki Village, Kherani Road, Andheri (East), Mumbai – 400072, Maharashtra",
  },
  {
    city: "Mysore",
    address: "#23, 10th Main, 3rd Cross, F Block, JP Nagar, Mysore – 570008",
  },
  { city: "Pune", address: "New branch office, address to follow", isBranch: true },
  { city: "Kanpur", address: "New branch office, address to follow", isBranch: true },
];

// Overseas Sourcing & Procurement offices — country/region names only, per
// Gokul. Original 5 (USA, Singapore, Germany, Italy, Europe) plus a
// 2026-09-21 addition from Vignesh: 6 broader regions (Far East, Central
// Asia, South Asia, South West Asia, Middle East, Africa) and 4 more
// specific European countries (Norway, Sweden, Denmark, Austria).
export const overseasPresence = [
  "USA",
  "Singapore",
  "Germany",
  "Italy",
  "Europe",
  "Far East",
  "Central Asia",
  "South Asia",
  "South West Asia",
  "Middle East",
  "Africa",
  "Norway",
  "Sweden",
  "Denmark",
  "Austria",
];

// Phone and WhatsApp share one number, the temporary single point of
// contact until Transpeed hires a secretary (updated 2026-09-21, per
// Vignesh: "replace all the phone numbers by this"). "Chatbot" isn't a
// real link — its href is intercepted to open the on-page chatbot widget
// instead.
export const contactChannels: ContactChannel[] = [
  { label: "WhatsApp", value: "Transpeed Logistics Pvt Ltd", href: "https://wa.me/916360751645" },
  { label: "Chatbot", value: "Ask us anything, instantly", href: "#chatbot" },
  { label: "Email", value: companyEmail, href: `mailto:${companyEmail}` },
  { label: "Phone", value: "+91 63607 51645", href: "tel:+916360751645" },
];
