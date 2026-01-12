import { test as base, Page, Response } from '@playwright/test';
import { config } from '../config';

type WooCommerceFixtures = {
  emptyCart: void;
  cartWithProduct: void;
  woocommerce: {
    addToCart: (productId?: string, quantity?: number) => Promise<void>;
    clearCart: () => Promise<void>;
    navigateToCart: () => Promise<void>;
    navigateToCheckout: () => Promise<void>;
    getCartCount: () => Promise<number>;
    placeOrder: () => Promise<Response>;
  };
};

export const test = base.extend<WooCommerceFixtures>({
  // Fixture to ensure cart is empty before test
  emptyCart: async ({ page }, use) => {
    await clearCart(page);
    await use();
    // Cleanup after test
    await clearCart(page);
  },

  // Fixture to add a product to cart before test
  cartWithProduct: async ({ page }, use) => {
    await clearCart(page);
    await addProductToCart(page);
    await use();
    // Cleanup after test
    await clearCart(page);
  },

  // Fixture providing WooCommerce helper methods
  woocommerce: async ({ page }, use) => {
    const helpers = {
      addToCart: async (productId: string = config.woocommerce.product.id, quantity: number = 1) => {
        await addProductToCart(page, productId, quantity);
      },
      clearCart: async () => {
        await clearCart(page);
      },
      navigateToCart: async () => {
        await page.goto(config.woocommerce.cart.path);
      },
      navigateToCheckout: async () => {
        await page.goto(config.woocommerce.checkout.path);
      },
      getCartCount: async () => {
        await page.goto('/');
        const cartWidget = page.locator('.cart-widget');
        const isVisible = await cartWidget.isVisible();
        
        if (!isVisible) {
          return 0;
        }
        
        const countText = await page.locator('.cart-widget__count').textContent();
        return parseInt(countText?.trim() || '0');
      },
      placeOrder: async () => {
        const placeOrderButton = page.locator('#place_order');
        await placeOrderButton.waitFor({ state: 'visible' });
        await placeOrderButton.waitFor({ state: 'attached' });
        
        const checkoutResponsePromise = page.waitForResponse(
          response => response.url().includes('wc-ajax=checkout')
        );
        
        await placeOrderButton.click();
        
        const checkoutResponse = await checkoutResponsePromise;
        return checkoutResponse;
      },
    };

    await use(helpers);
  },
});

export { expect } from '@playwright/test';

// Helper functions
async function addProductToCart(
  page: Page,
  productId: string = config.woocommerce.product.id,
  quantity: number = 1
): Promise<void> {
  await page.goto(`/?add-to-cart=${productId}&quantity=${quantity}`);
  await page.waitForLoadState('networkidle');
}

async function clearCart(page: Page): Promise<void> {
  // Navigate to cart
  await page.goto(config.woocommerce.cart.path);
  
  // Check if cart has items
  const cartItems = page.locator('.woocommerce-cart-form__cart-item');
  const itemCount = await cartItems.count();
  
  if (itemCount === 0) {
    return;
  }
  
  // Remove all items from cart
  for (let i = 0; i < itemCount; i++) {
    const removeButton = page.locator('.product-remove a.remove').first();
    if (await removeButton.count() > 0) {
      await removeButton.click();
      await page.waitForLoadState('networkidle');
    }
  }
  
  // Verify cart is empty
  const emptyMessage = page.locator('.woocommerce-info');
  await emptyMessage.waitFor({ state: 'visible', timeout: 5000 });
}
