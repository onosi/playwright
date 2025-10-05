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

test('Hotel Planisphereの会員登録画面で会員登録できる', async ({ page }) => {
  await page.goto('https://hotel.testplanisphere.dev/ja/signup.html');

  await page.getByLabel('メールアドレス').fill('yamada@example.com');
  await page.getByLabel('パスワード 必須').fill('password123');
  await page.getByLabel('パスワード（確認） 必須').fill('password123');
  await page.getByRole('button', { name: '登録' }).click();
  await page.getByLabel('氏名').fill('山田太郎');
  await page.getByLabel('一般会員').check();
  await page.getByLabel('住所').fill('東京都新宿区');
  await page.getByLabel('電話番号').fill('01133335555');
  await page.getByLabel('性別').selectOption({ index: 1 });
  await page.getByLabel('生年月日').fill('1990-01-01');
  await page.getByRole('button', { name: '登録' }).click();

  await expect(page).toHaveURL(/mypage.html/);
  await expect(page.locator('body')).toContainText('yamada@example.com');
  await expect(page.locator('body')).toContainText('山田太郎');
  await expect(page.locator('body')).toContainText('一般会員');
  await expect(page.locator('body')).toContainText('東京都新宿区');
  await expect(page.locator('body')).toContainText('01133335555');
  await expect(page.locator('body')).toContainText('男性');
  await expect(page.locator('body')).toContainText('1990年1月1日');
});