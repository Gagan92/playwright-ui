const {test, expect} = require('@playwright/test');
const{PageObjectManager} = require('../pageObjectDemo/PageObjectManager.js');

test('Client App Po', async ({page}) => {
    const pageObjectManager = new PageObjectManager(page);
    
    const loginPage = pageObjectManager.getLoginPage();
    const dashboardPage = pageObjectManager.getDashboardPage();
    const cartPage = pageObjectManager.getCartPage();
    const ordersHistoryPage = pageObjectManager.getOrdersHistoryPage();
    const ordersReviewPage = pageObjectManager.getOrdersReviewPage();

    await loginPage.goTo("https://rahulshettyacademy.com/client/");
    await loginPage.enterUsername("anshika@gmail.com");
    await loginPage.enterPassword("Iamking@000");
    await loginPage.clickLogin();

    await dashboardPage.addToCart("ZARA COAT 3");
    await dashboardPage.navigateToCart();

    await cartPage.VerifyProductIsDisplayed("ZARA COAT 3");
    await cartPage.Checkout();

    await ordersReviewPage.searchCountryAndSelect("Ind", "India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);
    await dashboardPage.navigateToOrders();

    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
}
);