/**
 * Đọc payload JWT (Edge middleware không dùng jsonwebtoken verify).
 * Token từ backend: { id, role, iat, exp }
 */
export function getUserFromToken(token) {
  if (!token) return null;
  let raw = token;
  try {
    raw = decodeURIComponent(token);
  } catch {
    raw = token;
  }
  try {
    const parts = raw.split(".");
    if (parts.length !== 3) return null;
    const segment = parts[1];
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    const claims = JSON.parse(json);
    if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}
