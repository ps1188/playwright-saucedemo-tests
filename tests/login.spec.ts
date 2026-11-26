// login.spec.ts - "Can I log in, and what happens with a bad login?"
// SauceDemo prints its test accounts on the login page itself:
// standard_user / secret_sauce works, locked_out_user is locked out.
// No real account, no real order - this is a demo shop made for practice.
import { test, expect } from '@playwright/test';
import { SauceDemoPage } from '../pages/SauceDemoPage';

test('valid login goes to the inventory page', async ({ page }) => {
  const shop = new SauceDemoPage(page);
  await shop.goto();
  await shop.login('standard_user', 'secret_sauce');

  // The page title changes to "Products" and the URL changes too.
  await expect(shop.pageTitle).toHaveText('Products');
  await expect(page).toHaveURL(/inventory\.html/);
});

test('wrong password shows an error and stays on the login page', async ({ page }) => {
  const shop = new SauceDemoPage(page);
  await shop.goto();

  await shop.usernameInput.fill('standard_user');
  await shop.passwordInput.fill('wrong_password');
  await shop.loginButton.click();

  // Still on the login page - no inventory, login button still there.
  await expect(shop.errorMessage).toContainText('Username and password do not match');
  await expect(shop.loginButton).toBeVisible();
  await expect(page).not.toHaveURL(/inventory\.html/);
});

test('locked-out user shows the locked-out error', async ({ page }) => {
  const shop = new SauceDemoPage(page);
  await shop.goto();

  await shop.usernameInput.fill('locked_out_user');
  await shop.passwordInput.fill('secret_sauce');
  await shop.loginButton.click();

  await expect(shop.errorMessage).toContainText('Sorry, this user has been locked out');
  await expect(shop.loginButton).toBeVisible();
});
