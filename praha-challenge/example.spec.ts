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

test('Hotel Planisphereで予約ができる', async ({ page }) => {
  await page.goto('https://hotel.testplanisphere.dev/ja/');
  const link = page.getByRole('link', { name: '宿泊予約' })
  expect(link).toBeVisible();
  await link.click();

  // TODO: HTMLタグをButtonに修正する
  const buttons = page.getByText('このプランで予約').nth(0);
  // ボタンにテストIDが存在しないため一位に特定できない。今回は最初のボタンをクリックする
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    buttons.click(),
  ]);
  await newPage.waitForLoadState();

  const input = newPage.getByLabel(/宿泊日/);
  await input.click();
  await input.fill('2025/10/20');
  await input.click();

  await newPage.getByLabel(/宿泊数/).fill('1');
  await newPage.getByLabel(/人数/).fill('1');
  await newPage.getByLabel(/お得な観光プラン/).check();
  await newPage.getByLabel(/氏名/).fill('山田太郎');
  await newPage.getByLabel(/確認のご連絡/).selectOption({ index: 1 });

  Promise.all([
    newPage.waitForURL(/confirm.html/),
    await newPage.getByRole('button', { name: '予約内容を確認する' }).click()
  ]);
  await newPage.getByRole('button', { name: 'この内容で予約する' }).click();

  await newPage.waitForSelector('.modal-dialog', { state: "visible", timeout: 10000 });
  await newPage.waitForTimeout(500);
  expect(newPage.getByText('予約を完了しました')).toBeVisible();
});