import { Browser, chromium, FullConfig, expect } from '@playwright/test'
 
async function globalSetup (config: FullConfig) {
  const browser = await chromium.launch()
  let project = config.projects[0];
  const { baseURL } = project.use;

  await saveStorage(browser, baseURL, 'bob@ateliergraphique.com', '123456', './tmp/admin.json')

  browser.close();
}
 
async function saveStorage (browser: Browser, baseURL: string, email: string, password: string, saveStoragePath: string) {
  const page = await browser.newPage()
  await page.goto(baseURL + "/RebuildDatabase.aspx")

  await page.locator('#ctl00_BodyContentPlaceholder_ButtonProceed').click();
  await expect(page.locator("text=CONNECT TO DATABASE")).toHaveCount(1)

  await page.locator('#ctl00_BodyContentPlaceholder_btnRebuildDatabase').click();
  await expect(page.locator("text=Database Rebuild Successful!")).toHaveCount(1)

  await page.goto(baseURL + "/WebGoatCoins/CustomerLogin.aspx")

  await page.fill('#ctl00_BodyContentPlaceholder_txtUserName', email);
  await page.fill('#ctl00_BodyContentPlaceholder_txtPassword', password);
  await page.locator('#ctl00_BodyContentPlaceholder_buttonLogOn').click();

  await page.context().storageState({ path: saveStoragePath })
}

export default globalSetup