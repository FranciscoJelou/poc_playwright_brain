import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto('https://apps-brain.jelou-apps.pages.dev/login');
    await page.locator("input[id='email']").fill('francisco@jelou.ai');
    await page.locator("input[id='password']").fill('P@ssw0rd2023');
    await page.locator("button[type='submit']").click();
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('https://apps-brain.jelou-apps.pages.dev/home');
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    await expect(page.getByRole('heading', { name: 'Jelou Francisco!' })).toBeVisible();
    await expect(page.getByText('Bienvenid@ de vuelta')).toBeVisible();
    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});