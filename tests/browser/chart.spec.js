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
