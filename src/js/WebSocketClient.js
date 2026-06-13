export default class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.onMessage = null;
        this.onOpen = null;
        this.onClose = null;
        this.onError = null;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            if (this.onOpen) this.onOpen();
        };

        this.ws.onmessage = (event) => {
            if (this.onMessage) {
                const data = JSON.parse(event.data);
                this.onMessage(data);
            }
        };

        this.ws.onclose = () => {
            if (this.onClose) this.onClose();
        };

        this.ws.onerror = (error) => {
            if (this.onError) this.onError(error);
        };
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}