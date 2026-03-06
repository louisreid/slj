"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const NAV_STORAGE_KEY = "slj-nav-collapsed";

const navItems = [
  { href: "/course", label: "Course", short: "C" },
  { href: "/course/all", label: "All chapters", short: "A" },
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
        ? "border-black bg-black/5 font-medium text-black"
        : "border-transparent text-black/65 hover:bg-black/5 hover:text-black"
    }`;

  const navContent = (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between border-b border-[#E5E7EB] p-4">
          {(!collapsed || drawerOpen) && (
            <Link
              href="/progress"
              className="space-y-1"
              onClick={closeDrawer}
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-black/45">
                A Discussion Course
              </p>
              <p className="font-serif text-xl font-semibold leading-tight text-black">
                Simplicity, Love & Justice
              </p>
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden h-8 w-8 items-center justify-center border border-[#E5E7EB] bg-white text-black focus:outline md:flex"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
          </button>
        </div>
        <nav className="flex-1 overflow-auto p-3">
          {(!collapsed || drawerOpen) && (
            <Link
              href="/course"
              onClick={closeDrawer}
              className={`mb-4 block border-l-2 px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                isActive("/course")
                  ? "border-black bg-black/5 text-black"
                  : "border-transparent text-black/45 hover:bg-black/5 hover:text-black"
              }`}
            >
              Resume
            </Link>
          )}
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
        <div className="shrink-0 border-t border-[#E5E7EB] p-3">
          {(!collapsed || drawerOpen) && userEmail && (
            <>
              <p className="mb-2 truncate font-sans text-xs text-black/45">
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
                className="w-full border-l-2 border-transparent px-3 py-2 text-left text-sm text-black/65 hover:bg-black/5 hover:text-black"
              >
                Sign out
              </button>
            </form>
          )}
          {collapsed && !drawerOpen && (
            <form action="/auth/sign-out" method="post" title="Sign out">
              <button
                type="submit"
                className="w-full px-1 py-2 text-sm text-black/65 hover:text-black"
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
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed left-4 top-4 z-20 h-10 w-10 border border-[#E5E7EB] bg-white text-black md:hidden"
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
        className={`fixed left-0 top-0 z-40 flex h-full min-h-screen w-[272px] flex-col border-r border-[#E5E7EB] bg-white transition-transform md:relative md:flex md:shrink-0 md:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-16" : "md:w-64"}`}
      >
        <div className="flex justify-end border-b border-[#E5E7EB] p-2 md:hidden">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-9 w-9 border border-[#E5E7EB] bg-white text-black"
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
