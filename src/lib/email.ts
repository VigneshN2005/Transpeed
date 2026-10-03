import { Resend } from "resend";
import { ENQUIRY_EMAIL } from "@/data/enquiry";

// Sends the chatbot's "couldn't answer this, here's who asked and what they
// asked" notification straight to the team's inbox. Uses Resend's own
// onboarding/test sending domain (no DNS/domain verification needed to get
// this working) — swap FROM_ADDRESS to a verified transpeedlogistics.com
// address once the site is live and that domain is verified in Resend.
//
// TO_ADDRESS is currently a personal test inbox while this feature is being
// verified end-to-end — swap to the real team inbox (e.g.
// info@transpeedlogistics.com) before this goes live for real visitors.
const FROM_ADDRESS = "Transpeed Chatbot <onboarding@resend.dev>";
const TO_ADDRESS = "nvignesh88946@gmail.com"; // TESTING — replace with the real team inbox before launch

let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set — add it to .env.local");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendFollowUpEmail(details: {
  question: string;
  name: string | null;
  phone: string | null;
  email: string | null;
}) {
  const { question, name, phone, email } = details;

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    subject: "New chatbot follow-up request",
    text: [
      "Someone on the website asked the chatbot a question it couldn't answer,",
      "and left their details for a follow-up.",
      "",
      `Question: ${question}`,
      "",
      `Name: ${name || "(not given)"}`,
      `Phone: ${phone || "(not given)"}`,
      `Email: ${email || "(not given)"}`,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message || "Resend rejected the email");
  }
}

// Quote / enquiry requests from the "Get a Quote" form (2026-10-03, per
// Vignesh). Goes to ENQUIRY_EMAIL (data/enquiry.ts), with Reply-To set to
// the customer so the team can answer straight from their inbox.
export async function sendEnquiryEmail(e: {
  service: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  origin: string;
  destination: string;
  message: string;
}) {
  const resend = getResendClient();
  const lines = [
    `New quote request from the website — ${e.service}`,
    "",
    `Service: ${e.service}`,
    `Name: ${e.name}`,
    `Phone: ${e.phone}`,
    `Email: ${e.email}`,
    `Company: ${e.company || "(not given)"}`,
    `From: ${e.origin || "(not given)"}`,
    `To: ${e.destination || "(not given)"}`,
    "",
    "Details:",
    e.message || "(none)",
    "",
    "Reply to this email to answer the customer directly.",
  ];
  const { error } = await resend.emails.send({
    from: "Transpeed Website <onboarding@resend.dev>",
    to: ENQUIRY_EMAIL,
    replyTo: e.email,
    subject: `New quote request: ${e.service} — ${e.name}`,
    text: lines.join("\n"),
  });
  if (error) {
    throw new Error(error.message || "Resend rejected the email");
  }
}
