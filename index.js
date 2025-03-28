import { TradeSocket } from "./src/sockets/trades/TradeSocket.js";

(async () => {
    const tradeSocket = new TradeSocket('#BA_otc', true);
    tradeSocket.connect();

    for await (const { marketPrice, sentimentPercent } of tradeSocket.dataStream()) {
        console.log("📈 Market Price:", marketPrice, " | 📊 Sentiment:", sentimentPercent);

        // new TradingAlgorithm(marketPrice, sentimentPercent).start();
    }
})();