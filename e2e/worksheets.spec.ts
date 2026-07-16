import { test, expect } from "@playwright/test";

test.describe("Worksheets", () => {
  test("worksheets index lists resources", async ({ page }) => {
    await page.goto("/worksheets");
    await expect(page.getByText("Worksheets").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Open/i }).first()).toBeVisible();
  });

  test("print route loads without application error", async ({ page }) => {
    await page.goto("/worksheets/print/budgeting-money-audit");
    await expect(page.getByText("Application error")).toHaveCount(0);
    await expect(page.getByText("Worksheet could not load")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /Looking after your personal money/i })
    ).toBeVisible();
  });

  test("session worksheet open link loads print page", async ({ page }) => {
    await page.goto("/course/09-session-one");
    const openLink = page
      .getByRole("region")
      .filter({ hasText: /worksheet/i })
      .getByRole("link", { name: "Open" })
      .first();
    const href = await openLink.getAttribute("href");
    expect(href).toMatch(/^\/worksheets\/print\//);
    await openLink.click();
    await expect(page).toHaveURL(/\/worksheets\/print\//);
    await expect(page.getByText("Application error")).toHaveCount(0);
  });
});
