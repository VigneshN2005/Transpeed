"use client";

// Site-wide heading + key-phrase motion (2026-10-02, per Vignesh: "apply the
// heading thing i told also the key phrase highlight too"). Mounted once in
// the root layout; on every page it finds the headings inside <main> and:
//   - gives every heading the soft heading shadow (.tp-heading);
//   - large headings (section titles, service names, people's names, the
//     Mission/Vision statements, ~28px and up or data-tp="words") rise word
//     by word from behind an invisible line when scrolled to;
//   - smaller headings (card titles, labels, data-tp="line") rise as one
//     line;
//   - .tp-key phrases get a soft red underline that draws in after the
//     text appears.
// Plays once per element. Headings already on screen when the page loads
// (e.g. the first service, the first person, "Our Locations") wait for the
// banner intro, then animate in top-to-bottom order (2026-10-02, per
// Vignesh: those first headings weren't animating at all). Key phrases on
// screen at load draw in after the banner has settled. Skips the admin area, SectionHeading (it animates
// itself), anything aria-hidden and the maps. Off for reduced-motion users,
// and with JS off everything simply shows. CSS lives in globals.css.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const WORDS_MIN_PX = 28;
/** When headings already on screen at load start, so the banner intro plays first. */
export const INTRO_DELAY_MS = 1500;

function splitWords(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement?.closest("svg") || !n.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  let i = 0;
  nodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    (node.nodeValue ?? "").split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const mask = document.createElement("span");
      mask.className = "tp-m";
      const word = document.createElement("span");
      word.className = "tp-w";
      word.textContent = part;
      // quick stagger, tightening after the first dozen words so long
      // statements don't take forever
      const d = i < 12 ? i * 150 : 12 * 150 + (i - 12) * 70;
      mask.style.setProperty("--d", `${d}ms`);
      word.style.setProperty("--d", `${d}ms`);
      mask.appendChild(word);
      frag.appendChild(mask);
      i++;
    });
    node.parentNode?.replaceChild(frag, node);
  });
}

export default function HeadingMotion() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip the (privately addressed) admin pages, which mark themselves
    // with data-admin-area instead of being identified by their URL.
    if (document.querySelector("[data-admin-area]")) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;
    const timers: number[] = [];

    const run = () => {
      const main = document.querySelector("main");
      if (!main) return;
      const H = window.innerHeight;
      const onScreen = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.top < H * 0.9 && r.bottom > 0;
      };
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io?.unobserve(e.target);
            const el = e.target as HTMLElement;
            requestAnimationFrame(() => el.setAttribute("data-tpin", ""));
          }),
        { threshold: 0.3, rootMargin: "0px 0px -15% 0px" },
      );

      let onScreenCount = 0;
      main.querySelectorAll<HTMLElement>("h2, h3, h4, [data-tp]").forEach((el) => {
        if (
          el.hasAttribute("data-tpdone") ||
          el.closest(".tp-sh, [aria-hidden='true'], .leaflet-container") ||
          !el.textContent?.trim()
        )
          return;
        el.setAttribute("data-tpdone", "");
        el.classList.add("tp-heading");
        if (reduced) return;
        const mode =
          el.dataset.tp ?? (parseFloat(getComputedStyle(el).fontSize) >= WORDS_MIN_PX ? "words" : "line");
        if (mode === "words") {
          splitWords(el);
          el.setAttribute("data-tpa", "");
        } else {
          el.setAttribute("data-tpl", "");
        }
        if (onScreen(el)) {
          const delay = INTRO_DELAY_MS + onScreenCount++ * 250;
          timers.push(window.setTimeout(() => el.setAttribute("data-tpin", ""), delay));
        } else {
          io!.observe(el);
        }
      });

      main.querySelectorAll<HTMLElement>(".tp-key").forEach((el) => {
        if (el.hasAttribute("data-tpdone")) return;
        el.setAttribute("data-tpdone", "");
        if (reduced) return;
        el.setAttribute("data-tpa", "");
        if (onScreen(el)) {
          // on screen at load (e.g. in the banner): draw once the intro settles
          timers.push(window.setTimeout(() => el.setAttribute("data-tpin", ""), 2600));
        } else {
          io!.observe(el);
        }
      });
    };

    // let the new page paint first (also covers client-side navigation)
    timers.push(window.setTimeout(run, 60));
    return () => {
      timers.forEach((t) => clearTimeout(t));
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
