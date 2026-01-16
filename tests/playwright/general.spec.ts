import { test, expect } from '@playwright/test';

import { config } from './config';

test('no console errors on page load', async ({ page }) => {
	test.skip(!config.general.consoleErrors.enableTest, 'Console errors check is disabled in config.');

	const consoleMessages: string[] = [];
	const pageErrors: string[] = [];

	const ignorePatterns = [
		/Failed to load resource.*ERR_CERT_COMMON_NAME_INVALID/,
	];

	const shouldIgnoreError = (message: string) => {
		return ignorePatterns.some(pattern => pattern.test(message));
	};

	page.on('console', msg => {
		if (msg.type() !== 'error' && msg.type() !== 'warning') {
			return;
		}

		const text = msg.text();
		if (!shouldIgnoreError(text)) {
			consoleMessages.push(`[${msg.type()}] ${text}`);
		}
	});

	page.on('pageerror', error => {
		const message = error.message;
		if (!shouldIgnoreError(message)) {
			pageErrors.push(message);
		}
	});

	await page.goto('/');

	await page.waitForTimeout(1000);

	expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);
	expect(consoleMessages, `Console errors found: ${consoleMessages.join(', ')}`).toHaveLength(0);
});

test('GTM is correctly installed', async ({ page }) => {
	test.skip(!config.general.gtm.enableTest, 'GTM check is disabled in config.');

	await page.goto('/');

	// Check if dataLayer exists
	const hasDataLayer = await page.evaluate(() => {
		return typeof (window as any).dataLayer !== 'undefined' && Array.isArray((window as any).dataLayer);
	});
	expect(hasDataLayer, 'dataLayer should exist and be an array').toBe(true);

	// Check if GTM script is loaded
	const hasGTMScript = await page.evaluate(() => {
		const scripts = Array.from(document.querySelectorAll('script'));
		return scripts.some(script => script.src.includes('googletagmanager.com/gtm.js'));
	});
	expect(hasGTMScript, 'GTM script should be loaded').toBe(true);

	// Check for GTM noscript iframe in HTML source
	const htmlContent = await page.content();
	const hasGTMNoScript = htmlContent.includes('googletagmanager.com/ns.html');
	expect(hasGTMNoScript, 'GTM noscript iframe should exist in HTML').toBe(true);
});

test('navigation dropdown shows on click', async ({ page }) => {
	test.skip(!config.general.navigationDropdowns.enableTest, 'Navigation dropdown check is disabled in config.');

	await page.goto('/');

	const dropdownToggle = page.locator('[data-bs-toggle="dropdown"]').first();
	const dropdownItem = dropdownToggle.locator('..').locator('.dropdown-item').first();

	await expect(dropdownToggle).toBeVisible();
  await expect(dropdownItem).not.toBeVisible();

	await dropdownToggle.click();

	await expect(dropdownItem).toBeVisible();
});

test('Google Maps is correctly loaded and displayed', async ({ page }) => {
	test.skip(!config.general.googleMaps.enableTest, 'Google Maps check is disabled in config.');

	const consoleErrors: string[] = [];

	const ignorePatterns = [
		/without loading=async/,
		/google\.maps\.Marker is deprecated/
	];

	const shouldIgnoreError = (message: string) => {
		return ignorePatterns.some(pattern => pattern.test(message));
	};

	// Listen for console errors related to Google Maps
	page.on('console', msg => {
		if (msg.type() === 'error' || msg.type() === 'warning') {
			const text = msg.text();
			if (text.toLowerCase().includes('google') || text.toLowerCase().includes('maps')) {
				if (!shouldIgnoreError(text)) {
					consoleErrors.push(`[${msg.type()}] ${text}`);
				}
			}
		}
	});

	await page.goto(config.general.googleMaps.path);

	// Wait for Google Maps to load
	await page.waitForTimeout(2000);

	// Check if Google Maps script is loaded
	const hasGoogleMapsScript = await page.evaluate(() => {
		const scripts = Array.from(document.querySelectorAll('script'));
		return scripts.some(script => script.src.includes('maps.googleapis.com') || script.src.includes('maps.google.com'));
	});
	expect(hasGoogleMapsScript, 'Google Maps script should be loaded').toBe(true);

	// Check for API key errors
	expect(consoleErrors, `Google Maps errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);

	// Check if google.maps object exists
	const hasGoogleMapsObject = await page.evaluate(() => {
		return typeof (window as any).google !== 'undefined' && typeof (window as any).google.maps !== 'undefined';
	});
	expect(hasGoogleMapsObject, 'google.maps object should exist').toBe(true);

	// Check if map element exists and is rendered
	const mapElement = page.locator('.gm-style, [id*="map"], [class*="map"]').first();
	await expect(mapElement).toBeVisible({ timeout: 5000 });
});

test('banner gets headroom class after scrolling', async ({ page }) => {
	test.skip(!config.general.headroom.enableTest, 'Headroom check is disabled in config.');

	await page.goto(config.general.headroom.path);

	const banner = page.locator('.banner');
	await expect(banner).toBeVisible();

	await expect(banner).not.toHaveClass(/banner--not-top/);

	await page.evaluate(() => window.scrollTo(0, 500));

	await page.waitForTimeout(300);

	await expect(banner).toHaveClass(/banner--not-top/);

	await page.evaluate(() => window.scrollTo(0, 0));

	await page.waitForTimeout(300);

	await expect(banner).not.toHaveClass(/banner--not-top/);
});
