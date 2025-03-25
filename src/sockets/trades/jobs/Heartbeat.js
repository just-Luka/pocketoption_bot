export class Heartbeat {
    constructor(ws) {
        this.ws = ws;
    }

    execute() {
        setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            console.log(`[${timeString}] ⏳ Running scheduled PS`);

            this.ws.send('42["ps"]');

        }, 60_000);
    }
}