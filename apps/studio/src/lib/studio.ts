export function makeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function formatDate(timestamp?: number) {
  if (!timestamp) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

export function formatRelative(timestamp?: number) {
  if (!timestamp) {
    return "";
  }

  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return formatter.format(Math.round(seconds / size), unit);
    }
  }

  return "just now";
}

export function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 230));
}

export function getPublicAppUrl(explicitUrl?: string) {
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  const { origin, hostname, protocol } = window.location;

  if (hostname === "localhost") {
    return "http://localhost:3000";
  }

  if (hostname.startsWith("app.")) {
    return `${protocol}//${hostname.slice(4)}`;
  }

  if (hostname.includes("-studio.")) {
    return `${protocol}//${hostname.replace("-studio.", "-www.")}`;
  }

  if (hostname.startsWith("studio.")) {
    return `${protocol}//www.${hostname.slice("studio.".length)}`;
  }

  return origin.replace(/\/$/, "");
}

export function getPublicAppLabel(explicitUrl?: string) {
  return getPublicAppUrl(explicitUrl).replace(/^https?:\/\//, "");
}

export type EditorState = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  slugTouched: boolean;
};

export const emptyEditorState: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  slugTouched: false,
};
