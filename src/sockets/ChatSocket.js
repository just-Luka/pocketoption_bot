import { WebSocket } from "ws";
import { headers, wsChatUrl } from "../config.js";
import { terminateScript } from "../utils.js";

export class ChatSocket {
    constructor() {
        this.ws = null;
    }

    connect() {
        try {
            this.ws = new WebSocket(wsChatUrl, {headers});

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
    }

    #onMessage(data) {
        // Messages
    }

    #onError(error) {
        terminateScript(`❌ WebSocket Error: ${error.message}`);
    }

    #onClose() {
        terminateScript('Connection was closed, exiting...');
    }
}