const { expect } = require('@playwright/test');

class OrdersReviewPage {
    constructor(page) {
        this.page = page;

        // Selectors
        this.country = page.locator("[placeholder*='Select Country']");
        this.dropdown = page.locator(".ta-results");
        this.emailId = page.locator(".user__name [type='text']");
        this.submit = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async searchCountryAndSelect(countryCode, countryName) {
        await this.country.type(countryCode,{delay:100});
        await this.dropdown.waitFor();
        const optionCount = await this.dropdown.locator('button').count();
        for (let i = 0; i < optionCount; i++) {
            const text = await this.dropdown.locator("button").nth(i).textContent();
            if (text.trim() === countryName) {
                await this.dropdown.locator("button").nth(i).click();
                break;
            }
        }
    }

    async VerifyEmailId(username) {
        await expect(this.emailId).toHaveText(username);
    }

    async SubmitAndGetOrderId() {
        await this.submit.click();
        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        // Wait for the order confirmation text to be visible and extract the order ID
        return await this.orderId.textContent();
    }
}

module.exports = {OrdersReviewPage};