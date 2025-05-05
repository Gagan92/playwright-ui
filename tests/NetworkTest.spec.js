const {test, expect, request} = require('@playwright/test');

const { APIUtils } = require('./utils/APIUtils.js');
//{"orders":[{"country":"India","productOrderedId":"67a8df1ac0d3e6622a297ccb"}]}


const loginPayload = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"}
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"67a8df1ac0d3e6622a297ccb"}]}
const fakePayloadOrder= {data:[],message:"No Orders"};
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
    

  
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route=>{
            //intercepting the response - API Response->(fakeResponse)->browser-> render data on the front end
            let body= JSON.stringify(fakePayloadOrder);
            const response =  await page.request.fetch(route.request())
            route.fulfill(
            {
                response,
                body,
            }
           )
        }
    )

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

    console.log(await page.locator(".mt-4").textContent());
});


test.afterEach(async()=>{

});

test.afterAll(async()=>{

});