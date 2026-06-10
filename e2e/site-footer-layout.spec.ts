import { test, expect } from "@playwright/test";

test.describe("Site footer layout", () => {
  test("copyright footer sits below chapter content, not over Goals", async ({
    page,
  }) => {
    await page.goto("/course/09-session-one");
    await expect(
      page.getByRole("heading", { name: "What Is Simplicity?" })
    ).toBeVisible();

    const goals = page.getByRole("heading", { name: "Goals", exact: true });
    const reading = page.getByRole("heading", { name: "Reading", exact: true });
    const footer = page.locator("footer");

    await expect(goals).toBeVisible();
    await expect(reading).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Copyright © James Odgers 2004")).toBeVisible();

    // Copyright belongs in the site footer only, not inside the reader article.
    await expect(page.locator("article")).not.toContainText(
      "Copyright © James Odgers 2004"
    );

    const goalsBox = await goals.boundingBox();
    const readingBox = await reading.boundingBox();
    const footerBox = await footer.boundingBox();

    expect(goalsBox).not.toBeNull();
    expect(readingBox).not.toBeNull();
    expect(footerBox).not.toBeNull();

    // Footer must sit entirely below early chapter headings (regression: flex-1 mid-page footer).
    expect(footerBox!.y).toBeGreaterThan(goalsBox!.y + goalsBox!.height - 2);
    expect(footerBox!.y).toBeGreaterThan(readingBox!.y + readingBox!.height - 2);

    // Footer follows article in document order.
    const articleBottom = await page.locator("article").evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height;
    });
    const footerTop = await footer.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    });
    expect(footerTop).toBeGreaterThanOrEqual(articleBottom - 4);
  });

  test("goals section has no copyright text in viewport", async ({ page }) => {
    await page.goto("/course/09-session-one");
    const goals = page.getByRole("heading", { name: "Goals", exact: true });
    await goals.scrollIntoViewIfNeeded();
    await expect(goals).toBeVisible();

    const viewport = page.locator("main");
    const goalsBox = await goals.boundingBox();
    expect(goalsBox).not.toBeNull();

    // Copyright line must not intersect the Goals heading band (overlap regression).
    const copyrightBoxes = await page
      .getByText("Copyright © James Odgers 2004")
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom };
        })
      );

    for (const box of copyrightBoxes) {
      const overlapsGoals =
        box.bottom > goalsBox!.y && box.top < goalsBox!.y + goalsBox!.height;
      expect(overlapsGoals).toBe(false);
    }

    await expect(viewport).toHaveScreenshot("session-one-goals-viewport.png", {
      maxDiffPixelRatio: 0.02,
    });
  });
});
