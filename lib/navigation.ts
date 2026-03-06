export const DEFAULT_SIGNED_IN_ROUTE = "/progress";

export function sanitizeReturnTo(
  value: string | string[] | null | undefined,
  fallback = DEFAULT_SIGNED_IN_ROUTE
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}

export function buildSignInHref(returnTo: string): string {
  const searchParams = new URLSearchParams({
    returnTo: sanitizeReturnTo(returnTo),
  });

  return `/auth/sign-in?${searchParams.toString()}`;
}
