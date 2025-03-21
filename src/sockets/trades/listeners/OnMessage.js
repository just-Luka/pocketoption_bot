export class OnMessage {
    constructor(ws, authMessage, epic) {
        this.ws = ws;
        this.authMessage = authMessage;
        this.epic = epic;

        this.sentimentPercents = [];
        this.marketPrices = [];

        this.expectStates = {
            price: false,
            sentiment: false,
            openOrder: false,
            closeOrder: false,
            balanceUpdate: false,
            auth: false,
        };
    }

    async #handleMessageData(message) {
        if (this.expectStates.price) {
            this.#handlePriceData(message);
        } else if (this.expectStates.sentiment) {
            this.#handleSentimentData(message);
        } else if (this.expectStates.openOrder) {
            //KEY is: successopenOrder {"id":"154e9d65-f500-4368-9976-7ca4a0904c82","openTime":"2025-03-21 19:03:25","closeTime":"2025-03-21 19:03:30","openTimestamp":1742583805,"closeTimestamp":1742583810,"uid":84890061,"isDemo":1,"amount":1,"profit":0.92,"percentProfit":92,"percentLoss":100,"openPrice":162.23,"copyTicket":"","closePrice":0,"command":0,"asset":"#BA_otc","requestId":12260952,"openMs":370,"optionType":100,"isCopySignal":false,"currency":"USD"
            console.log(message);
            this.expectStates.openOrder = false;
        } else if (this.expectStates.closeOrder) {
            // KEY is: successcloseOrder {"profit":1.92,"deals":[{"id":"154e9d65-f500-4368-9976-7ca4a0904c82","openTime":"2025-03-21 19:03:25","closeTime":"2025-03-21 19:03:30","openTimestamp":1742583805,"closeTimestamp":1742583810,"uid":84890061,"amount":1,"profit":0.92,"percentProfit":92,"percentLoss":100,"openPrice":162.23,"closePrice":162.27,"command":0,"asset":"#BA_otc","isDemo":1,"copyTicket":"","closeMs":0,"optionType":100,"openMs":370,"currency":"USD","amountUSD":1}]}
            console.log(message);
            this.expectStates.closeOrder = false;
        } else if (this.expectStates.balanceUpdate) {
            // Balance update
        } else if (this.expectStates.auth) {
            this.#subscribeToMarket();
            this.expectStates.auth = false;
        }
    }

    #handlePriceData(message) {
        const priceData = JSON.parse(message);
        const price = priceData[0][2];
        this.marketPrices.push(price);
        this.expectStates.price = false;
    }

    #handleSentimentData(message) {
        const sentimentData = JSON.parse(message);
        const sentimentPercent = sentimentData[0][1];
        this.sentimentPercents.push(sentimentPercent);
        this.expectStates.sentiment = false;
    }

    #setStateBasedOnMessage(key) {
        const handlers = {
            'updateStream': () => this.expectStates.price = true,
            'chafor': () => this.expectStates.sentiment = true,
            'successopenOrder': () => this.expectStates.openOrder = true,
            'successcloseOrder': () => this.expectStates.closeOrder = true,
            'successupdateBalance': () => this.expectStates.balanceUpdate = true,
            'successauth': () => this.expectStates.auth = true,
        };

        if (handlers[key]) {
            handlers[key]();
        }
    }

    #subscribeToMarket() {
        const changeSymbolMessage = `42["changeSymbol",{"asset":"${this.epic}","period":60}]`;
        this.ws.send(changeSymbolMessage);
        console.log('📤 Sent:', changeSymbolMessage);
    
        const subforMessage = `42["subfor","${this.epic}"]`;
        this.ws.send(subforMessage);
        console.log('📤 Sent SubforMessage:', subforMessage);
    }

    #authenticate() {
        this.ws.send(this.authMessage);
        console.log('🔹 Step 4: Sending authentication...');
    }

    execute(message) {
        const key = message.match(/^451-\["([^"]+)/)?.[1];

        if (message.startsWith('0')) {
            console.log('🔹 Step 1: Received handshake, sending "40"...');
            this.ws.send('40');
        } else if (message.startsWith('40')) {
            console.log('🔹 Step 3: Connection confirmed by server');
            this.#authenticate();
        } else if (message === '2') {  
            console.log('🔄 Received "2" (Ping), sending "3" (Pong)...');
            this.ws.send('3');
        } else if (key) {
            console.log('🔴🟢 Received state: ' + key);
            this.#setStateBasedOnMessage(key);
        } else {
            console.log('🎁 Received value');
            this.#handleMessageData(message);
        }

        return {
            'sentimentPercents': this.sentimentPercents,
            'marketPrices': this.marketPrices,
        }
    }
}