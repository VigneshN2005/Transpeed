import { Resend } from "resend";

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
