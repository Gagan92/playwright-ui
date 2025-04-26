const {test, expect, request} = require('@playwright/test');

const { APIUtils } = require('../tests/utils/APIUtils.js');
//{"orders":[{"country":"India","productOrderedId":"67a8df1ac0d3e6622a297ccb"}]}


const loginPayload = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"}
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"67a8df1ac0d3e6622a297ccb"}]}
let response;


test.beforeAll(async () => {

    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext,loginPayload);
    response = await apiUtils.createOrder(orderPayload);
   
});


test.beforeEach(async()=>{

});

test.only("Main Test", async ({page})=>{
   
    page.addInitScript(value=>{
        window.localStorage.setItem('token',value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for(let i=0; i< await rows.count();i++){
        const rowOrderID = await rows.nth(i).locator("th").textContent();
        if(response.orderID.includes(rowOrderID)){
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    const orderDetails = await page.locator(".col-text").textContent();
    expect(response.orderID.includes(orderDetails)).toBeTruthy();


});


test.afterEach(async()=>{

});

test.afterAll(async()=>{

});