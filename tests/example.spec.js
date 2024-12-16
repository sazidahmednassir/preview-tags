import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {parse} from 'csv-parse/sync';

const records=  parse(
 fs.readFileSync(path.join(__dirname,"../tags.csv")),
  {
    columns:true,
    skip_empty_lines:true,
  });

for (const record of records) {

  test(`preview ${record.Tags}`, async ({ browser }) => {

    const context= await browser.newContext();
    const page= await context.newPage();
  
    // Directly navigate to the target page
    await page.goto('https://author-p50407-e476655.adobeaemcloud.com/ui#/aem/libs/cq/workflow/admin/console/content/models.html');
    await page.getByLabel('Email address').fill('nassir.sazidahmed@abbvie.com')
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.locator('#username').fill('SAZIDNX')
    await page.locator('#password').fill('One@500#$')
    await page.getByText('Sign On').click()
    // await page.pause();
    // Perform any post-login actions
    await page.waitForTimeout(15000);
  
    //again
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
  
    await page.waitForTimeout(3000);
    await context.close()
    // await page.pause();
    // await page.waitForTimeout(5000);
    // Validate the page title
    
  });


}
 