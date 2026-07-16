import { test, expect } from "@playwright/test";

test.describe("James sign-off 15 Jul 2026", () => {
  test("reviews uses on an issue not in an issue", async ({ page }) => {
    await page.goto("/course/05-reviews");
    await expect(page.locator("article")).toContainText(
      "spoke very powerfully to me on an issue"
    );
    await expect(page.locator("article")).not.toContainText(
      "spoke very powerfully to me in an issue"
    );
  });

  test("session three Cat in the Cradle poem is centered", async ({ page }) => {
    await page.goto("/course/13-session-three");
    const poem = page.locator(".text-center").filter({
      hasText: /My child arrived just the other day/i,
    });
    await expect(poem).toBeVisible();
  });

  test("worksheet 1A refers to example below", async ({ page }) => {
    await page.goto("/worksheets/print/budgeting-money-audit");
    await expect(page.getByText(/After reading the example below/i)).toBeVisible();
    await expect(page.getByText(/After the example above/i)).toHaveCount(0);
  });

  test("session nine saving paragraph has no errant quote", async ({ page }) => {
    await page.goto("/course/25-session-nine");
    await expect(page.locator("article")).toContainText(
      "surplus given away. In the story of the rich young ruler"
    );
    await expect(page.locator("article")).not.toContainText(
      "surplus given away.' In the story"
    );
  });

  test("references note 2 cited-in link reaches introduction passage", async ({
    page,
  }) => {
    await page.goto("/course/29-references#note-2");
    await expect(page.locator("#note-2")).toBeVisible();
    const citedIn = page
      .locator("#note-2")
      .locator("xpath=following-sibling::*[contains(., 'Cited in')][1]")
      .getByRole("link", { name: "Introduction" });
    await expect(citedIn).toBeVisible();
    const href = await citedIn.getAttribute("href");
    const blockId = href?.split("#").pop() ?? "";
    expect(blockId.length).toBeGreaterThan(0);
    await citedIn.click();
    await expect(page).toHaveURL(new RegExp(`/course/07-introduction#${blockId}`));
    const target = page.locator(`[id="${blockId}"]`);
    await expect(target).toBeVisible();
    await expect(target).toBeInViewport();
    await expect(target).toContainText("evangelism");
  });
});
