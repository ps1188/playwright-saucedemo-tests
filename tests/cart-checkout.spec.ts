// cart-checkout.spec.ts - "Can I buy something, end to end?"
// This is the full flow, the same shape as a manual end-to-end test:
// log in -> add items -> open cart -> check the cart -> remove one
// -> checkout -> fill in details -> finish -> thank-you page.
// The order is not real - SauceDemo is a demo shop, so you can run
// this as often as you like.
import { test, expect } from '@playwright/test';
import { SauceDemoPage } from '../pages/SauceDemoPage';

test.beforeEach(async ({ page }) => {
  // Every test in this file starts logged in, on the Products page.
  const shop = new SauceDemoPage(page);
  await shop.goto();
  await shop.loginAsStandardUser();
});

test('adding 2 items shows both in the cart and badge 2', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await shop.addToCart('Sauce Labs Backpack');
  await shop.addToCart('Sauce Labs Bike Light');
  await expect(shop.cartBadge).toHaveText('2');

  await shop.openCart();

  await expect(shop.productName('Sauce Labs Backpack')).toBeVisible();
  await expect(shop.productName('Sauce Labs Bike Light')).toBeVisible();
  await expect(shop.cartBadge).toHaveText('2');
});

test('removing one item from the cart leaves the other one', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await shop.addToCart('Sauce Labs Backpack');
  await shop.addToCart('Sauce Labs Bike Light');
  await shop.openCart();

  await shop.removeFromCart('Sauce Labs Bike Light');

  // Badge drops to 1, Backpack stays, Bike Light is gone.
  await expect(shop.cartBadge).toHaveText('1');
  await expect(shop.productName('Sauce Labs Backpack')).toBeVisible();
  await expect(shop.productName('Sauce Labs Bike Light')).toBeHidden();
});

test('complete checkout shows Thank you and empties the cart', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await shop.addToCart('Sauce Labs Backpack');
  await shop.addToCart('Sauce Labs Bike Light');
  await shop.openCart();

  await shop.checkout('Patrick', 'Sam', '30096');
  await shop.finishCheckout();

  await expect(shop.completeHeader).toHaveText('Thank you for your order!');
  // The order is done, so the cart is empty - and the badge disappears
  // completely, it does not say 0. That is why this is toBeHidden().
  await expect(shop.cartBadge).toBeHidden();
});
test('complete checkout with only the Onesie shows Thank you and empties the cart', async ({ page }) => {
  const shop = new SauceDemoPage(page);

  await shop.addToCart('Sauce Labs Onesie');
  await shop.openCart();

  await shop.checkout('Patrick', 'Sam', '30096');
  await shop.finishCheckout();

  await expect(shop.completeHeader).toHaveText('Thank you for your order!');
  await expect(shop.cartBadge).toBeHidden();
});