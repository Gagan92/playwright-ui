class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload
    }

    async getToken() {
        const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: this.loginPayload
        });

        // Use response.json() to parse the response body
        const responseBody = await loginResponse.json();

        // Access the token from the response body
        let token = await responseBody.token;
        console.log('Token:', token);
        return token;

    }

    async createOrder(orderPayload) {
        let response={};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                },
            }
        )
        const orderResponseJson = await orderResponse.json();
        const orderID = await orderResponseJson.orders[0];
        console.log('Order ID:' + orderID);
        response.orderID=orderID;
        return response;

    }
}

module.exports = { APIUtils };