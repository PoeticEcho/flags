export function assetUrl(path = "") {
  const value = String(path);
  if (!value || /^(?:[a-z]+:|\/\/|data:|blob:)/i.test(value)) return value;
  const base = import.meta.env?.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${value.replace(/^\/+/, "")}`;
}
