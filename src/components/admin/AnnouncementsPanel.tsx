"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadAnnouncementMedia } from "@/lib/supabase/storage";
import type { Announcement } from "@/types";

// Deliberately minimal: pick a type (which doubles as the title), a date,
// a description, and up to one each of image/video/file (paste a link OR
// upload a file — an upload always wins if both are given). Posting it
// puts it straight on the site. There's no editing and no manual
// ordering — the table below just lists everything that exists, newest
// first, with a single "−" to remove a post for good.

const TYPES: { type: Announcement["type"]; label: string }[] = [
  { type: "news", label: "News & Updates" },
  { type: "update", label: "New Announcement" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "success-story", label: "Success Story" },
];

const EMPTY_FORM = {
  type: TYPES[0].type,
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

export default function AnnouncementsPanel() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileFile, setFileFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    setLoadError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError(error.message);
    } else {
      setItems((data ?? []) as Announcement[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setImageUrl("");
    setImageFile(null);
    setVideoUrl("");
    setVideoFile(null);
    setFileUrl("");
    setFileFile(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const preset = TYPES.find((t) => t.type === form.type)!;

      const [finalImage, finalVideo, finalFile] = await Promise.all([
        imageFile ? uploadAnnouncementMedia(imageFile) : Promise.resolve(imageUrl.trim() || null),
        videoFile ? uploadAnnouncementMedia(videoFile) : Promise.resolve(videoUrl.trim() || null),
        fileFile ? uploadAnnouncementMedia(fileFile) : Promise.resolve(fileUrl.trim() || null),
      ]);

      const { error: saveError } = await supabase.from("announcements").insert({
        type: preset.type,
        title: preset.label,
        date: form.date,
        description: form.description.trim(),
        image_url: finalImage,
        video_url: finalVideo,
        file_url: finalFile,
      });

      if (saveError) throw saveError;

      resetForm();
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong posting this.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this announcement? It's gone for good, no undo.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (!error) await loadItems();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Posted — newest first, − removes one for good
        </h2>

        {loadError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Couldn&apos;t load announcements: {loadError}
          </p>
        )}
        {loading && <p className="mt-3 text-sm text-zinc-400">Loading...</p>}

        {!loading && !loadError && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-3 py-2 font-semibold">Sl No</th>
                  <th className="px-3 py-2 font-semibold">Post</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-zinc-400">
                      Empty
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="border-b border-zinc-100 last:border-b-0">
                      <td className="px-3 py-2 text-zinc-500">{index + 1}</td>
                      <td className="px-3 py-2">
                        <span className="font-medium text-brand-dark">{item.title}</span>
                        <span className="ml-2 text-xs text-zinc-400">{item.date}</span>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Remove for good"
                          className="rounded border border-red-300 px-1.5 py-0.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                          −
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 p-6">
        <h2 className="text-sm font-semibold text-brand-dark">New Announcement</h2>

        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Type
          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value as Announcement["type"] }))
            }
            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
          >
            {TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Date
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Write the announcement..."
            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Image (optional)
            </p>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-md border border-zinc-300 p-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <p className="mt-1 text-center text-xs text-zinc-400">— or —</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-xs"
            />
          </div>

          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Video (optional)
            </p>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-2 w-full rounded-md border border-zinc-300 p-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <p className="mt-1 text-center text-xs text-zinc-400">— or —</p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-xs"
            />
          </div>

          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              File (optional)
            </p>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-md border border-zinc-300 p-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <p className="mt-1 text-center text-xs text-zinc-400">— or —</p>
            <input
              type="file"
              onChange={(e) => setFileFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-xs"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
          >
            {saving ? "Posting..." : "Post Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
