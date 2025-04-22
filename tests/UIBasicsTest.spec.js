const{test}= require('@playwright/test')
const{expect}= require('@playwright/test')

test.only('validate credentials', async({page})=>{
const userName= page.locator('#username');
const password= page.locator('#password');
const signInBtn = page.locator("#signInBtn")

await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
await userName.fill('rahulshettyacademy');
await password.fill('learning');
await signInBtn.click();        
});


test('Validate UI Elements',async ({page})=>{


});


test('Handling New Pages',async ({page})=>{


});