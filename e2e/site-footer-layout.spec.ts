import { test, expect } from "@playwright/test";

const currentYear = new Date().getFullYear();

test.describe("Site footer layout", () => {
  test("copyright footer appears on landing page only", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText(`Copyright © James Odgers ${currentYear}`)).toBeVisible();

    await page.goto("/course/09-session-one");
    await expect(page.locator("footer")).toHaveCount(0);
  });

  test("course reader has no copyright in article or main chrome", async ({
    page,
  }) => {
    await page.goto("/course/09-session-one");
    await expect(
      page.getByRole("heading", { name: "What Is Simplicity?" })
    ).toBeVisible();

    const goals = page.getByRole("heading", { name: "Goals", exact: true });
    const reading = page.getByRole("heading", { name: "Reading", exact: true });

    await expect(goals).toBeVisible();
    await expect(reading).toBeVisible();

    await expect(page.locator("article")).not.toContainText(
      `Copyright © James Odgers ${currentYear}`
    );
    await expect(
      page.getByText(`Copyright © James Odgers ${currentYear}`)
    ).toHaveCount(0);
  });

  test("goals section viewport without footer overlap", async ({ page }) => {
    await page.goto("/course/09-session-one");
    const goals = page.getByRole("heading", { name: "Goals", exact: true });
    await goals.scrollIntoViewIfNeeded();
    await expect(goals).toBeVisible();

    const viewport = page.locator("main");
    await expect(viewport).toHaveScreenshot("session-one-goals-viewport.png", {
      maxDiffPixelRatio: 0.02,
    });
  });
});
