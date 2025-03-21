export class Heartbeat {
    constructor(ws) {
        this.ws = ws;
    }

    /**
     * This function adds two numbers together.
     * @returns {void} The sum of a and b.
     */
    execute() {
        setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            console.log(`[${timeString}] ⏳ Running scheduled PS`);

            this.ws.send('42["ps"]');

        }, 60_000);
    }
}