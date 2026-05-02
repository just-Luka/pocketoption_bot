import { WebSocket } from "ws";

export class Heartbeat {
    constructor(ws) {
        this.ws = ws;
        this.intervalId = null;
    }

    execute() {
        this.intervalId = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            console.log(`[${timeString}] ⏳ Running scheduled PS`);

            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send('42["ps"]');
            }
        }, 60_000);
    }

    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
