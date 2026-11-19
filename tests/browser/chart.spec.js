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
