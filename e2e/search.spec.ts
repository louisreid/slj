import { test, expect } from "@playwright/test";
import { mainSearchInput } from "./fixtures";

test.describe("Search journeys", () => {
  test("search page autofocuses main input", async ({ page }) => {
    await page.goto("/search?q=Micah");
    await expect(mainSearchInput(page)).toBeFocused();
  });

  test("sidebar search opens full search page", async ({ page }) => {
    await page.goto("/course/09-session-one");
    await page.getByRole("searchbox", { name: "Search all chapters" }).first().focus();
    await expect(page).toHaveURL(/\/search/);
  });

  test("result click and back returns to highlighted result", async ({ page }) => {
    await page.goto("/search?q=Micah");
    const result = page.getByRole("link", { name: /Micah/i }).first();
    await expect(result).toBeVisible();
    const blockId = (await result.getAttribute("href"))?.split("#").pop() ?? "";
    await result.click();
    await expect(page).toHaveURL(/\/course\//);
    await page.getByRole("link", { name: /Back to search results/i }).click();
    await expect(page).toHaveURL(new RegExp(`[?&]r=${blockId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    await expect(page.locator(`#search-result-${blockId}`)).toBeVisible();
  });

  test("search results show chapter context", async ({ page }) => {
    await page.goto("/search?q=money");
    await expect(page.getByText(/Under /i).first()).toBeVisible();
  });
});
