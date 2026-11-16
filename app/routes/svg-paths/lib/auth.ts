/** Client helpers for GitHub sign-in (previously `next-auth/react`). */

export function signIn(provider: "github") {
  const callbackUrl = encodeURIComponent(window.location.href);
  window.location.href = `/api/auth/signin/${provider}?callbackUrl=${callbackUrl}`;
}

export async function signOut() {
  await fetch("/api/auth/signout", { method: "POST" });
  window.location.reload();
}
