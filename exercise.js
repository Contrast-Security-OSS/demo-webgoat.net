const puppeteer = require('puppeteer');

(async () => {
  if (!process.env.BASEURL) {
      console.log('Please specify a base url. E.g. `BASEURL=http://example.org node exercise.js`');
  } else {
    var browser;
    if (process.env.DEBUG == true) {
      browser = await puppeteer.launch({
          headless: false,
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      });
    } else {
      browser = await puppeteer.launch();
    }

    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(120000) //2 mins

    const navigationPromise = page.waitForNavigation()

    const pageOptions = {waitUntil: 'domcontentloaded'}
    const selectorOptions = {"timeout": 120000} //2 mins

    try {
      //Add error handling here in case the endpoint is not ready.
      await page.goto(process.env.BASEURL, pageOptions);
    } catch (error) {
      console.log(error);
      browser.close();
    }

    //Rebuild the database

    console.log("Rebuilding database")
    await page.waitForSelector('#ctl00_BodyContentPlaceholder_ButtonProceed', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_ButtonProceed');

    await navigationPromise

    await page.waitForSelector('.FullWidth #ctl00_BodyContentPlaceholder_btnRebuildDatabase', selectorOptions)
    await page.click('.FullWidth #ctl00_BodyContentPlaceholder_btnRebuildDatabase')

    await navigationPromise

    //Log in to COINS

    console.log(process.env.BASEURL + '/WebGoatCoins/CustomerLogin.aspx')
    await page.goto(process.env.BASEURL + '/WebGoatCoins/CustomerLogin.aspx', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtUserName', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtUserName', 'bob@ateliergraphique.com')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtPassword', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtPassword', '123456')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_buttonLogOn', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_buttonLogOn')

    await navigationPromise

    //Leave a comment

    console.log(process.env.BASEURL + '/WebGoatCoins/ProductDetails.aspx')
    await page.goto(process.env.BASEURL + '/WebGoatCoins/ProductDetails.aspx?productNumber=S18_2795', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtEmail', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtEmail', 'david@contrast.com')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtComment', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtComment', 'Nice, shiny!')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnSave', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_btnSave')

    await navigationPromise

    // Commenting out a couple of sections so that there are fewer vulns reported in the QA section of the Webgoat.NET demo than the DEV section

    //SQLi 1

    //console.log(process.env.BASEURL + '/Content/SQLInjectionDiscovery.aspx')
    //await page.goto(process.env.BASEURL + '/Content/SQLInjectionDiscovery.aspx', pageOptions)

    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtID', selectorOptions)
    //await page.type('#ctl00_BodyContentPlaceholder_txtID', '101')

    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnFind', selectorOptions)
    //await page.click('#ctl00_BodyContentPlaceholder_btnFind')

    //await navigationPromise

    //SQLi 2 Attack

    //console.log(process.env.BASEURL + '/Content/SQLInjection.aspx')
    //await page.goto(process.env.BASEURL + '/Content/SQLInjection.aspx', pageOptions)

    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtName', selectorOptions)
    //await page.type('#ctl00_BodyContentPlaceholder_txtName', "D' OR '1%'='1")

    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnAdd', selectorOptions)
    //await page.click('#ctl00_BodyContentPlaceholder_btnAdd')

    //await navigationPromise

    //Download File Path Manipulation

    console.log(process.env.BASEURL + '/Content/PathManipulation.aspx')
    await page.goto(process.env.BASEURL + '/Content/PathManipulation.aspx', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_HyperLink0', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_HyperLink0')

    //Stored XSS

    console.log(process.env.BASEURL + '/Content/StoredXSS.aspx')
    await page.goto(process.env.BASEURL + '/Content/StoredXSS.aspx', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtEmail', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtEmail', 'david@contrast.com')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtComment', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtComment', "<script>alert(1)</script>")

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnSave', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_btnSave')

    await navigationPromise

    //Reflected XSS

    console.log(process.env.BASEURL + '/Content/ReflectedXSS.aspx')
    await page.goto(process.env.BASEURL + '/Content/ReflectedXSS.aspx?city=San+Francisco', pageOptions)

    //Forgot Password

    //console.log(process.env.BASEURL + '/Content/ForgotPassword.aspx')
    //await page.goto(process.env.BASEURL + '/Content/ForgotPassword.aspx', pageOptions)

    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtEmail', selectorOptions)
    //await page.type('#ctl00_BodyContentPlaceholder_txtEmail','bob@ateliergraphique.com')
    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_ButtonCheckEmail', selectorOptions)
    //await page.click('#ctl00_BodyContentPlaceholder_ButtonCheckEmail')

    //await navigationPromise

    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtAnswer', selectorOptions)
    //await page.type('#ctl00_BodyContentPlaceholder_txtAnswer','blue')
    //await page.waitForSelector('#ctl00_BodyContentPlaceholder_ButtonCheckAnswer', selectorOptions)
    //await page.click('#ctl00_BodyContentPlaceholder_ButtonCheckAnswer')

    //await navigationPromise

    //Debug page

    console.log(process.env.BASEURL + '/Content/ExploitDebug.aspx')
    await page.goto(process.env.BASEURL + '/Content/ExploitDebug.aspx', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnGo', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_btnGo')

    await navigationPromise

    //Encrypt page
    console.log(process.env.BASEURL + '/Content/EncryptVSEncode.aspx')
    await page.goto(process.env.BASEURL + '/Content/EncryptVSEncode.aspx', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtString', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtString','test')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtPassword', selectorOptions)
    await page.type('#ctl00_BodyContentPlaceholder_txtPassword','test')


    await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnGo', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_btnGo')

    await navigationPromise

    //Message digest

    console.log(process.env.BASEURL + '/Content/MessageDigest.aspx')
    await page.goto(process.env.BASEURL + '/Content/MessageDigest.aspx', pageOptions)

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_txtBoxMsg', selectorOptions)

    await page.type('#ctl00_BodyContentPlaceholder_txtBoxMsg','test')

    await page.waitForSelector('#ctl00_BodyContentPlaceholder_btnDigest', selectorOptions)
    await page.click('#ctl00_BodyContentPlaceholder_btnDigest')

    await navigationPromise

    //Close

    await browser.close()

    // Script started stalling at the end on azure. putting this hear hoping that these "await"'s complete
    process.exit(0)
  }
})()
