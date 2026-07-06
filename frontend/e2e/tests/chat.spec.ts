import { test, expect } from "@playwright/test";

test("asks a question and shows sources", async ({ page }) => {
  await page.goto("/ask");

  const input = page.getByRole("textbox");
  await input.fill("What is TCP slow start?");
  await input.press("Enter");

  await expect(page.getByText(/TCP/i)).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(/sources?/i)).toBeVisible();
});
