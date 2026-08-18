import { expect, test } from '@playwright/test';

test('login, create a public post, and view it', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email or Username').fill('elena_vance');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

  await page.getByRole('link', { name: /write story/i }).click();
  await expect(page).toHaveURL(/\/create/);

  await page.getByPlaceholder('Title of your piece...').fill('Playwright test story');
  await page.locator('.ProseMirror').click();
  await page.keyboard.type('This is a test story written by Playwright during end-to-end verification.');

  await page.getByRole('button', { name: /publish/i }).click();

  await expect(page).toHaveURL(/\/writing\//);
  await expect(page.getByRole('heading', { name: 'Playwright test story' })).toBeVisible();
});
