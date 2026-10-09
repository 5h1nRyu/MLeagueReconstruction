import { test, expect } from '@playwright/test';

for (const [deployment, port] of [['repository source', 4174], ['Vite build', 4175]]) {
  for (const width of [1440, 390]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      test(`${deployment} decorations follow wheel scrolling at ${width}px with ${reducedMotion}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion });
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`http://127.0.0.1:${port}/MLeagueReconstruction/`);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));

        const read = () => page.locator('.flower img').evaluateAll((images) => images.map((image) => {
          const matrix = new DOMMatrix(getComputedStyle(image).transform);
          return { translation: matrix.f, rotation: Math.atan2(matrix.b, matrix.a), y: scrollY };
        }));
        const followsScroll = async () => {
          await expect.poll(async () => (await read()).every(({ translation, y }) => Math.abs(translation - y / (width <= 767 ? 10 : 2)) < 1)).toBe(true);
        };

        await page.mouse.move(width / 2, 400);
        await page.mouse.wheel(0, 600);
        await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400);
        await followsScroll();
        const down = await read();
        expect(down.every(({ translation }) => translation > 0)).toBe(true);
        if (reducedMotion === 'reduce') {
          expect(down.every(({ rotation }) => Math.abs(rotation) < 0.001)).toBe(true);
        } else {
          expect(down[0].rotation).toBeGreaterThan(0.1);
          expect(down[1].rotation).toBeLessThan(-0.1);
        }

        await page.mouse.wheel(0, -300);
        await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(down[0].y - 100);
        await followsScroll();
        const up = await read();
        expect(up.every(({ translation }, index) => translation < down[index].translation)).toBe(true);
        await page.mouse.wheel(0, -1000);
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
        await followsScroll();
        expect((await read()).every(({ translation }) => Math.abs(translation) < 1)).toBe(true);
      });
    }
  }
}
