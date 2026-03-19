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

export type NoticeState = {
  error: string | null;
  success: string | null;
};

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
