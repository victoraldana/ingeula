/**
 * Extracts the 11-character YouTube video ID from standard, shortened,
 * embed, or shorts URLs. Returns null if the URL is not a valid YouTube video.
 */
export function extractYouTubeId(rawUrl: string): string | null {
  const input = rawUrl.trim();
  if (!input) return null;

  // Direct 11-char ID support
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const vParam = url.searchParams.get("v");
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      const parts = url.pathname.split("/").filter(Boolean);
      if (
        parts.length >= 2 &&
        (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live")
      ) {
        const candidate = parts[1];
        return /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`;
}

export function getYouTubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
