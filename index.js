import { TradeSocket } from "./src/sockets/trades/TradeSocket.js";

const tradingSocket = new TradeSocket('#BA_otc', true);
tradingSocket.connect();

