<br>
<br>
<table>
  <tr>
    <td><img src="https://just-luka.github.io/pocketoption.png" width="500" alt="pocketoption"></td>
    <td><img src="https://just-luka.github.io/x-mark-512.png" width="45" alt="X"></td>
    <td><img src="https://just-luka.github.io/nodejs.png" width="180" alt="nodejs"></td>
  </tr>
</table>


# Pocketoption WebSockets for Trading Automation.

This project provides access to real-time market prices, sentiment data, chats, and other trading-related events.

**Note:** Since the platform employs advanced analytics to track user behavior, to prevent potential account suspensions, 
ensure that your `config.js` file is correct and that the provided data accurately matches your account details.
> Please avoid **FALSE** requests

### Installation
Clone the project via Git:
```
git clone https://github.com/just-Luka/pocketoption_bot.git
```

### Configuration
1. Use `config-example.js`, rename it to `config.js`.
2. Specify the `wsUrlReal` (WS) cluster for your real account. Several options are available based on your location:
   - (EU)`wss://api-eu.po.market/socket.io/?EIO=4&transport=websocket`
   - (MSK)`wss://api-msk.po.market/socket.io/?EIO=4&transport=websocket`
   - (SPB)`wss://api-spb.po.market/socket.io/?EIO=4&transport=websocket`
   - (US-N)`wss://api-us-north.po.market/socket.io/?EIO=4&transport=websocket`
   - (US-S)`wss://api-us-south.po.market/socket.io/?EIO=4&transport=websocket`
3. Specify your `authMessageDemo` and `authMessageReal` for authentication.
4. Specify `User-Agent`.

### Stream (Demo Account)
```js
import { TradeSocket } from "./src/sockets/trades/TradeSocket.js";

const tradeSocket = new TradeSocket('#BA_otc', true);
await tradeSocket.connect();
```

### Stream (Real Account)
```js
import { TradeSocket } from "./src/sockets/trades/TradeSocket.js";

const tradeSocket = new TradeSocket('#BA_otc', false);
await tradeSocket.connect();
```

### Example

`index.js`
```js
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
```

### Run

```
node index.js <epic>
```

Example: `node index.js #BA_otc`

Or use Docker with the epic passed as an argument.
<br>
<br>
<br>
If this project was useful for someone.
<br>
TRON (TRC20) `TDXMLzNVoXQweGRf4fcKH79zzRuJMCS831`

