import { createClient } from "@/lib/supabase/client";

const ANNOUNCEMENT_BUCKET = "announcement-media";

// Uploads a file (image or video) to the public announcement-media
// bucket and returns its public URL. Only ever called from the Admin >
// Client Announcements editor — RLS on storage.objects (see
// admin_schema.sql) only lets a signed-in session write to this bucket,
// so this silently fails for anyone not logged into /admin.
export async function uploadAnnouncementMedia(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(ANNOUNCEMENT_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(ANNOUNCEMENT_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
