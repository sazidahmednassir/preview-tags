import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse, stringify } from 'csv-parse/sync';
import pLimit from 'p-limit';

const csvFilePath = path.join(__dirname, "../tags.csv");
const limit = pLimit(1); // Limit to 1 file write at a time

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
      let testFailed = false;

      try {
        await page.goto('https://example.com'); // Replace with real steps
        throw new Error('Simulated failure');
      } catch (error) {
        console.error(`Test failed for Tag: ${tagPath}`);
        testFailed = true;
      } finally {
        await context.close();
      }

      if (testFailed) {
        await limit(async () => {
          // Update the CSV safely
          const updatedRecords = parse(fs.readFileSync(csvFilePath), {
            columns: true,
            skip_empty_lines: true,
          });

          for (const r of updatedRecords) {
            if (r.Tags === tagPath) {
              r.Tags = `Failed: ${tagPath}`;
            }
          }

          fs.writeFileSync(csvFilePath, stringify(updatedRecords, { header: true }));
          console.log(`CSV updated for failed tag: ${tagPath}`);
        });
      }
    });
  }
});
