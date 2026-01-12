import { test, expect } from '@playwright/test';

import { config } from './config';

async function fillFormFields(form: any, fields: typeof config.htmlForms.fields) {
  for (const [fieldName, fieldData] of Object.entries(fields)) {
    const fieldLocator = form.locator(`[name="${fieldName}"]`);
    
    if (fieldData.type === 'checkbox') {
      if (fieldData.value) {
        await fieldLocator.check();
      }
    } else if (typeof fieldData.value === 'string') {
      await fieldLocator.fill(fieldData.value);
    } else {
      throw new Error(`Unsupported field type or value for field "${fieldName}"`);
    }
  }
}

function getForm(page: any) {
  return page.locator(`form[data-id="${config.htmlForms.id}"]`);
}

test.describe('HTML Forms', () => {
  test.skip(!config.htmlForms.enableTest, 'Contact Form is disabled in config.');

  test.beforeEach(async ({ page }) => {
    await page.goto(config.htmlForms.path);
  });

  test('form markup', async ({ page }) => {
    const form = getForm(page);

    await expect(form).toBeVisible();

    for (const [fieldName, fieldData] of Object.entries(config.htmlForms.fields)) {
      const fieldLocator = form.locator(`[name="${fieldName}"]`);
      await expect(fieldLocator).toBeVisible();
      
      if (fieldData.type !== 'textarea') {
        await expect(fieldLocator).toHaveAttribute('type', fieldData.type);
      }
    }
  });

  test('shows error when submitting without fields', async ({ page }) => {
    const form = getForm(page);
    
    await form.evaluate((formElement: HTMLFormElement) => {
      formElement.setAttribute('novalidate', 'true');
    });
    
    await form.locator('button[type="submit"], input[type="submit"]').click();
    
    const errorMessage = page.locator('.hf-message-warning[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(config.htmlForms.messages.error);
  });

  test('successfully submits contact form', async ({ page }) => {
    const form = getForm(page);
    
    await fillFormFields(form, config.htmlForms.fields);
    
    await form.locator('button[type="submit"], input[type="submit"]').click();
    
    const successMessage = page.locator('.hf-message-success[role="alert"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText(config.htmlForms.messages.success);
  });
});
