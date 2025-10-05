import {test, expect } from "@playwright/test";

test('Hotel Planisphereのサイトにアクセスできる', async ({ page }) => {
  await page.goto('https://hotel.testplanisphere.dev/ja/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/HOTEL PLANISPHERE/);
});

test('Hotel Planisphereの会員登録画面にアクセスできる', async ({ page }) => {
  await page.goto('https://hotel.testplanisphere.dev/ja/');
  const link = page.getByRole('link', { name: '会員登録' })
  expect(link).toBeVisible();
  await link.click();
  await page.waitForURL('**/signup.html');

  await expect(page).toHaveURL(/signup.html/);
});