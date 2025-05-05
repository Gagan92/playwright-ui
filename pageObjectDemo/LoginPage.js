class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#userEmail'); // Replace with the actual selector
        this.passwordInput = page.locator('#userPassword'); // Replace with the actual selector
        this.loginButton = page.locator("[value='Login']"); // Replace with the actual selector
    }

    async goTo(url) {
        await this.page.goto(url);
    }

    async enterUsername(username) {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle'); // Wait for the page to load after login
    }
}

module.exports = {LoginPage};