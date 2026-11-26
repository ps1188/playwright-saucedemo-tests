# Playwright Tests for SauceDemo (Swag Labs)

My second test-automation project. I am a manual QA engineer (10+ years)
learning automation. These tests check **SauceDemo**, the demo shop at
https://www.saucedemo.com, with **Playwright + TypeScript**.

## What this project proves

- The Page Object Model transfers. My first project tested my own PDF
  Editor; this one tests a shop I did not build, with the same pattern:
  selectors and actions in one class (`pages/SauceDemoPage.ts`), tests
  that read like manual test cases.
- I can write automated UI tests in TypeScript, not just run manual cases.
- I use `data-test` ids (`getByTestId`) where the site provides them,
  and role / text selectors where it does not — instead of brittle
  CSS/XPath — and I wait for real app state instead of fixed sleeps.
- I test what the site **actually does** — the tests are written
  against the real live site. Run them once on your own PC (or in
  GitHub Actions) to see them pass there; that first green run is
  the real check, do not claim a pass you have not seen.

## What the site under test is

SauceDemo (Swag Labs) is a demo e-commerce site made for QA practice.
It prints its test accounts on the login page. The accounts used here:
- `standard_user` / `secret_sauce` — works, goes to the Products page
- `locked_out_user` / `secret_sauce` — locked out, shows an error

No real account, no real money, no real order — you can run the full
checkout flow as often as you like. There are 6 products in the shop.

## How to run it

```bash
# 1. Install Node.js 20 or newer (check with: node -v)
# 2. Install dependencies
npm install

# 3. Install the Chromium browser Playwright drives
npx playwright install chromium

# 4. Run the tests
#    NOTE: this project tests a LIVE site, so it needs internet.
npm test

# 5. See the HTML report
npm run test:report

# Optional: watch the tests run in the browser
npm run test:ui
```

There is no local server to start, unlike the PDF Editor project —
`playwright.config.ts` has no `webServer` block, it just opens
https://www.saucedemo.com.

## What each test file teaches

| File | What it covers | What it teaches |
|---|---|---|
| `tests/login.spec.ts` | Valid login goes to inventory, wrong password shows an error, locked-out user shows the locked-out error | Login flow, error messages, staying on the same page on failure |
| `tests/inventory.spec.ts` | 6 products shown, sorting Z to A puts the red T-shirt first, adding the Backpack shows cart badge 1 | `test.beforeEach` login, `selectOption()` on a dropdown, `toHaveCount()`, badge hidden when empty |
| `tests/cart-checkout.spec.ts` | Add 2 items, cart shows both and badge 2, remove one leaves the other, full checkout ends with "Thank you for your order!" and an empty cart | End-to-end flow, chaining steps, using an id from one step in the next |

`pages/SauceDemoPage.ts` is the Page Object — one class holding every
selector and the common actions (`goto()`, `login()`, `addToCart()`,
`openCart()`, `checkout()`, `finishCheckout()`). If a button label
changes, fix it there once.

One thing to know about this site: Playwright's `getByTestId()` normally
looks for `data-testid`, but SauceDemo uses `data-test` instead.
`playwright.config.ts` sets `testIdAttribute: 'data-test'`, so
`getByTestId('username')` finds `data-test="username"`. That is the
only config difference that matters here.


## What I can honestly put on my resume after this

Once I have run these tests myself, changed a selector, and added at
least one test of my own, I can honestly write:

> Built a second Playwright + TypeScript test suite (9 tests, Page Object
> Model) for SauceDemo, a demo e-commerce site: login (valid / wrong
> password / locked-out), product list and sorting, cart add / remove,
> and full checkout to order confirmation; runs in GitHub Actions.

Together with the PDF Editor project (36 tests), that is 45 tests across
two apps, one pattern. I am **not** yet an automation engineer — I have
two portfolio projects, not production automation experience. The honest
next line is "learning Playwright", not "5 years automation experience".
