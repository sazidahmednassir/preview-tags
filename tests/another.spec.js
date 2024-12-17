import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse, stringify } from 'csv-parse/sync';

// Path to the CSV file
const csvFilePath = path.join(__dirname, "../tags.csv");

// Helper function: Update a specific row in the CSV
function updateCSV(filePath, failedTag) {
  let records = parse(fs.readFileSync(filePath), {
    columns: true,
    skip_empty_lines: true,
  });

  // Update the 'Tags' column only for the failed path
  for (const record of records) {
    if (record.Tags === failedTag) {
      console.log(`Updating failed path: ${failedTag}`);
      record.Tags = failedTag; // Keep it as-is to signify failure
    }
  }

  // Write updated data back to the CSV file
  fs.writeFileSync(filePath, stringify(records, { header: true }));
  console.log(`CSV updated for failed path: ${failedTag}`);
}

test.describe.serial('Preview Page Activate', () => {
  let records = parse(fs.readFileSync(csvFilePath), {
    columns: true,
    skip_empty_lines: true,
  });

  for (const record of records) {
    const tagPath = record.Tags; // Read Tags column

    test(`Test Preview Activation for Tag: ${tagPath}`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      let testFailed = false;

      try {
        // Actions to activate the preview page
        await page.goto('https://author-p50407-e476655.adobeaemcloud.com/ui#/aem/libs/cq/workflow/admin/console/content/models.html');
        await page.getByLabel('Email address').fill('nassir.sazidahmed@abbvie.com');
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(4000);

        await page.locator('#username').fill('SAZIDNX');
        await page.locator('#password').fill('One@500#$');
        await page.getByText('Sign On').click();
        await page.waitForTimeout(15000);

        // Simulate navigating and entering content
        await page.locator('iframe[name="Main Content"]').contentFrame()
          .getByRole('button', { name: 'Open left rail for additional' }).click();

        await page.locator('iframe[name="Main Content"]').contentFrame()
          .getByLabel('Enter Keyword').fill(tagPath);

        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        await page.locator('iframe[name="Main Content"]').contentFrame()
          .getByRole('button', { name: 'Run' }).click();

      } catch (error) {
        console.error(`Test failed for Tag: ${tagPath}`, error);
        testFailed = true;
      } finally {
        await context.close();
      }

      // If the test fails, immediately update the CSV file
      if (testFailed) {
        updateCSV(csvFilePath, tagPath);
      }
    });
  }
});
