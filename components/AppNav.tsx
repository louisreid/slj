"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const NAV_STORAGE_KEY = "slj-nav-collapsed";

// Groups hidden for now; re-add { href: "/groups", label: "Groups", short: "G" } to bring back
const navItems = [
  { href: "/course", label: "Course", short: "C" },
  { href: "/worksheets", label: "Worksheets", short: "W" },
] as const;

const LOGOUT_CONFIRM_MESSAGE = "You sure you want to log out?";

function handleSignOutClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  if (confirm(LOGOUT_CONFIRM_MESSAGE)) {
    (e.target as HTMLButtonElement).form?.submit();
  }
}

export function AppNav({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem(NAV_STORAGE_KEY);
    setCollapsed(stored === "true");
  }, [mounted]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(NAV_STORAGE_KEY, String(next));
      }
      return next;
    });
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isActive = (href: string) => {
    if (!pathname) return false;

    if (href === "/course") {
      return pathname === "/course" || /^\/course\/[^/]+$/.test(pathname);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-2 border-l-2 px-3 py-2 text-sm transition-colors ${
      active
        ? "border-[var(--slj-text)] bg-[var(--slj-hover)] font-medium"
        : "border-transparent text-[var(--slj-text-muted)] hover:bg-[var(--slj-hover)] hover:text-[var(--slj-text)]"
    }`;

  const navContent = (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between border-b border-[var(--slj-border)] p-4">
          {(!collapsed || drawerOpen) && (
            <Link href="/" className="space-y-1" onClick={closeDrawer}>
              <p className="slj-faint font-sans text-[11px] uppercase tracking-[0.16em]">
                A Discussion Course
              </p>
              <p className="font-serif text-xl font-semibold leading-tight text-[var(--slj-text)]">
                Simplicity, Love & Justice
              </p>
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden h-8 w-8 items-center justify-center border border-[var(--slj-border)] bg-[var(--slj-surface)] text-[var(--slj-text)] focus:outline md:flex"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
          </button>
        </div>
          <nav className="flex-1 overflow-auto p-3">
          <ul className="space-y-1">
            {navItems.map(({ href, label, short }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeDrawer}
                  title={collapsed ? label : undefined}
                  className={navItemClass(isActive(href))}
                >
                  {collapsed && !drawerOpen ? (
                    <span className="w-5 text-center">{short}</span>
                  ) : (
                    label
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="shrink-0 border-t border-[var(--slj-border)] p-3">
          {(!collapsed || drawerOpen) && userEmail && (
            <>
              <p className="slj-faint mb-2 truncate font-sans text-xs">
                {userEmail}
              </p>
              <Link
                href="/preferences"
                onClick={closeDrawer}
                className={navItemClass(isActive("/preferences"))}
                aria-label="Account"
              >
                Account
              </Link>
            </>
          )}
          {(!collapsed || drawerOpen) && (
            <form action="/auth/sign-out" method="post" className="mt-2">
              <button
                type="submit"
                onClick={handleSignOutClick}
                className="w-full border-l-2 border-transparent px-3 py-2 text-left text-sm text-[var(--slj-text-muted)] hover:bg-[var(--slj-hover)] hover:text-[var(--slj-text)]"
              >
                Sign out
              </button>
            </form>
          )}
          {collapsed && !drawerOpen && (
            <>
              {userEmail && (
                <Link
                  href="/preferences"
                  onClick={closeDrawer}
                  title="Account"
                  className={navItemClass(isActive("/preferences"))}
                  aria-label="Account"
                >
                  <span className="w-5 text-center">A</span>
                </Link>
              )}
              <form action="/auth/sign-out" method="post" title="Sign out" className="mt-1">
                <button
                  type="submit"
                  onClick={handleSignOutClick}
                  className="w-full px-1 py-2 text-sm text-[var(--slj-text-muted)] hover:text-[var(--slj-text)]"
                  aria-label="Sign out"
                >
                  ⎋
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed left-4 top-4 z-20 h-10 w-10 border border-[var(--slj-border)] bg-[var(--slj-surface)] text-[var(--slj-text)] md:hidden"
        aria-label="Open menu"
      >
        <span className="text-lg">☰</span>
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/15 md:hidden"
          onClick={closeDrawer}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[272px] flex-col border-r border-[var(--slj-border)] bg-[var(--slj-surface)] transition-transform md:relative md:flex md:h-screen md:shrink-0 md:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-16" : "md:w-64"}`}
      >
        <div className="flex justify-end border-b border-[var(--slj-border)] p-2 md:hidden">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-9 w-9 border border-[var(--slj-border)] bg-[var(--slj-surface)] text-[var(--slj-text)]"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
