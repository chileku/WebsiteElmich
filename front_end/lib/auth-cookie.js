/** Cookie `token` dùng chung cho login + middleware — phải cùng path / SameSite */

const TOKEN_MAX_AGE_SEC = 60 * 60 * 24;

export function setAuthCookie(token) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(token);
  document.cookie = `token=${value}; path=/; max-age=${TOKEN_MAX_AGE_SEC}; SameSite=Lax`;
}

/** Xóa cookie phía client (dự phòng sau khi gọi API logout) */
export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `token=; path=/; expires=${past}; max-age=0; SameSite=Lax`;
}

/** Đăng xuất: gọi API xóa cookie (middleware đọc cookie), xóa localStorage. */
export async function logoutClient(router, opts = {}) {
  const { redirectTo = null } = opts;
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    /* vẫn xóa phía client */
  }
  try {
    localStorage.removeItem("token");
  } catch {}
  clearAuthCookie();
  if (redirectTo) {
    router.push(redirectTo);
  }
  router.refresh();
}
