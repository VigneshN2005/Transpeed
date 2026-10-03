import type { TeamMember } from "@/types";

// Real names, roles, and career histories, from Gokul's "TP - Website.docx"
// (original) plus "TP - Website1.docx" (follow-up, which added Hari Singh's
// and Sandhya's full bios and resolved the revenue-figure conflict below).
// Roles below (Advisor / Founder / Co-Founder) are the labels the doc
// specifies for the revamped site's People list — the current live site
// captions these three differently (Founder / Managing Director /
// Director), but the doc's text is the explicit instruction for the rebuild.
//
// Revenue figure RESOLVED (was previously omitted pending Gokul's
// confirmation): the follow-up doc corrects Venkatesh's Transpeed tenure to
// $2M → $15M, matching the Company page's Journey figure (see company.ts) —
// the earlier $2M → $6M figure was superseded, not a second valid number.
// The doc also updated his Transpeed title from "President" to "Chairman &
// Founder", and his Atlas Logistics title from "Chairman & Managing
// Director" to "Chairman & Founder" — both reflected below. The People
// list's own headline role for him stays "Founder", per the doc's list.
//
// Sandhya's bio in the follow-up doc refers to her throughout as "Ms.
// Venkatesh" (a south-Indian convention of using the husband's given name
// as her displayed surname). Per Vignesh (2026-09-13): she is married to
// Venkatesh and a business partner (Co-Founder) in her own right — "Ms."
// was kept deliberately rather than switched to "Mrs.", since a company
// bio is a professional register where "Ms." (marital-status-neutral,
// parallel to "Mr.") is the more conventional choice; "Mrs." was tried
// briefly and reverted. "Venkatesh" as her surname follows the doc's own
// convention above.
//
// Honorifics: the doc addresses all three as "Mr."/"Ms." throughout —
// added back into the display name and the opening line of each
// bio/leadership note (site copy had dropped them for a more casual tone;
// restored per Vignesh's request).
//
// Photos: cropped from the team photo in Gokul's doc — real photos of all
// three. Hari Singh's and Sandhya's are final (per Gokul, their existing
// photos are being reused as-is). Venkatesh's photo was swapped again
// 2026-09-21 per Vignesh: a new event photo (mid-speech at a podium, mic in
// hand, lapel pins) replacing the earlier posed studio headshot. Cropped to
// the same 4:5 portrait frame the People page uses (face-centered via
// Haar-cascade detection, not eyeballed) rather than relying on the
// browser's object-cover to crop an unreviewed frame.
export const people: TeamMember[] = [
  {
    slug: "venkatesh-rao",
    name: "Mr. Venkatesh Rao",
    role: "Founder",
    bio: "A seasoned professional with a distinguished career spanning over three decades in the logistics and supply chain industry, Mr. Venkatesh Rao has a proven track record of leadership and strategic acumen, driving the growth and success of several prominent organizations across India and globally.",
    experience: [
      {
        org: "Indian Institute of Management, Bangalore",
        period: "Early career",
        detail:
          "Began his career in administration and finance, laying the foundation for his organizational and management expertise.",
      },
      {
        org: "Gulf Air",
        period: "1983–1987",
        detail:
          "As Sales Manager, contributed to the airline's growth, helping establish it as the second-largest carrier after Air India.",
      },
      {
        org: "Thomas Cook India",
        period: "1987–1992",
        detail:
          "Started as Assistant Manager in Karnataka, playing a key role in establishing Thomas Cook's logistics operations nationwide, rising to General Manager, India.",
      },
      // Added 2026-10-03, per Vignesh: listed below Thomas Cook as a normal
      // entry (he asked for no special highlight).
      {
        org: "Indian Institute of Management, Ahmedabad",
        period: "1990",
        detail: "— 3-Tier Programme of Management Development",
      },
      {
        org: "Hecny Freight India (P) Ltd",
        period: "1992–1999",
        detail:
          "Joined as Managing Director, leading the company's expansion across India, establishing 18 offices and a turnover of USD 50 million.",
      },
      {
        org: "Atlas Logistics Pvt Ltd",
        period: "1999–2011",
        detail:
          "As Chairman & Founder, expanded the company's footprint to 25 offices in India and 13 overseas, growing turnover to USD 125 million before its acquisition by SBS Logistics in 2011.",
      },
      {
        org: "Transpeed Logistics Pvt Ltd",
        period: "2017–present",
        detail:
          "As Chairman & Founder, acquired Transpeed in 2017, growing turnover from USD 2 million to USD 15 million and expanding its office network from 5 to 9 locations.",
      },
    ],
    leadershipNote:
      "Mr. Venkatesh Rao's leadership combines entrepreneurial drive with operational discipline, a strong instinct for identifying growth opportunities in emerging markets, paired with the infrastructure and teams to capitalise on them. He's widely respected for his mentorship style, empowering teams with clear direction while encouraging ownership and accountability at every level.",
    // Filename bumped to -v3 (rather than a ?query string, which Next's
    // Image component rejects unless allow-listed in images.localPatterns)
    // so this new photo gets a fresh URL instead of Next's image optimizer
    // serving a stale cached render of the old file at this path.
    photo: "/images/people/venkatesh-rao-v3.jpg",
  },
  {
    slug: "sandhya-rao",
    name: "Ms. Sandhya Venkatesh",
    role: "Co-Founder",
    bio: "Ms. Sandhya Venkatesh brings a distinguished career spanning nearly four decades in the banking and financial services sector, along with the discipline, integrity, and strategic acumen that come with it.",
    experience: [
      {
        org: "Reserve Bank of India",
        period: "38 years",
        detail:
          "A post-graduate in Arts (M.A.), she began her professional journey with the RBI, building an extensive career over 38 years of continuous service and rising to the position of Manager before opting for voluntary retirement to pursue new professional pursuits.",
      },
    ],
    leadershipNote:
      "Her decades of experience within one of the country's most respected financial institutions have equipped her with deep insight into governance, compliance, and organisational discipline, qualities she now brings to Transpeed Logistics as Co-Founder, helping shape the company's foundation with the same rigour and dedication that defined her career at the RBI.",
    // Enhanced 2x version (2026-10-03, per Vignesh): Real-ESRGAN upscale
    // blended with the original's texture for a natural face, new filename
    // so browsers and Next's image cache pick it up straight away.
    photo: "/images/people/sandhya-rao-v2.jpg",
  },
  // Added 2026-09-21, per Vignesh, with real copy and photo supplied
  // directly (not from Gokul's docx). Em-dashes in the supplied text
  // rewritten as commas/full stops and "rigor" normalised to "rigour", to
  // match the em-dash-free, British-spelling house style already applied
  // across the rest of this file (2026-09-15 site-wide pass). Photo cropped
  // to the same 4:5 portrait frame as the others, face-centered via
  // Haar-cascade detection on the supplied photo.
  {
    slug: "sharanya-venkatesh",
    name: "Ms. Sharanya Venkatesh",
    role: "Shareholder & Board Member",
    bio: "Ms. Sharanya Venkatesh represents the next generation of leadership at Transpeed Logistics, bringing a rare combination of global academic excellence and a strong foundation in business strategy to the organisation as a Shareholder and Board Member. Her education across India, the United States, and the United Kingdom reflects a truly international outlook, one she brings to the boardroom as Transpeed continues building its vision of a world-class, compliance-driven logistics partner for businesses across the globe.",
    experience: [
      {
        org: "Christ University, Bangalore",
        period: "Undergraduate",
        detail: "Completed her undergraduate degree, the first step in an academic journey that would go on to span three countries.",
      },
      {
        org: "Illinois Institute of Technology, Chicago, USA",
        period: "Postgraduate",
        detail: "Went on to complete postgraduate studies, broadening her exposure to a global business environment.",
      },
      {
        org: "University of Oxford, England",
        period: "MBA",
        detail: "Completed her Master of Business Administration (MBA), one of the world's most prestigious business schools.",
      },
    ],
    leadershipNote:
      "This cross-continental academic journey has shaped her into a thoughtful, globally-minded voice on Transpeed's board, one that blends analytical rigour with long-term strategic thinking, and reflects the company's commitment to combining experienced leadership with fresh, forward-looking perspective as it moves into its next phase of growth.",
    photo: "/images/people/sharanya-venkatesh.jpg",
  },
  {
    slug: "hari-singh",
    name: "Mr. Hari Singh",
    role: "Advisor",
    bio: "Mr. Hari Singh brings over four decades of leadership experience across the aviation, cargo, and logistics industry, having held senior positions with some of the most respected names in global air travel and freight.",
    experience: [
      {
        org: "Gordon Woodroffe & Co.",
        period: "Early career",
        detail:
          "Began his career as Manager, laying the foundation for a career built on operational excellence and industry expertise.",
      },
      {
        org: "Air France",
        period: "15 years",
        detail:
          "Served as Regional Head – Cargo, Southern India, overseeing cargo operations across the region and strengthening the airline's presence in the Indian market.",
      },
      {
        org: "Hermes Travels and Cargo",
        period: "",
        detail: "Served as General Manager, further expanding his expertise across the travel and cargo value chain.",
      },
      {
        org: "Pelican Airline",
        period: "",
        detail: "Held one of the most senior roles of his career as Chief Executive Officer.",
      },
      {
        org: "SriLankan Airlines",
        period: "",
        detail:
          "Retired as General Sales Agent (GSA), representing the airline's commercial and cargo interests with distinction.",
      },
    ],
    leadershipNote:
      "With a career spanning some of the most prominent names in the aviation and logistics sector, Mr. Hari Singh brings unparalleled industry insight, leadership, and strategic vision to Transpeed Logistics as Advisor, guiding the company's growth with the depth of experience only decades in the field can offer.",
    photo: "/images/people/hari-singh.jpg",
  },
];
