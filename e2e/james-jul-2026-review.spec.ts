import { test, expect } from "@playwright/test";

const currentYear = new Date().getFullYear();

test.describe("James Jul 2026 review (visual + behaviour)", () => {
  test("A1 landing shows title, subtitle, and author only", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Simplicity Love & Justice", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("A Discussion Course")).toBeVisible();
    await expect(page.getByText("James Odgers", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page).toHaveScreenshot("landing-unauthenticated.png", {
      maxDiffPixelRatio: 0.02,
    });
  });

  test("A3 footer on landing only, not on course reader", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(`Copyright © James Odgers ${currentYear}`);

    await page.goto("/course/09-session-one");
    await expect(page.locator("footer")).toHaveCount(0);
    await expect(
      page.getByText(`Copyright © James Odgers ${currentYear}`)
    ).toHaveCount(0);
  });

  test("A4 footer includes NIV and Alpha publisher lines", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText(`Copyright © James Odgers ${currentYear}. All rights reserved.`);
    await expect(footer).toContainText("New International Version");
    await expect(footer).toContainText("Alpha International");
    await expect(footer).toContainText("Subsequently published privately by the author");
    await expect(footer).not.toContainText("ISBN");
  });

  test("A6 session one shows Session One label", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await expect(page.getByText("Session One", { exact: true }).first()).toBeVisible();
  });

  test("A7 foreword h1 aligns with body column", async ({ page }) => {
    await page.goto("/course/06-foreword-summer-2004");
    const h1 = page.locator("article h1").first();
    const column = page.locator(".slj-reader-column").first();
    await expect(h1).toBeVisible();
    await expect(column).toBeVisible();

    const h1Box = await h1.boundingBox();
    const columnBox = await column.boundingBox();
    expect(h1Box).not.toBeNull();
    expect(columnBox).not.toBeNull();
    expect(Math.abs(h1Box!.x - columnBox!.x)).toBeLessThan(12);

    await expect(page.locator("article")).toHaveScreenshot("foreword-heading-alignment.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("A8–A10 introduction copy and structure", async ({ page }) => {
    await page.goto("/course/07-introduction");
    await expect(page.getByText(/We would love to hear from you/i)).toHaveCount(0);
    await expect(page.getByText(/Please write to us/i)).toHaveCount(0);
  });

  test("A11 worksheet Open links load without application error", async ({
    page,
  }) => {
    await page.goto("/course/09-session-one");
    const openLinks = page
      .getByRole("region")
      .filter({ hasText: /worksheet/i })
      .getByRole("link", { name: "Open" });
    const count = await openLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = openLinks.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\/worksheets\/print\//);
      const response = await page.request.get(href!);
      expect(response.ok()).toBe(true);
      await page.goto(href!);
      await expect(page.getByText("Application error")).toHaveCount(0);
      await expect(page.getByText("Worksheet could not load")).toHaveCount(0);
    }
  });

  test("A12 footnote navigation shows return-to-reading control", async ({
    page,
  }) => {
    await page.goto("/course/09-session-one");
    const footnote = page.getByRole("link", { name: "[6]", exact: true }).first();
    const footnoteParagraph = page.getByText(/look at Jesus.*own words.*attitude to life/i);
    await footnoteParagraph.scrollIntoViewIfNeeded();
    await footnote.click();
    await expect(page).toHaveURL(/\/course\/29-references#note-6/);

    await expect(
      page.getByRole("link", { name: /Return to where you were reading/i })
    ).toBeVisible();

    await page.getByRole("link", { name: /Return to where you were reading/i }).click();
    await expect(page).toHaveURL(/\/course\/09-session-one/);
    await expect(footnoteParagraph).toBeInViewport();
  });

  test("B5 session one has no televisio typo", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await expect(page.getByText(/\btelevisio\b/)).toHaveCount(0);
    await expect(page.getByText("television")).toBeVisible();
  });

  test("B9 sidebar search at top without Open full search link", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await expect(page.getByRole("link", { name: "Contents" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Chapters/i })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search all chapters" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open full search" })).toHaveCount(0);
  });

  test("B-EXTRA search page autofocuses and back link from result", async ({
    page,
  }) => {
    await page.goto("/search?q=Micah");
    const searchInput = page.locator("main").getByRole("searchbox", {
      name: "Search all chapters",
    });
    await expect(searchInput).toBeFocused();
    const result = page.getByRole("link", { name: /Micah/i }).first();
    await expect(result).toBeVisible();
    const resultHref = await result.getAttribute("href");
    const blockId = resultHref?.split("#").pop() ?? "";
    await result.click();
    await expect(page).toHaveURL(/\/course\//);
    const backLink = page.getByRole("link", { name: /Back to search results/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(new RegExp(`[?&]r=${blockId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    await expect(page.locator(`#search-result-${blockId}`)).toBeVisible();
  });

  test("C references note 2 is Making Christ Known", async ({ page }) => {
    await page.goto("/course/29-references#note-2");
    await expect(page.locator("#note-2")).toBeVisible();
    await expect(page.locator("article")).toContainText("Making Christ Known");
  });

  test("session one reader layout snapshot", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await expect(
      page.getByRole("heading", { name: "What Is Simplicity?" })
    ).toBeVisible();
    await expect(page.locator("main")).toHaveScreenshot("session-one-reader.png", {
      maxDiffPixelRatio: 0.02,
    });
  });
});
