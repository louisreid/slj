"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Settings } from "lucide-react";

const NAV_STORAGE_KEY = "slj-nav-collapsed";

const navItems = [
  { href: "/course", label: "Course", short: "C" },
  { href: "/worksheets", label: "Worksheets", short: "W" },
  { href: "/groups", label: "Groups", short: "G" },
  { href: "/progress", label: "Progress", short: "P" },
] as const;

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

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const navContent = (
    <>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
          {(!collapsed || drawerOpen) && (
            <Link
              href="/course"
              className="font-sans text-sm font-semibold text-white tracking-[0.02em] hover:text-white/80 transition-colors"
            >
              Simplicity, Love & Justice
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="md:flex hidden h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white focus:outline focus:ring-2 focus:ring-white/30"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
          </button>
        </div>
        <nav className="flex-1 p-3 overflow-auto">
          {(!collapsed || drawerOpen) && (
            <Link
              href="/course"
              className="mb-3 block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white/75 hover:text-white hover:bg-white/10 transition-colors"
            >
              Resume
            </Link>
          )}
          <ul className="space-y-0.5">
            {navItems.map(({ href, label, short }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeDrawer}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border transition-colors ${
                    isActive(href)
                      ? "bg-white text-black border-white font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/10 border-transparent"
                  }`}
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
        <div className="p-3 border-t border-white/10 shrink-0">
          {(!collapsed || drawerOpen) && userEmail && (
            <>
              <p className="text-xs text-white/50 truncate mb-1">
                {userEmail}
              </p>
              <Link
                href="/preferences"
                onClick={closeDrawer}
                className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white underline underline-offset-2"
                aria-label="Settings"
              >
                <Settings size={14} strokeWidth={2} />
                Settings
              </Link>
            </>
          )}
          {(!collapsed || drawerOpen) && (
            <form action="/auth/sign-out" method="post" className="mt-2">
              <button
                type="submit"
                className="text-sm text-white/70 hover:text-white underline underline-offset-2"
              >
                Sign out
              </button>
            </form>
          )}
          {collapsed && !drawerOpen && (
            <form action="/auth/sign-out" method="post" title="Sign out">
              <button
                type="submit"
                className="text-sm text-white/70 hover:text-white p-1"
                aria-label="Sign out"
              >
                ⎋
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: hamburger */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 h-10 w-10 rounded-xl border border-white/15 bg-[#121212] text-white"
        aria-label="Open menu"
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={closeDrawer}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:relative md:flex md:shrink-0 fixed top-0 left-0 z-40 min-h-screen h-full w-[252px] bg-[#111111] border-r border-white/10 flex flex-col transition-transform md:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-16" : "md:w-64"}`}
      >
        <div className="md:hidden flex justify-end p-2 border-b border-white/10">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-9 w-9 rounded-lg border border-white/15 bg-white/5 text-white"
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
