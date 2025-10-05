import {test, expect } from "@playwright/test";

test('Hotel Planisphereのサイトにアクセスできる', async ({ page }) => {
  await page.goto('https://hotel.testplanisphere.dev/ja/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/HOTEL PLANISPHERE/);
});