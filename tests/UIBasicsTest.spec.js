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


test('Handling Child Frames',async ({browser})=>{

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
const email = (arraytxt[1].split(' ')[0]);
console.log('Email:'+email);

page.locator("#username").fill(email);
page.locator('#password').fill('learning');
await page.locator('#signInBtn').click();
await page.waitForLoadState('networkidle');

});


test('Web Client App Login', async({page})=>{
    const email = 'anshika@gmail.com';
    const productName = 'ZARA COAT 3';
    const products = page.locator('.card-body');
    const addCardBtn = page.locator("[routerlink*='cart']");
    const checkoutBtn = page.locator("text=Checkout");
    const selectCntry = page.locator("[placeholder*='Select Country']");

    const creditCard = page.locator("input[class*='text-validated']").nth(0);
    const cvv = page.locator(".field.small .input.txt").nth(0);
    const nameonCard = page.locator(".row .field .input.txt").nth(2);
    const cardExpiryDay = page.locator(".field.small .input.ddl").nth(0);
    const cardExpiryMonth = page.locator(".field.small .input.ddl").nth(1);

    const coupon = page.locator("input[name*='coupon']");
    const applyCoupon = page.locator(".btn.btn-primary.mt-1");

    const placeOrderBtn = page.locator(".action__submit");

    const orderCode = page.locator(".em-spacer-1 .ng-star-inserted");

    const ordersbutton = page.locator("button[routerlink*='myorders']");

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();

    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();

    const count = await products.count();
    for(let i=0;i<count;i++){
        if(await products.nth(i).locator("b").textContent()===productName){
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await addCardBtn.click();

    await page.locator("div li").first().waitFor();
    const isPresent = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(isPresent).toBeTruthy();

    await checkoutBtn.click();

    await selectCntry.pressSequentially('India');

    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();

    const optionCnt = await dropdown.locator('button').count();

    for(let i=0;i<optionCnt;i++){
        const text = await dropdown.locator("button").nth(i).textContent();
        if(text===" India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    expect(await page.locator(".user__name [type='text']").first().textContent()).toContain(email);

    await creditCard.fill("4242 4242 4242 4242");
    await cvv.fill("123");
    await nameonCard.fill("Gagan");
    await cardExpiryDay.selectOption('12');
    await cardExpiryMonth.selectOption('12');
    await coupon.fill('rahulshettyacademy');
    await applyCoupon.click();
    await placeOrderBtn.click();

    expect(await page.locator(".hero-primary").textContent()).toContain(" Thankyou for the order. ");
    const orderId = await orderCode.textContent();

    await ordersbutton.click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");

    for(let i=0; i< await rows.count();i++){
        const tableorderId = await rows.nth(i).locator('th').textContent();
        if(orderId.includes(tableorderId)){
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }
})


test('Playwright Special Characters', async ({page})=>{
   await page.goto("https://rahulshettyacademy.com/angularpractice/") 
   await page.getByLabel("Check me out if you Love IceCreams").check();;
   await page.getByLabel("Employed").check();
   await page.getByLabel("Gender").selectOption("Female");

   await page.getByPlaceholder("Password").fill("12345678");
   await page.getByRole("button",{ name: "Submit"}).click();

   expect(await page.getByText("Success! The form has been submitted successfully!").isVisible()).toBeTruthy();

   await page.getByRole("link",{name: "Shop"}).click();
   await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("Button").click();

})


 test('Check Credential Test Verion 2', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const email = 'anshika@gmail.com';
    const productName = 'ZARA COAT 3';
    const products = page.locator('.card-body');

    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.getByRole('button',{name: 'Login'}).click();

    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();

    await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
        .getByRole("button",{name: "Add to Cart"}).click();

    await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();

    await page.locator("div li").first().waitFor();
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    await page.getByRole("button",{name: "Checkout"}).click();

    await page.getByPlaceholder("Select Country").pressSequentially("Ind");

    await page.getByRole("button",{name:"India"}).nth(1).click();
    await page.getByText("PLACE ORDER").click();

    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
 })


 test("Validate Calendar", async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const MonthNumber = '6';
    const YearNumber = '2023';
    const dayNumber ='15';

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator('.react-date-picker__inputGroup').click();
    await page.locator('.react-calendar__navigation__label').click();
    await page.locator('.react-calendar__navigation__label').click();

    await page.getByText(YearNumber).click();
    await page.locator('.react-calendar__year-view__months__month').nth(Number(MonthNumber)-1).click();
    await page.locator("//abbr[text()='"+dayNumber+"']").click();

    const inputs = await page.locator(".react-date-picker__inputGroup input");
    console.log(await inputs.count());
    for(let i=0;i<await inputs.count();i++){
        const value =inputs[i].getAttribute("value");
        console.log(expectedList[i]);
        expect(value).toEqual(expectedList[i]);
    }

 })

 test('More Validations',async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.waitForLoadState('networkidle');
    await page.locator('#hide-textbox').waitFor();
    await page.locator('#hide-textbox').click();

    await page.locator('#alertbtn').click();
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    })
 })

 test('Validating frmes', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
 });