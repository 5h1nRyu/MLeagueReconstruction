import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the complete homepage with working local assets and no runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await expect(page.locator('.team-table-row')).toHaveCount(10);
  await expect(page.locator('.metric-card')).toHaveCount(4);
  await expect(page.locator('.schedule-list > li:visible')).toHaveCount(8);
  await expect(page.locator('.news-grid > li:visible')).toHaveCount(3);
  await expect(page.locator('.partner-grid li')).toHaveCount(15);
  await expect(page.locator('.owner-grid li')).toHaveCount(10);
  await page.locator('.footer').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('img:visible').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
});

test('carousel wraps and supports dots, keyboard arrows, and pointer swipes', async ({ page }) => {
  const first = page.locator('[data-slide="0"]');
  const second = page.locator('[data-slide="1"]');
  await page.locator('.carousel-arrow.previous').click();
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.carousel-arrow.next').click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await second.click();
  await page.keyboard.press('ArrowRight');
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  const box = await page.locator('.carousel-window').boundingBox();
  await page.mouse.move(box.x + box.width - 30, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 30, box.y + 80, { steps: 5 });
  await page.mouse.up();
  await expect(second).toHaveAttribute('aria-pressed', 'true');
});

test('desktop ranking buttons expand only their paired tables', async ({ page }) => {
  const rows = (id) => page.locator(`[data-metric="${id}"] tbody tr:visible`);
  await page.locator('[data-pair-toggle="0"]').click();
  await expect(rows(0)).toHaveCount(40);
  await expect(rows(1)).toHaveCount(40);
  await expect(rows(2)).toHaveCount(7);
  await page.locator('[data-pair-toggle="0"]').click();
  await expect(rows(0)).toHaveCount(7);
  await expect(page.locator('[data-pair-toggle="0"]')).toHaveAttribute('aria-expanded', 'false');
});

test('mobile ranking buttons expand each table independently', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-metric-toggle="0"]').click();
  await expect(page.locator('[data-metric="0"] tbody tr:visible')).toHaveCount(40);
  await expect(page.locator('[data-metric="1"] tbody tr:visible')).toHaveCount(7);
  await page.locator('[data-metric-toggle="0"]').click();
  await expect(page.locator('[data-metric="0"] tbody tr:visible')).toHaveCount(7);
});

test('mobile navigation closes with Escape, links, and a desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.locator('.menu-toggle');
  await menu.click();
  await expect(page.locator('.navigation')).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.locator('.navigation')).toBeHidden();
  await menu.click();
  await page.locator('.nav-item > a[href="#about"]').click();
  await expect(page.locator('.navigation')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await menu.click();
  await page.setViewportSize({ width: 768, height: 1000 });
  await expect(menu).toBeHidden();
  await expect(page.locator('.navigation')).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
});

test('result dialogs display both rounds, restore focus, and close on the backdrop', async ({ page }) => {
  const trigger = page.locator('[data-match="0"]');
  const dialog = page.locator('#results-dialog');
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator('.result-list li')).toHaveCount(8);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  expect(await page.locator('.result-panel').evaluate((panel) => panel.scrollHeight > panel.clientHeight)).toBe(true);
  await page.mouse.click(15, 25);
  await expect(dialog).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await page.locator('[data-match="7"]').click();
  await expect(page.locator('.result-column h3').first()).toContainText('待开始');
  await expect(page.locator('.result-name').first()).not.toContainText('pt');
});

test('schedule and news expand in place and news opens without navigation', async ({ page }) => {
  await page.locator('#schedule-more').click();
  await expect(page.locator('.schedule-list > li:visible')).toHaveCount(12);
  await page.locator('#schedule-more').click();
  await expect(page.locator('.schedule-list > li:visible')).toHaveCount(8);
  await page.locator('#news-more').click();
  await expect(page.locator('.news-grid > li:visible')).toHaveCount(6);
  await page.locator('[data-news="0"]').click();
  await expect(page.locator('#info-dialog')).toBeVisible();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
});

test('responsive breakpoints have no horizontal overflow and use the correct frame', async ({ page }) => {
  for (const width of [320, 375, 390, 767, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const actual = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      frame: getComputedStyle(document.body, '::before').borderLeftWidth,
      menuVisible: getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none',
    }));
    expect(actual.width, `overflow at ${width}px`).toBeLessThanOrEqual(width);
    expect(actual.frame).toBe(width <= 767 ? '9px' : '20px');
    expect(actual.menuVisible).toBe(width <= 767);
  }
});

test('motion preference changes preserve decoration positions while suppressing spinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
  const translations = () => page.locator('.flower img').evaluateAll((images) => images.map((image) => {
    const matrix = new DOMMatrix(getComputedStyle(image).transform);
    return { y: matrix.f, spin: matrix.b };
  }));
  await expect.poll(async () => (await translations()).every(({ y, spin }) => Math.abs(y - 250) < 1 && Math.abs(spin) < 0.001)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(async () => (await translations()).every(({ y, spin }) => Math.abs(y - 250) < 1 && Math.abs(spin) > 0.5)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(async () => (await translations()).every(({ y, spin }) => Math.abs(y - 250) < 1 && Math.abs(spin) < 0.001)).toBe(true);
});

test('membership form validates locally without submitting credentials', async ({ page }) => {
  const writes = [];
  page.on('request', (request) => { if (request.method() === 'POST') writes.push(request.url()); });
  await page.locator('.member-button').click();
  await page.getByLabel('邮箱', { exact: true }).fill('member@example.com');
  await page.getByLabel('密码', { exact: true }).fill('sample-password');
  await page.locator('#login-form button').click();
  await expect(page.locator('#login-feedback')).toContainText('会员服务暂未开放');
  expect(writes).toEqual([]);
});
