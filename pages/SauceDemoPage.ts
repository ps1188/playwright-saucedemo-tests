// Page Object Model (POM) for SauceDemo / Swag Labs.
//
// What is a Page Object? Instead of repeating selectors in every test,
// we put them in ONE class. Each test calls a plain-English method like
// `shop.login('standard_user', 'secret_sauce')` or
// `shop.addToCart('Sauce Labs Backpack')`.
//
// Why it helps a learner:
// - If the site changes a button label, you fix ONE place (here), not 9 tests.
// - Tests read like a manual test case: "log in, add the backpack,
//   check the cart badge says 1" - the HOW lives here, the WHAT in tests.
//
// This is the SAME pattern as pages/PdfEditorPage.ts in the PDF Editor
// project, just on a different site. That is the point of Week 7:
// prove the pattern transfers, it is not just memorised for one app.
//
// Selector choices (all verified against the live saucedemo.com):
// - SauceDemo puts a `data-test` attribute on almost every control,
//   e.g. data-test="username", data-test="login-button",
//   data-test="add-to-cart-sauce-labs-backpack". Playwright's
//   getByTestId() is told to read `data-test` in playwright.config.ts
//   (testIdAttribute: 'data-test'), so getByTestId('username') works.
//   That is the most stable way: test ids do not change when the
//   visible text or the styling changes.
// - Product names are plain text on the page, so productName() finds
//   them with getByText(). The add/remove buttons are found by their
//   data-test slug, built from the product name (see productSlug()).
// - The sort dropdown is a real <select> (data-test="product-sort-container"),
//   so we use selectOption() with the option value: 'az' (A to Z),
//   'za' (Z to A), 'lohi' (low to high), 'hilo' (high to low).
// - The cart badge (data-test="shopping-cart-badge") only exists when
//   the cart is NOT empty. When the cart is empty there is no badge at
//   all, so expect(cartBadge).toBeHidden() is the right check for empty.
import { expect, type Locator, type Page } from '@playwright/test';

export type ProductName =
  | 'Sauce Labs Backpack'
  | 'Sauce Labs Bike Light'
  | 'Sauce Labs Bolt T-Shirt'
  | 'Sauce Labs Fleece Jacket'
  | 'Sauce Labs Onesie'
  | 'Test.allTheThings() T-Shirt (Red)';

/**
 * Turn a product name into the slug SauceDemo uses in its data-test
 * attributes. Example: 'Sauce Labs Backpack' -> 'sauce-labs-backpack',
 * so the add button is data-test="add-to-cart-sauce-labs-backpack".
 * The red T-shirt is the odd one: its slug keeps the dots and brackets,
 * 'test.allthethings()-t-shirt-(red)'.
 */
function productSlug(product: ProductName): string {
  if (product === 'Test.allTheThings() T-Shirt (Red)') {
    return 'test.allthethings()-t-shirt-(red)';
  }
  return product.toLowerCase().replace(/ /g, '-');
}

export class SauceDemoPage {
  readonly page: Page;

  // --- Login page ---
  readonly usernameInput: Locator; // data-test="username"
  readonly passwordInput: Locator; // data-test="password"
  readonly loginButton: Locator; // data-test="login-button"
  readonly errorMessage: Locator; // data-test="error" - "Epic sadface: ..."

  // --- Inventory page ---
  readonly pageTitle: Locator; // data-test="title" - "Products", "Your Cart", etc.
  readonly inventoryItems: Locator; // data-test="inventory-item" - one per product
  readonly productNames: Locator; // data-test="inventory-item-name"
  readonly sortDropdown: Locator; // data-test="product-sort-container"

  // --- Cart (top-right, on every page after login) ---
  readonly cartLink: Locator; // data-test="shopping-cart-link"
  readonly cartBadge: Locator; // data-test="shopping-cart-badge" - only when cart is not empty

  // --- Checkout: your information ---
  readonly firstNameInput: Locator; // data-test="firstName" - camelCase, NOT "first-name"
  readonly lastNameInput: Locator; // data-test="lastName"
  readonly postalCodeInput: Locator; // data-test="postalCode"
  readonly continueButton: Locator; // data-test="continue"

  // --- Checkout: overview + complete ---
  readonly checkoutButton: Locator; // data-test="checkout" (on the cart page)
  readonly finishButton: Locator; // data-test="finish" (on the overview page)
  readonly completeHeader: Locator; // "Thank you for your order!"

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
    this.pageTitle = page.getByTestId('title');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.checkoutButton = page.getByTestId('checkout');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByText('Thank you for your order!');
  }

  /** Open the login page. */
  async goto() {
    await this.page.goto('/');
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Log in and wait until the Products page loads.
   * Standard user: login('standard_user', 'secret_sauce').
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.pageTitle).toHaveText('Products');
  }

  /**
   * Log in as the standard user - the shortcut most tests need.
   * Same as login('standard_user', 'secret_sauce').
   */
  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  /** A product name on the page, e.g. 'Sauce Labs Backpack'. */
  productName(product: ProductName) {
    return this.page.getByText(product, { exact: true });
  }

  /**
   * Add a product to the cart from the inventory page.
   * Example: addToCart('Sauce Labs Backpack') clicks
   * data-test="add-to-cart-sauce-labs-backpack".
   */
  async addToCart(product: ProductName) {
    await this.page.getByTestId(`add-to-cart-${productSlug(product)}`).click();
  }

  /**
   * Remove a product from the cart (works on the cart page, and on the
   * inventory page once the product is in the cart and the button
   * has flipped to "Remove").
   */
  async removeFromCart(product: ProductName) {
    await this.page.getByTestId(`remove-${productSlug(product)}`).click();
  }

  /** Open the cart page and wait until it loads. */
  async openCart() {
    await this.cartLink.click();
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  /** Sort the inventory: 'az' (A to Z), 'za' (Z to A), 'lohi', 'hilo'. */
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Fill in the checkout form (first name, last name, postal code)
   * and continue to the overview page.
   */
  async checkout(firstName: string, lastName: string, postalCode: string) {
    await this.checkoutButton.click();
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  /** Finish the order from the overview page and wait for the thank-you page. */
  async finishCheckout() {
    await this.finishButton.click();
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toBeVisible();
  }
}
