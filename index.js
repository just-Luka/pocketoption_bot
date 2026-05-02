import { TradeSocket } from "./src/sockets/trades/TradeSocket.js";

(async () => {
    const epic = process.argv[2];
    if (!epic) {
        console.error('Usage: node index.js <epic>');
        process.exit(1);
    }
    const tradeSocket = new TradeSocket(epic, true);

    await tradeSocket.connect();
    const ws = tradeSocket.getWS();

    for await (const { marketPrice, sentimentPercent } of tradeSocket.dataStream()) {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        console.log(`[${timeStr}] 📈 Market Price: ${marketPrice} | 📊 Sentiment: ${sentimentPercent}`);
        // NewTradingAlgorithm(marketPrice, sentimentPercent, epic, ws);
    }
})();