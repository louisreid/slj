"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          {(!collapsed || drawerOpen) && (
            <Link
              href="/course"
              className="font-sans text-sm font-medium text-[#000] hover:underline"
            >
              Simplicity, Love & Justice
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="md:flex hidden p-1 rounded hover:bg-[rgba(0,0,0,0.04)] text-[#000] focus:outline focus:ring-2 focus:ring-[rgba(0,0,0,0.3)]"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
          </button>
        </div>
        <nav className="flex-1 p-2 overflow-auto">
          {(!collapsed || drawerOpen) && (
            <Link
              href="/course"
              className="block px-3 py-2 text-sm text-[rgba(0,0,0,0.65)] hover:text-[#000] hover:bg-[rgba(0,0,0,0.04)] rounded mb-1"
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
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${
                    isActive(href)
                      ? "bg-[rgba(0,0,0,0.06)] font-medium border-l-2 border-[#000] -ml-[2px] pl-[10px]"
                      : "text-[rgba(0,0,0,0.65)] hover:text-[#000] hover:bg-[rgba(0,0,0,0.04)] border-l-2 border-transparent"
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
        <div className="p-3 border-t border-[#E5E7EB] shrink-0">
          {(!collapsed || drawerOpen) && userEmail && (
            <p className="text-xs text-[rgba(0,0,0,0.45)] truncate mb-2">
              {userEmail}
            </p>
          )}
          {(!collapsed || drawerOpen) && (
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="text-sm text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
              >
                Sign out
              </button>
            </form>
          )}
          {collapsed && !drawerOpen && (
            <form action="/auth/sign-out" method="post" title="Sign out">
              <button
                type="submit"
                className="text-sm text-[rgba(0,0,0,0.65)] hover:text-[#000] p-1"
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
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded border border-[#E5E7EB] bg-[#fff] text-[#000]"
        aria-label="Open menu"
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-[rgba(0,0,0,0.3)]"
          onClick={closeDrawer}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:relative md:flex md:shrink-0 fixed top-0 left-0 z-40 h-full w-[240px] bg-[#fff] border-r border-[#E5E7EB] flex flex-col transition-transform md:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-14" : "md:w-52"}`}
      >
        <div className="md:hidden flex justify-end p-2 border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={closeDrawer}
            className="p-2 text-[#000]"
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
