import { test, expect } from "@playwright/test";
import path from "path";

test("uploads a PDF document", async ({ page }) => {
  await page.goto("/documents");

  const filePath = path.resolve(__dirname, "../../../tests/fixtures/sample.pdf");
  const input = page.locator('input[type="file"]');
  await input.setInputFiles(filePath);

  await expect(page.getByText(/processing|uploading/i)).toBeVisible();
  await expect(page.getByText("sample.pdf")).toBeVisible({ timeout: 30000 });
});
