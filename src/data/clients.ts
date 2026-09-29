import type { ClientLogo } from "@/types";

// Rossel and LTTS are confirmed new additions from Gokul's requirements
// doc. Rossel's real registered name/logo is "Rossell Techsys (Division of
// Rossell India Ltd)" — corrected below now that the logo arrived. LTTS'
// logo is the parent L&T corporate mark (same as L&T Construction's logo
// below — both are Larsen & Toubro group companies). Instaworks Pvt Ltd
// (2026-09-25, per Vignesh: "remove instaworks in our clients") has been
// removed entirely — it never had a confirmed logo (a web search only
// turned up an unrelated, defunct company of the same name), and Vignesh
// has now dropped it as a client rather than waiting on Gokul for one.
// The 8 entries below (Tata Power through BGR Energy) are real client logos
// pulled directly from the current live transpeedlogistics.com site's "Our
// Clients" carousel — these replace the earlier "Sample Client A/B"
// placeholders. Companies that were on the removal list (Susten by Mahindra,
// CEAT, Nippon, Alfa Laval, Disposafe, AIS, Onida, Maruti) were deliberately
// excluded. If Gokul later sends official/updated logo files for any of
// these, swap the file in place.
export const clients: ClientLogo[] = [
  { name: "Rossell Techsys", logo: "/images/clients/rossell-techsys.jpg" },
  { name: "LTTS", logo: "/images/clients/ltts.png" },
  { name: "Tata Power", logo: "/images/clients/tata-power.png" },
  { name: "Phalada Pure & Sure", logo: "/images/clients/phalada-pure-and-sure.jpg" },
  { name: "The Manipal Group", logo: "/images/clients/manipal-group.png" },
  { name: "NICORE Magnetic Cores", logo: "/images/clients/nicore-magnetic-cores.png" },
  { name: "Flair", logo: "/images/clients/flair.png" },
  { name: "L&T Construction", logo: "/images/clients/lt-construction.jpg" },
  { name: "Röchling", logo: "/images/clients/rochling.png" },
  { name: "BGR Energy", logo: "/images/clients/bgr-energy.png" },
];
