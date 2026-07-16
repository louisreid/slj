import { type Page, expect } from "@playwright/test";

/** Main content search input (excludes sidebar duplicate). */
export function mainSearchInput(page: Page) {
  return page.locator("main").getByRole("searchbox", {
    name: "Search all chapters",
  });
}

export async function expectCoursePage(page: Page, chapterId: string) {
  await expect(page).toHaveURL(new RegExp(`/course/${chapterId}`));
}

export async function openSearchFromSidebar(page: Page) {
  await page.getByRole("searchbox", { name: "Search all chapters" }).first().focus();
  await expect(page).toHaveURL(/\/search/);
}
