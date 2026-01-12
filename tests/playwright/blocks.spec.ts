import { test, expect } from '@playwright/test';

import { config } from './config';

test.describe('hero-slider', () => {
	test.skip(!config.blocks.heroSlider.enableTest, 'Hero Slider block is disabled in config.');
	
	test.beforeEach(async ({ page }) => {
		await page.goto(config.blocks.heroSlider.path);
	});

	test('slider is visible and initialized', async ({ page }) => {
		// slider is initialized and visible
		const slider = page.locator('.wp-block-hero-slider .swiper');
		await expect(slider).toBeVisible();
		
		await expect(slider).toHaveClass(/swiper-initialized/);

		// pagination bullets exist and match slide count
		const slides = page.locator('.wp-block-hero-slider .swiper-slide');
		const bullets = page.locator('.swiper-pagination-bullet');
		
		const slideCount = await slides.count();
		const bulletCount = await bullets.count();
		
		expect(bulletCount).toBe(slideCount);

		// first slide is active on load
		const activeSlide = page.locator('.swiper-slide-active');
		await expect(activeSlide).toBeVisible();
		
		const activeBullet = page.locator('.swiper-pagination-bullet-active');
		await expect(activeBullet).toBeVisible();
		await expect(activeBullet).toHaveCount(1);
	});

	test('clicking pagination bullet changes active slide', async ({ page }) => {
		test.skip(!config.blocks.heroSlider.settings.pagination, 'Pagination is disabled in config.');

		const slider = page.locator('.wp-block-hero-slider .swiper');

		const bullets = slider.locator('.swiper-pagination-bullet');
		const bulletCount = await bullets.count();
		
		if (bulletCount > 1) {
			await bullets.nth(1).click();
			
			await page.waitForTimeout(500);
			
			const activeBullet = page.locator('.swiper-pagination-bullet-active');
			const activeBulletIndex = await bullets.evaluateAll((items, active) => {
				return items.findIndex(item => item === active);
			}, await activeBullet.elementHandle());
			
			expect(activeBulletIndex).toBe(1);
		}
	});
});
