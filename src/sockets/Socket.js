import { wsUrlDemo, wsUrlReal, authMessageDemo, authMessageReal } from "../config.js";

export class Socket {
    constructor(demo) {
        this.demo = demo;
    }

    wsURL() {
        return this.demo ? wsUrlDemo : wsUrlReal;
    }

    authMessage() {
        return this.demo ? authMessageDemo : authMessageReal;
    }
}

