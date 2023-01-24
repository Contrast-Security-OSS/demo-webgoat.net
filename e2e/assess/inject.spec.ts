import { test, expect, Download } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('injection flaws', () => {

  test('customer search', async ({ page }) => {
    await page.goto('/Content/SQLInjectionDiscovery.aspx');
    await page.locator('#ctl00_BodyContentPlaceholder_txtID').fill('101');

    await page.locator('input:has-text("Find Email!")').click();
    await expect(page.locator("text=Customer Number does not exist")).toHaveCount(1)
  })

  test('add coin review', async ({ page }) => {
    await page.goto('/WebGoatCoins/ProductDetails.aspx?productNumber=S18_2795');
    await page.locator('#ctl00_BodyContentPlaceholder_txtEmail').fill('david@contrast.com');
    await page.locator('#ctl00_BodyContentPlaceholder_txtComment').fill('Nice, shiny!');

    await page.locator('#ctl00_BodyContentPlaceholder_btnSave').click();
    await expect(page.locator("text=Comment Successfully Added!")).toHaveCount(1)
  })

  test('download file', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.goto('/Content/PathManipulation.aspx');
    page.waitForEvent('download');
    await page.locator('#ctl00_BodyContentPlaceholder_HyperLink0').click(); 
    const download = await downloadPromise;

    await download.saveAs('~/tmp/file.pdf');
  })

  test('leave comment', async ({ page }) => {
    await page.goto('/Content/StoredXSS.aspx');
    await page.locator('#ctl00_BodyContentPlaceholder_txtEmail').fill('david@contrast.com');
    await page.locator('#ctl00_BodyContentPlaceholder_txtComment').fill('Nice website, great work.');

    await page.locator('#ctl00_BodyContentPlaceholder_btnSave').click();
    await expect(page.locator("text=Comment Successfully Added!")).toHaveCount(1)
  })

  test('view city', async ({ page }) => {
    await page.goto('/Content/ReflectedXSS.aspx?city=San+Francisco');

    await expect(page.locator("text=OUR OFFICES")).toHaveCount(1)
  })

  test('debug information', async ({ page }) => {
    await page.goto('/Content/ExploitDebug.aspx');
    await page.locator('#ctl00_BodyContentPlaceholder_btnGo').click();
    await expect(page.locator("text=Server Error in '/' Application.")).toHaveCount(1)
  })

  test('encryption', async ({ page }) => {
    await page.goto('/Content/EncryptVSEncode.aspx');
    await page.locator('#ctl00_BodyContentPlaceholder_txtString').fill('this is a secret');
    await page.locator('#ctl00_BodyContentPlaceholder_txtPassword').fill('thisisapassword');

    await page.locator('#ctl00_BodyContentPlaceholder_btnGo').click();
    await expect(page.locator("text=Custom Crypto")).toHaveCount(1)
  })

  test('digest', async ({ page }) => {
    await page.goto('/Content/MessageDigest.aspx');
    await page.locator('#ctl00_BodyContentPlaceholder_txtBoxMsg').fill('this is a message');

    await page.locator('#ctl00_BodyContentPlaceholder_btnDigest').click();
    await expect(page.locator("text=Result: aA$t")).toHaveCount(1)
  })

});