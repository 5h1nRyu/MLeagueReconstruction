import { test, expect } from '@playwright/test';

for (const [deployment, port] of [['repository source', 4174], ['Vite build', 4175]]) {
  for (const width of [1440, 390]) {
    test(`${deployment} loads all images under the Pages subdirectory at ${width}px`, async ({ page, request }) => {
      const origin = `http://127.0.0.1:${port}`;
      const prefix = '/MLeagueReconstruction/';
      const errors = [];
      const failed = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('response', (response) => { if (response.status() >= 400) failed.push(response.url()); });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(origin + prefix);
      await expect(page.locator('.news-grid > li:visible')).toHaveCount(3);
      await expect(page.locator('.partner-grid li')).toHaveCount(15);
      await page.locator('#news-more').click();
      await expect(page.locator('.news-grid > li:visible')).toHaveCount(6);
      await page.locator('img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager'; }));
      await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);

      // Validate CSS backgrounds, pseudo-element arrows, and the favicon too.
      const resources = await page.evaluate(() => {
        const backgrounds = [
          getComputedStyle(document.querySelector('.opponents')).backgroundImage,
          getComputedStyle(document.querySelector('.button.more'), '::after').backgroundImage,
        ].map((value) => /^url\(["']?(.*?)["']?\)$/.exec(value)?.[1]);
        return [...document.images].map((image) => image.src).concat(backgrounds, document.querySelector('link[rel="icon"]').href);
      });
      for (const resource of new Set(resources)) {
        expect(resource).toBeTruthy();
        if (resource.startsWith('data:')) continue;
        expect(new URL(resource).pathname).toMatch(/^\/MLeagueReconstruction\//);
        const response = await request.get(resource);
        expect(response.status(), resource).toBe(200);
        expect(response.headers()['content-type']).toMatch(/^image\//);
      }
      await page.locator('[data-news="0"]').click();
      await expect(page.locator('#info-dialog img')).toBeVisible();
      await expect.poll(() => page.locator('#info-dialog img').evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
      expect(errors).toEqual([]);
      expect(failed).toEqual([]);
      // A permissive preview server would mask absolute-path regressions.
      expect((await request.get(origin + '/assets/decor/img-flower.svg')).status()).toBe(404);
    });
  }
}
