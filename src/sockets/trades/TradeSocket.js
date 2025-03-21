import { WebSocket } from "ws";
import { headers } from "../../config.js";
import { Socket } from "../Socket.js";
import { terminateScript } from "../../utils.js";
import { OnMessage } from "./listeners/OnMessage.js";
import { Heartbeat } from "./jobs/Heartbeat.js";
import { AlgorithmC1 } from "../../algorithms/AlgorithmC1.js";

export class TradeSocket extends Socket {
    constructor(epic, demo=false) {
        super(demo);

        this.epic = epic;

        this.ws = null;
        this.response = null;
        this.onMessageListener = null;
        this.initBot = null;
    }

    connect() {
        try {
            this.ws = new WebSocket(this.wsURL(), {headers});

            this.onMessageListener = new OnMessage(this.ws, this.authMessage(), this.epic);
            this.initBot = new AlgorithmC1(this.ws, this.epic);

            this.ws.on('open', () => this.onOpen());
            this.ws.on('message', (data) => this.onMessage(data));
            this.ws.on('error', (error) => this.onError(error));
            this.ws.on('close', () => this.onClose());
        } catch (error) {
            terminateScript(`❌ Error during WebSocket setup: ${error.message}`);
        }
    }

    onOpen() {
        console.log('✅ Connected to WebSocket');
        new Heartbeat(this.ws).execute();
        this.#algorithmC1();
    }

    onMessage(data) {
        this.response = this.onMessageListener.execute(data.toString());
    }

    onError(error) {
        terminateScript(`❌ WebSocket Error: ${error.message}`);
    }

    onClose() {
        console.log('🔴 Connection closed');
        terminateScript('Connection was closed, exiting...');
    }

    #algorithmC1() {
        setInterval(() => {
            this.initBot.execute(this.response);
        }, 5000);
    }
}