import type { Service } from "@/types";

// Real content from Gokul's "TP - Website.docx" (5 of 6 services), plus the
// Sourcing & Procurement copy PR Srinivasa sent separately — that one came
// with its own six-step structure (Sourced -> Delivered), used as `steps`
// below and doubling as the "diagram" the architecture deck calls for.
//
// Naming: Gokul explicitly confirmed this service is "Trucking and Delivery"
// everywhere on the site — not "Transportation & Delivery" (the architecture
// deck's working name) and not "Trucking & Delivery (Road Transport)" (the
// doc's own heading).
//
// `photo` added (2026-09-14, per Vignesh: "in the second page they wanted
// image for each services") — commissioned photos (one per service, all
// sharing the same warm/amber-accent cinematic style so the six read as
// one consistent shoot) used as a hero image on each service card, separate
// from the existing line-art `icon` used in the small icon tile.
export const services: Service[] = [
  {
    slug: "freight-forwarding-management",
    name: "Freight Forwarding Management",
    icon: "/images/services/freight-forwarding-management.png",
    photo: "/images/services/freight-forwarding-management-photo.jpg",
    tagline: "Air, Sea & Road: Wherever Your Business Needs to Go",
    shortDescription:
      "End-to-end coordination of ocean, air and multimodal shipments: booking, documentation, and carrier liaison handled as one service.",
    description:
      "Our freight forwarding network covers air, ocean, and road transport, with flexible routing options including door-to-door, port-to-door, door-to-port, and port-to-port. Whether you need FCL, LCL, courier, or break bulk, our team designs the route that balances speed, cost, and reliability.",
  },
  {
    slug: "customs-clearance",
    name: "Customs Clearance",
    icon: "/images/services/customs-clearance.png",
    photo: "/images/services/customs-clearance-photo.jpg",
    tagline: "Compliance Isn't Optional. Neither Is Speed.",
    shortDescription:
      "Import/export clearance handled by in-house AEO-certified specialists: compliant, duty-optimised, and delay-free.",
    description:
      "As a certified Authorised Economic Operator and licensed Customs House Agent (CHA) under Rule 8/9, we bring deep expertise in Indian import-export regulation to every shipment. Our licensed G Card and H Card professionals handle documentation, licensing, permits, DGFT approvals, and inspections end-to-end, so your goods clear customs without the guesswork or the delays, all under our own CHA license.",
  },
  {
    slug: "project-logistics",
    name: "Project Logistics",
    icon: "/images/services/project-logistics.png",
    photo: "/images/services/project-logistics-photo.jpg",
    tagline: "When Standard Shipping Isn't an Option",
    shortDescription:
      "Planning and execution for oversized, heavy-lift and time-critical project cargo, door-to-site.",
    description:
      "Some cargo doesn't fit into a container, literally. Our project logistics team plans and executes the movement of commodities, process equipment, modular plant units, high-value one-off items and construction equipment, managing every stage from planning through delivery with precision most forwarders can't match. We're also equipped to handle everything from dismantling to re-installation, ensuring your equipment is ready to operate at its destination.",
  },
  {
    slug: "warehousing-and-distribution",
    name: "Warehousing and Distribution",
    icon: "/images/services/warehousing-and-distribution.png",
    photo: "/images/services/warehousing-and-distribution-photo.jpg",
    tagline: "Your Inventory, Always Visible. Always Secure. Always Ready to Dispatch.",
    shortDescription:
      "Storage, inventory handling and last-mile distribution across our network of facilities.",
    description:
      "Our warehousing network spans general storage, bonded warehouse storage, value-added services, and Milk Run logistics, all managed by a team trained specifically in warehouse operations. With real-time tracking, you get full visibility into your inventory at every stage, not just when it ships.",
  },
  {
    slug: "trucking-and-delivery",
    name: "Trucking and Delivery",
    icon: "/images/services/trucking-and-delivery.png",
    photo: "/images/services/trucking-and-delivery-photo.jpg",
    tagline: "The Last Mile, Handled Like It's the Only Mile That Matters",
    shortDescription:
      "Domestic road transport, scheduled and tracked from pickup through final delivery.",
    description:
      "Reliable, well-maintained fleets get your goods to customer sites on schedule, every time. With LCL consolidation, full door-to-door delivery, and multimodal transportation, both domestic and overseas, we build in the flexibility that keeps your logistics costs down without cutting corners on service. From 0.50 kg parcels to oversized cargo, we handle it all.",
  },
  {
    slug: "sourcing-and-procurement",
    name: "Sourcing and Procurement",
    icon: "/images/services/sourcing-and-procurement.png",
    photo: "/images/services/sourcing-and-procurement-photo.jpg",
    diagram: "/images/services/sourcing-process-diagram.png",
    tagline: "Sourced. Procured. Imported. Cleared. Stored. Delivered. One Team, Start to Finish.",
    shortDescription:
      "Vendor sourcing and procurement support for clients expanding their supply base, the newest addition to the lineup.",
    description:
      "Sourcing isn't just about finding a supplier; it's about finding the right one, at the right price, without compromising on quality or timeline. We've built deep supplier networks and material expertise that industry leaders rely on for their most critical procurement needs, managing the entire journey from vendor identification to final delivery under one roof.",
    steps: [
      {
        title: "Sourced",
        text: "Whether you already have an approved supplier or need us to identify one, we adapt to your process. For customer-approved suppliers, we source directly as per your specifications. Where sourcing support is needed, we vet suppliers using our own expertise and take them through your approval process before onboarding.",
      },
      {
        title: "Procured",
        text: "We manage procurement in line with your defined MRP, ensuring cost control and compliance at every step, so you get the right cargo, at the right price, without surprises.",
      },
      {
        title: "Imported",
        text: "We handle end-to-end import by air and sea, backed by our logistics expertise, covering every leg from the supplier's door to the destination port.",
      },
      {
        title: "Cleared",
        text: "Our in-house customs clearance capability ensures your cargo moves through regulatory checkpoints without delays or guesswork.",
      },
      {
        title: "Stored",
        text: "We offer both bonded and private warehousing, giving you the flexibility to stock cargo securely until it's needed.",
      },
      {
        title: "Delivered",
        text: "Using our Milk Run delivery model, we move cargo from the supplier directly to your shop floor, on a daily, weekly, or monthly schedule, based on your requirement.",
      },
    ],
  },
];
