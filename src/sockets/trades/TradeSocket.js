import { WebSocket } from "ws";
import { headers } from "../../config.js";
import { Socket } from "../Socket.js";
import { terminateScript } from "../../utils.js";
import { OnMessage } from "./listeners/OnMessage.js";
import { Heartbeat } from "./jobs/Heartbeat.js";

export class TradeSocket extends Socket {
    constructor(epic, demo=false) {
        super(demo);
        this.epic = epic;
        this.ws = null;
        this.onMessageListener = null;
        this.listeners = [];
    }

    connect() {
        try {
            this.ws = new WebSocket(this.wsURL(), {headers});
            this.onMessageListener = new OnMessage(this.ws, this.authMessage(), this.epic);

            this.ws.on('open', () => this.#onOpen());
            this.ws.on('message', (data) => this.#onMessage(data));
            this.ws.on('error', (error) => this.#onError(error));
            this.ws.on('close', () => this.#onClose());
        } catch (error) {
            terminateScript(`❌ Error during WebSocket setup: ${error.message}`);
        }
    }

    #onOpen() {
        console.log('✅ Connected to WebSocket');
        new Heartbeat(this.ws).execute();
    }

    #onMessage(data) {
        const { marketPrice, sentimentPercent } = this.onMessageListener.execute(data.toString());

        if (marketPrice !== null || sentimentPercent !== null) {
            this.listeners.forEach((resolve) => resolve({ marketPrice, sentimentPercent }));
            this.listeners = [];
        }
    }

    #onError(error) {
        terminateScript(`❌ WebSocket Error: ${error.message}`);
    }

    #onClose() {
        terminateScript('Connection was closed, exiting...');
    }

    async *dataStream() {
        while (true) {
            yield await new Promise((resolve) => this.listeners.push(resolve));
        }
    }
}