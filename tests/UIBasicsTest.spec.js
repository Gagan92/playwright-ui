const{test}= require('@playwright/test')
const{expect}= require('@playwright/test')

test('Check Credentials Test', async({page})=>{
const userName= page.locator('#username');
const password= page.locator('#password');
const signInBtn = page.locator("#signInBtn")

await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
await userName.fill('rahulshettyacademy');
await password.fill('learning');
await signInBtn.click();      

await page.waitForLoadState('networkidle');
await page.locator('.card-body a').nth(0).textContent();
console.log(await page.locator('.card-body a').first().textContent());
});


test('Validate UI Elements',async ({page})=>{
const userName= page.locator('#username');
const password= page.locator('#password');

const dropdown = page.locator('select.form-control');
const radioBtn = page.locator('.radiotextsty');
const okayBtn = page.locator('#okayBtn');
const checkBox = page.locator('#terms');
const documentLink = page.locator("[href*='documents-request']");

await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
await userName.fill('rahulshettyacademy');
await password.fill('learning');

await dropdown.selectOption('consult');
await radioBtn.last().click();
await okayBtn.click();
await checkBox.click();

expect(await radioBtn.first().isChecked()).toBeFalsy();
expect(await radioBtn.last().isChecked()).toBeTruthy();
expect(await dropdown.first().isDisabled()).toBeFalsy();
await expect(checkBox).toBeChecked();

await(expect(documentLink).toHaveAttribute('class','blinkingText'));   
});


test.only('Handling New Pages',async ({browser})=>{
const context = await browser.newContext();
const page = await context.newPage();
const documentLink = page.locator("[href*='documents-request']");

await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click()
]);

console.log(newPage.title());
const txt = await newPage.locator('.red').textContent();

const arraytxt = txt.split('@');
console.log(arraytxt[1].split(' ')[0]);

});