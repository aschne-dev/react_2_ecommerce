const ASSETS_BASE =
  (import.meta?.env?.VITE_ASSETS_BASE_URL || "").replace(/\/$/, "");

export function buildAssetUrl(path = "") {
  if (!path) return "";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!ASSETS_BASE) {
    return normalizedPath;
  }

  return `${ASSETS_BASE}${normalizedPath}`;
}
