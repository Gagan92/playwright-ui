const{test}= require('@playwright/test')
const{expect}= require('@playwright/test')
let webContext;

test.beforeAll(async({browser})=>{
    const email = 'anshika@gmail.com';

    // creating context level since settings needs to be stored as browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();

    await page.waitForLoadState('networkidle');
    await context.storageState({path: 'state.json'});

    webContext = await browser.newContext({storageState:'state.json'});
})

test('Web Client App Login', async()=>{
    const email = 'anshika@gmail.com';
    const productName = 'ZARA COAT 3';

    const page = await webContext.newPage();

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

    // await page.goto("https://rahulshettyacademy.com/client");
    // await page.locator("#userEmail").fill(email);
    // await page.locator("#userPassword").fill("Iamking@000");
    // await page.locator("[value='Login']").click();

    await page.goto("https://rahulshettyacademy.com/client");
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