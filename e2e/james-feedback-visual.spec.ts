import { test, expect } from "@playwright/test";

test.describe("James feedback (layout + content)", () => {
  test("notes aside is under one third of viewport on session chapter", async ({ page }) => {
    await page.goto("/course/09-session-one");
    const aside = page.locator('aside[aria-label="Notes"]').first();
    await expect(aside).toBeVisible();
    const box = await aside.boundingBox();
    expect(box?.width ?? 0).toBeLessThan(1280 / 3);
  });

  test("introduction shows a single top-level title", async ({ page }) => {
    await page.goto("/course/07-introduction");
    await expect(page.locator("article h1")).toHaveCount(1);
  });

  test("full book shows one h1 for session one chapter", async ({ page }) => {
    await page.goto("/course/all");
    const section = page.locator('[id="09-session-one"]');
    await expect(section).toBeVisible();
    await expect(section.locator("h1")).toHaveCount(1);
  });

  test("session one links to Things to Change worksheet", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await expect(
      page.getByRole("link", { name: /things to change worksheet/i })
    ).toBeVisible();
  });

  test("things to change print view renders", async ({ page }) => {
    await page.goto("/worksheets/print/things-to-change");
    await expect(
      page.getByRole("heading", { name: "Things to Change" }).first()
    ).toBeVisible();
  });
});
