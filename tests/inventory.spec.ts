// inventory.spec.ts - "Can I see the products, sort them, and add one to the cart?"
// Every test here logs in first (test.beforeEach), because the inventory
// page only exists after login - same idea as the PDF Editor tests,
// where every test opened a PDF first.
import { test, expect } from '@playwright/test';
import { SauceDemoPage } from '../pages/SauceDemoPage';

test.beforeEach(async ({ page }) => {
  // Every test in this file starts logged in, on the Products page.
  const shop = new SauceDemoPage(page);
  await shop.goto();
  await shop.loginAsStandardUser();
});

test('inventory shows 6 products', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await expect(shop.pageTitle).toHaveText('Products');
  await expect(shop.inventoryItems).toHaveCount(6);
  // Spot-check the first and last product in the default A to Z order.
  await expect(shop.productNames.first()).toHaveText('Sauce Labs Backpack');
  await expect(shop.productNames.last()).toHaveText('Test.allTheThings() T-Shirt (Red)');
});

test('sorting Z to A puts the red T-shirt first', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await shop.sortBy('za');

  // Z to A = reverse alphabetical. The "T" product comes first now.
  await expect(shop.productNames.first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
  await expect(shop.productNames.last()).toHaveText('Sauce Labs Backpack');
});

test('adding the Backpack shows cart badge 1', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  // No badge at all before adding anything - the cart is empty.
  await expect(shop.cartBadge).toBeHidden();

  await shop.addToCart('Sauce Labs Backpack');

  await expect(shop.cartBadge).toHaveText('1');
  await expect(shop.productName('Sauce Labs Backpack')).toBeVisible();
});
test('adding the Fleece Jacket shows cart badge 1', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await expect(shop.cartBadge).toBeHidden();

  await shop.addToCart('Sauce Labs Fleece Jacket');

  await expect(shop.cartBadge).toHaveText('1');
  await expect(shop.productName('Sauce Labs Fleece Jacket')).toBeVisible();
});