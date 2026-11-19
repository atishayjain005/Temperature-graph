const { test, expect } = require('@playwright/test');
test('real API returns disclosed generated values and the chart renders', async ({ page, request }) => {
  const response = await request.get('/api');
  expect(response.ok()).toBeTruthy();
  const sample = await response.json();
  expect(sample.source).toBe('generated-sample');
  expect(sample.data).toHaveLength(10);
  await page.goto('/');
  await expect(page.getByText(/Generated sample data, not observed weather/)).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
});
for (const [name, response] of [
  ['server error', {status:503,body:'unavailable'}],
  ['malformed JSON', {status:200,body:'not JSON'}],
  ['invalid shape', {status:200,json:{data:[null]}}],
]) {
  test(`${name} shows recovery and retry works`, async ({ page }) => {
    await page.route('**/api/', route => route.fulfill(response));
    await page.goto('/');
    await expect(page.getByRole('main').getByRole('alert')).toContainText('could not be loaded');
    await page.unroute('**/api/');
    await page.getByRole('button', {name:'Try again'}).click();
    await expect(page.locator('canvas')).toBeVisible();
  });
}
test('empty samples have a retryable empty state', async ({ page }) => {
  await page.route('**/api/', route => route.fulfill({json:{data:[]}}));
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('No temperature samples available.');
  await expect(page.getByRole('button', {name:'Try again'})).toBeVisible();
});
test('slow requests time out rather than spin forever', async ({ page }) => {
  await page.clock.install();
  await page.route('**/api/', () => {});
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Loading');
  await page.clock.fastForward(11000);
  await expect(page.getByRole('main').getByRole('alert')).toContainText('timed out');
});
test('chart values are available in a semantic table without canvas interaction', async ({ page }) => {
  await page.route('**/api/', route => route.fulfill({json:{data:[{date:Date.UTC(2024,1,29),temperature:-5},{date:Date.UTC(2024,2,1),temperature:0}]}}));
  await page.goto('/');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('img', {name:/Generated sample temperatures/})).toBeVisible();
  await expect(page.getByRole('table')).toContainText('29 Feb 2024');
  await expect(page.getByRole('table')).toContainText('-5 °C');
  await expect(page.getByRole('table')).toContainText('0 °C');
  await expect(page.getByRole('columnheader')).toHaveCount(2);
  await expect(page.getByRole('rowheader')).toHaveCount(2);
});
test('retry is keyboard operable', async ({ page }) => {
  await page.route('**/api/', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('button', {name:'Try again'})).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', {name:'Try again'})).toBeFocused();
  await page.unroute('**/api/');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('table')).toBeVisible();
});
