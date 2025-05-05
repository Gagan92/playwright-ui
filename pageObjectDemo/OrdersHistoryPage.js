
class OrdersHistoryPage {
    constructor(page) {
        this.page = page;
        this.orderTable = page.locator('tbody'); 
        this.rows = page.locator('tbody tr');
        this.orderIdDetails = page.locator('.col-text');
    }

    async searchOrderAndSelect(orderId) {
        await this.orderTable.waitFor();
        const rowCount = await this.rows.count();
        for (let i = 0; i < rowCount; i++) {
            const tableOrderId = await this.rows.nth(i).locator('th').textContent();
            if (orderId.includes(tableOrderId)) {
                await this.rows.nth(i).locator('button').first().click();
                break;
            }
        }
    }

    async getOrderId() {
       return await this.orderIdDetails.textContent();
    }
}

module.exports = {OrdersHistoryPage};