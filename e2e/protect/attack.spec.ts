import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('attacks', () => {
    test('string sql injection', async ({ page }) => {
      await page.goto('/Content/SQLInjection.aspx');
      await page.locator('#ctl00_BodyContentPlaceholder_txtName').fill('D\' OR \'1%\'=\'1');

      await page.locator('#ctl00_BodyContentPlaceholder_btnAdd').click();
      await expect(page.locator("text=firstName")).toHaveCount(1)

    })
  });

  