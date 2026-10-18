/** Pulls a bare 11-character YouTube video ID out of whatever an admin
 * pasted — the raw ID itself, or a watch/share/embed/shorts URL (with any
 * tracking query params, e.g. `?si=...`, stripped). Returns null when the
 * input doesn't look like either, so a mistyped value never reaches an
 * <iframe src> and silently breaks playback. */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const ID_PATTERN = /^[A-Za-z0-9_-]{10,12}$/;
  if (ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const v = url.searchParams.get("v");
  if (v && ID_PATTERN.test(v)) return v;

  const pathMatch = url.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{10,12})/);
  if (pathMatch) return pathMatch[1];

  if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && ID_PATTERN.test(id)) return id;
  }

  return null;
}
