import { test, expect } from './fixtures/woocommerce';
import { config } from './config';

test.skip(!config.woocommerce.enableTest, 'WooCommerce tests are disabled in config.');

test.describe('cart', () => {
	test('cart is empty', async ({ page, emptyCart }) => {
		await page.goto('/');
		
		const cartWidget = page.locator('.cart-widget');
		const isVisible = await cartWidget.isVisible();
		
		if (isVisible) {
			const countText = await page.locator('.cart-widget__count').textContent();
			expect(parseInt(countText?.trim() || '0')).toBe(0);
		} else {
			await expect(cartWidget).not.toHaveClass(/is-visible/);
		}

		await page.goto(config.woocommerce.cart.path);
		
		const emptyMessage = page.locator('.woocommerce-info');
		await expect(emptyMessage).toBeVisible();
		await expect(emptyMessage).toContainText(config.woocommerce.cart.messages.empty);
	});

	test('adding item to cart updates count to 1', async ({ page, emptyCart }) => {		
		await page.goto(config.woocommerce.product.path);
		await page.locator('.single_add_to_cart_button').click();
		
		const cartWidget = page.locator('.cart-widget');
		await expect(cartWidget).toHaveClass(/is-visible/);
		
		const countElement = page.locator('.cart-widget__count');
		await expect(countElement).toBeVisible();
		await expect(countElement).toHaveText('1');
	});

	test('can change product quantity in cart', async ({ page, woocommerce }) => {
		await woocommerce.addToCart();
		await woocommerce.navigateToCart();
		
		const quantityInput = page.locator('.product-quantity input[type="number"]').first();
		
		await quantityInput.fill('2');
		
		const updateButton = page.locator('button[name="update_cart"]');
		await expect(updateButton).toBeEnabled();
		
		await updateButton.click();
		
		const successMessage = page.locator('.woocommerce-message');
		await expect(successMessage).toBeVisible();
		await expect(successMessage).toContainText(config.woocommerce.cart.messages.updated);
		
		const updatedQuantity = page.locator('.product-quantity input[type="number"]').first();
		await expect(updatedQuantity).toHaveValue('2');
	});

	test('can remove product from cart', async ({ page, cartWithProduct }) => {
		await page.goto(config.woocommerce.cart.path);
		
		const initialItems = await page.locator('.woocommerce-cart-form__cart-item').count();
		
		const removeButton = page.locator('.product-remove a.remove').first();
		await removeButton.click();
		
		const successMessage = page.locator('.woocommerce-message');
		await expect(successMessage).toBeVisible();
		await expect(successMessage).toContainText(config.woocommerce.cart.messages.removed);
		
		const undoLink = successMessage.locator('.restore-item');
		await expect(undoLink).toBeVisible();
		await expect(undoLink).toContainText(config.woocommerce.cart.messages.undo);
		
		const updatedItems = await page.locator('.woocommerce-cart-form__cart-item').count();
		expect(updatedItems).toBe(initialItems - 1);
	});
});

test.describe('checkout', () => {
	test('can access checkout page', async ({ page, emptyCart }) => {
		await page.goto(config.woocommerce.checkout.path);
		
		const emptyMessage = page.locator('.woocommerce-info');
		await expect(emptyMessage).toBeVisible();
		await expect(emptyMessage).toContainText(config.woocommerce.checkout.messages.cartEmpty);
	});

	test('can proceed to checkout with item in cart', async ({ page, cartWithProduct }) => {
		await page.goto(config.woocommerce.checkout.path);
		
		const checkoutForm = page.locator('form.checkout');
		await expect(checkoutForm).toBeVisible();
	});

	test('checkout form has required fields', async ({ page, cartWithProduct }) => {
		await page.goto(config.woocommerce.checkout.path);
		
		const checkoutForm = page.locator('form.checkout');
		await expect(checkoutForm).toBeVisible();
		
		const requiredFields = checkoutForm.locator('.validate-required input, .validate-required select, .validate-required textarea');
		const fieldCount = await requiredFields.count();
		
		expect(fieldCount).toBeGreaterThan(0);
		
		for (let i = 0; i < fieldCount; i++) {
			const field = requiredFields.nth(i);
			await expect(field).toBeVisible();
		}
	});

	// test if the user sees an error when trying to place order with empty required fields
	test('shows error when placing order with empty required fields', async ({ page, cartWithProduct, woocommerce }) => {
		await page.goto(config.woocommerce.checkout.path);
		
		const checkoutResponse = await woocommerce.placeOrder();
		expect(checkoutResponse.status()).toBe(200);
		
		const noticesWrapper = page.locator('.woocommerce-NoticeGroup');
		await expect(noticesWrapper).toBeVisible();

		const errorNotices = page.locator('.woocommerce-NoticeGroup li');
		const errorCount = await errorNotices.count();
		
		expect(errorCount).toBeGreaterThan(4);
	});

	test('can place a real order with customer data', async ({ page, cartWithProduct, baseURL, woocommerce }) => {
		await page.goto(config.woocommerce.checkout.path);
		
		const checkoutForm = page.locator('form.checkout');
		await expect(checkoutForm).toBeVisible();
		
		// Fill in billing information from config
		const customer = config.woocommerce.checkout.customer;
		
		await page.locator('#billing_first_name').fill(customer.billingFirstName);
		await page.locator('#billing_last_name').fill(customer.billingLastName);
		await page.locator('#billing_address_1').fill(customer.billingAddress1);
		await page.locator('#billing_postcode').fill(customer.billingPostcode);
		await page.locator('#billing_city').fill(customer.billingCity);
		
		// Select country - handle both regular select and Select2 dropdowns
		const countryField = page.locator('#billing_country');
		const countrySelectContainer = page.locator('.select2-selection--single[aria-labelledby*="billing_country"]');
		
		if (await countrySelectContainer.isVisible()) {
			// Handle Select2 dropdown
			await countrySelectContainer.click();
			await page.locator(`li.select2-results__option:has-text("${customer.billingCountry}")`).click();
		} else if (await countryField.isVisible()) {
			// Handle regular select field
			await countryField.selectOption(customer.billingCountry);
		}
		
		await page.locator('#billing_phone').fill(customer.billingPhone);
		await page.locator('#billing_email').fill(customer.billingEmail);
		
		const checkoutResponse = await woocommerce.placeOrder();
		expect(checkoutResponse.status()).toBe(200);
		
		// Wait for redirect to external PSP
		await page.waitForURL((url) => !url.href.includes(baseURL!), { timeout: 15000 });		
		expect(page.url()).not.toContain(baseURL);
	});
});
