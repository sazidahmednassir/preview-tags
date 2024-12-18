import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse} from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const csvFilePath = path.join(__dirname, "../tags.csv");
const failedTags = []; // Collect failed tags

// Read CSV file once at the start
let records = parse(fs.readFileSync(csvFilePath), {
  columns: true,
  skip_empty_lines: true,
});

test.describe('Preview Page Activate', () => {
  for (const record of records) {
    const tagPath = record.Tags;

    test(`Test Preview Activation for Tag: ${tagPath}`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        // Perform test actions
        await page.goto('https://author-p50407-e476655.adobeaemcloud.com/ui#/aem/libs/cq/workflow/admin/console/content/models.html');
        await page.getByLabel('Email address').fill('nassir.sazidahmed@abbvie.com')

        await page.getByRole('button', { name: 'Continue' }).click()
        await page.waitForTimeout(4000);
        await page.locator('#username').fill('SAZIDNX')
        await page.locator('#password').fill('One@500#$')
        await page.getByText('Sign On').click()
    // await page.pause();
    // Perform any post-login actions
        await page.waitForTimeout(15000);
  
        await page.waitForTimeout(20000)
        await page.locator('iframe[name="Main Content"]').contentFrame().getByRole('button', { name: 'Open left rail for additional' }).click();
        await page.locator('iframe[name="Main Content"]').contentFrame().getByLabel('List').getByText('alt+1Search').click();
        await page.locator('iframe[name="Main Content"]').contentFrame().getByLabel('Enter Keyword').fill('OUS Commercial Preview Activate')
        await page.waitForTimeout(3000)
        await page.keyboard.press('Enter');
        await page.locator('iframe[name="Main Content"]').contentFrame().getByLabel('Card View').click();
  
        await page.waitForTimeout(2000);
        await page.locator('iframe[name="Main Content"]').contentFrame().getByRole('checkbox', { name: 'Select', exact: true }).click();
        await page.locator('iframe[name="Main Content"]').contentFrame().getByRole('button', { name: 'Start Workflow' }).click();
        await page.locator('iframe[name="Main Content"]').contentFrame().getByLabel('Payload *').fill(record.Tags)
        await page.locator('iframe[name="Main Content"]').contentFrame().getByRole('button', { name: 'Run' }).click()
  
        throw new Error('Simulated failure'); // Simulate test failure
      } catch (error) {
        console.error(`Test failed for Tag: ${tagPath}`);
        failedTags.push(tagPath); // Collect the failed tag
      } finally {
        await context.close();
      }
    });
  }
});

// After all tests, update the CSV file
test.afterAll(() => {
  for (const record of records) {
    if (failedTags.includes(record.Tags)) {
      record.Tags = `Failed: ${record.Tags}`; // Mark failed paths
    }
  }

  fs.writeFileSync(csvFilePath, stringify(records, { header: true }));
  console.log("CSV updated with failed tags.");
});
