import { test, expect } from "@playwright/test";

test.describe("Reader navigation", () => {
  test("prev and next links appear at top and bottom", async ({ page }) => {
    await page.goto("/course/09-session-one");
    const navs = page.getByRole("navigation", { name: "Chapter navigation" });
    await expect(navs).toHaveCount(2);
    await expect(navs.first().getByRole("link", { name: /Next:/i })).toBeVisible();
    await expect(navs.nth(1).getByRole("link", { name: /Next:/i })).toBeVisible();
  });

  test("sidebar chapter link opens correct chapter", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await page
      .getByRole("complementary")
      .getByRole("link", { name: "Introduction", exact: true })
      .click();
    await expect(page).toHaveURL(/\/course\/07-introduction/);
    await expect(
      page.getByRole("heading", { name: /Introduction/i })
    ).toBeVisible();
  });

  test("footnote to references and return restores paragraph", async ({ page }) => {
    await page.goto("/course/09-session-one");
    const footnoteParagraph = page.getByText(/look at Jesus.*own words.*attitude to life/i);
    await footnoteParagraph.scrollIntoViewIfNeeded();
    await page.getByRole("link", { name: "[6]", exact: true }).first().click();
    await expect(page).toHaveURL(/\/course\/29-references#note-6/);
    await page.getByRole("link", { name: /Return to where you were reading/i }).click();
    await expect(page).toHaveURL(/\/course\/09-session-one/);
    await expect(footnoteParagraph).toBeInViewport();
  });
});
