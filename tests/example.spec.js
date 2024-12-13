// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto("https://author-p50407-e476655.adobeaemcloud.com/ui#/aem/libs/cq/workflow/admin/console/content/models.html");
  await page.locator("//coral-card-title[text()='OUS Commercial Preview Activate']").hover()
  await page.locator("._coral-Icon--sizeS _coral-Icon").click()
  await page.locator("//coral-button-label[text()='Start Workflow']").click()

});
