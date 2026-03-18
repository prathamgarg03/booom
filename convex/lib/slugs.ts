const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function assertValidSlug(value: string, label: string) {
  if (!slugPattern.test(value)) {
    throw new Error(
      `${label} must use lowercase letters, numbers, and single hyphens only`,
    );
  }
}
