export class OnMessage {
    constructor(ws, authMessage, epic) {
        this.ws = ws;
        this.authMessage = authMessage;
        this.epic = epic;
        this.expectStates = {
            price: false,
            sentiment: false,
            openOrder: false,
            closeOrder: false,
            balanceUpdate: false,
            auth: false,
        };
        this.latest = {
            sentimentPercent: null,
            marketPrice: null,
        }
    }

    async #handleMessageData(message) {
        if (this.expectStates.price) {
            this.#handlePriceData(message);
        } else if (this.expectStates.sentiment) {
            this.#handleSentimentData(message);
        } else if (this.expectStates.openOrder) {
            console.log("✅ Open Order:", message);
            this.expectStates.openOrder = false;
        } else if (this.expectStates.closeOrder) {
            console.log("✅ Close Order:", message);
            this.expectStates.closeOrder = false;
        } else if (this.expectStates.balanceUpdate) {
            // Balance update
        } else if (this.expectStates.auth) {
            this.#subscribeToMarket();
            this.expectStates.auth = false;
        }
    }

    #handlePriceData(message) {
        try {
            const priceData = JSON.parse(message);
            this.latest.marketPrice = priceData[0][2] ?? null;
            this.expectStates.price = false;
        } catch (error) {
            console.error("❌ Failed to parse price data:", error.message);
        }
    }

    #handleSentimentData(message) {
        try {
            const sentimentData = JSON.parse(message);
            this.latest.sentimentPercent = sentimentData[0][1] ?? null;
            this.expectStates.sentiment = false;
        } catch (error) {
            console.error("❌ Failed to parse sentiment data:", error.message);
        }
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

        if (handlers[key]) handlers[key]();
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

    #resetLatest() {
        this.latest = {
            sentimentPercent: null,
            marketPrice: null,
        }
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
            // console.log('🔴🟢 Received state: ' + key);
            this.#resetLatest();
            this.#setStateBasedOnMessage(key);
        } else {
            this.#handleMessageData(message);
        }

        return this.latest;
    }
}