import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlassBackground from "@/components/ui/GlassBackground";
import NewsSideScene from "@/components/news/NewsSideScene";
import MobileBannerScene from "@/components/ui/MobileBannerScene";
import { createRouteClient } from "@/lib/supabase/route-client";
import type { Announcement } from "@/types";

// Database-backed (announcements table, managed from Admin > Client
// Announcements). No manual ordering — newest first, always, straight
// from created_at. The newest post gets a large hero treatment; the rest
// sit in a card grid below.
//
// Visual pass (2026-09-14, per Vignesh: "same with client announcements...
// make them look better"). Same data fetch and media-embedding logic as
// before — only the presentation changed: the hero's image (when present)
// is now a full-bleed banner rather than an inline thumbnail, cards get a
// proper image-on-top layout with a floating badge and a hover lift/zoom
// instead of a flat bordered box, and posts without an image get a
// gradient icon tile standing in for one so the grid still holds together.

export const metadata = {
  title: "News & Updates | Transpeed Logistics",
};

// Admin-managed content — always fetch fresh rather than caching a
// build-time snapshot.
export const revalidate = 0;

const TYPE_STYLES: Record<Announcement["type"], { label: string; badge: string }> = {
  news: { label: "News & Updates", badge: "bg-sky-100 text-sky-700" },
  update: { label: "New Announcement", badge: "bg-zinc-200 text-zinc-700" },
  image: { label: "Image", badge: "bg-teal-100 text-teal-700" },
  video: { label: "Video", badge: "bg-violet-100 text-violet-700" },
  "success-story": { label: "Success Story", badge: "bg-amber-100 text-amber-700" },
};

function youTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function vimeoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

function VideoEmbed({ url }: { url: string }) {
  const youtube = youTubeEmbedUrl(url);
  const vimeo = vimeoEmbedUrl(url);
  const embed = youtube ?? vimeo;

  if (embed) {
    return (
      <div className="overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={embed}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideoFile(url)) {
    return (
      <video controls className="w-full rounded-xl bg-black" style={{ aspectRatio: "16 / 9" }}>
        <source src={url} />
      </video>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
    >
      ▶ Watch video
    </a>
  );
}

function FileButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-brand hover:text-white"
    >
      📎 View attachment
    </a>
  );
}

// `skipImage` — the hero renders its own image as a full-bleed banner
// above this, so this only needs to add the video/file blocks there;
// grid cards render the image as their own top banner too (with the zoom
// hover), so they skip it here as well.
function PostMedia({ item, skipImage = false }: { item: Announcement; skipImage?: boolean }) {
  const hasContent = (!skipImage && item.image_url) || item.video_url || item.file_url;
  if (!hasContent) return null;
  return (
    <div className="mt-4 space-y-4">
      {!skipImage && item.image_url && (
        <div className="overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image_url} alt="" className="w-full object-cover" />
        </div>
      )}
      {item.video_url && <VideoEmbed url={item.video_url} />}
      {item.file_url && <FileButton url={item.file_url} />}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

// Gradient icon tile standing in for a post's image when it has none, so a
// text-only card in the grid still has a visual anchor instead of jumping
// straight to a header/badge.
function TypeTile({ type }: { type: Announcement["type"] }) {
  const glyphs: Record<Announcement["type"], string> = {
    news: "M4 4h16v16H4z M8 8h8M8 12h8M8 16h5",
    update: "M12 4v16M4 12h16",
    image: "M4 5h16v14H4z M8 13l3-3 3 3 3-4",
    video: "M4 6h13v12H4z M17 10l4-2v8l-4-2",
    "success-story": "M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z",
  };
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-dark via-[#2a1414] to-brand/40">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 24 24" fill="none" className="relative h-10 w-10 text-white/70" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={glyphs[type]} />
      </svg>
    </div>
  );
}

export default async function AnnouncementsPage() {
  const supabase = createRouteClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  const announcements = (data ?? []) as Announcement[];

  // Soft brand-red top glow behind the content area (2026-09-14, per
  // Vignesh, relaying meeting feedback that the site read as "pure white
  // and plain" and needed actual colour). This page has no dark PageHero
  // above it (starts straight into the Container), so the glow sits
  // top-left right from the very top of the page.
  const GLOW_CLASS = "relative";

  if (announcements.length === 0) {
    return (
      <>
        <GlassBackground page="announcements" canvas="#4A4D52" />
        <section id="news-content" className={GLOW_CLASS}>
        <NewsSideScene targetId="news-content" />
        {/* Phone/tablet: envelopes folding into newspapers behind the heading. */}
        <MobileBannerScene kind="news" fill="#4A4D52" className="absolute inset-x-0 top-0 h-72" />
        <Container className="relative py-20">
          <Reveal>
            <SectionHeading
              eyebrow="News & Updates"
              title="Updates from Transpeed"
              description="Success stories, posted images, videos, and the latest from Transpeed Logistics."
            />
          </Reveal>
          <p className="mt-10 text-sm text-white/60">Nothing posted yet, check back soon.</p>
        </Container>
        </section>
      </>
    );
  }

  const [hero, ...rest] = announcements;
  const heroStyle = TYPE_STYLES[hero.type];
  const heroDate = new Date(hero.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <GlassBackground page="announcements" canvas="#4A4D52" />
      <section id="news-content" className={GLOW_CLASS}>
      <NewsSideScene targetId="news-content" />
      {/* Phone/tablet: envelopes folding into newspapers behind the heading. */}
      <MobileBannerScene kind="news" fill="#4A4D52" className="absolute inset-x-0 top-0 h-72" />
      <Container className="relative py-20">
        <Reveal>
          <SectionHeading
            eyebrow="News & Updates"
            title="Updates from Transpeed"
            description="Success stories, posted images, videos, and the latest from Transpeed Logistics."
          />
        </Reveal>

        {/* Hero — always the newest post. A full-bleed banner when it has
            an image, otherwise a plain gradient panel; both feed into the
            same badge/description/date block underneath. */}
        <Reveal delay={80} className="mt-10 overflow-hidden rounded-3xl bg-brand-dark text-white shadow-[0_35px_70px_-30px_rgba(0,0,0,0.5)]">
          {hero.image_url ? (
            <div className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[21/8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.image_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/5 to-transparent" />
            </div>
          ) : (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden="true"
            />
          )}
          <div className="relative p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${heroStyle.badge}`}
              >
                {heroStyle.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                Latest
              </span>
            </div>
            {hero.description && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
                {hero.description}
              </p>
            )}
            <div className="max-w-2xl">
              <PostMedia item={hero} skipImage />
            </div>
            <p className="mt-6 flex items-center gap-1.5 text-xs text-zinc-400">
              <CalendarIcon />
              {heroDate}
            </p>
          </div>
        </Reveal>

        {/* Feed — same capped stagger pattern as the other card grids. */}
        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, i) => {
              const style = TYPE_STYLES[item.type];
              const date = new Date(item.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <Reveal key={item.id} delay={Math.min(i * 60, 240)}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-dark shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative overflow-hidden">
                      {item.image_url ? (
                        <div className="relative aspect-video w-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image_url}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <TypeTile type={item.type} />
                      )}
                      <span
                        className={`absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur ${style.badge}`}
                      >
                        {style.label}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {item.description && (
                        <p className="text-sm leading-relaxed text-white/70">{item.description}</p>
                      )}
                      <PostMedia item={item} skipImage />
                      <p className="mt-4 flex items-center gap-1.5 text-xs text-white/50">
                        <CalendarIcon />
                        {date}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </Container>
      </section>
    </>
  );
}
