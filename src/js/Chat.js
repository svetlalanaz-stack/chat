export default class Chat {
    constructor(wsClient) {
        this.wsClient = wsClient;
        this.nickname = null;
        this.messagesArea = document.getElementById('messagesArea');
        this.usersList = document.getElementById('usersList');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');

        this.init();
    }

    init() {
        this.wsClient.onOpen = () => {
            console.log('WebSocket connected');
        };

        this.wsClient.onMessage = (message) => {
            this.handleMessage(message);
        };

        this.wsClient.onClose = () => {
            console.log('WebSocket disconnected');
            this.showError('Соединение разорвано. Обновите страницу.');
        };

        this.wsClient.onError = (error) => {
            console.error('WebSocket error:', error);
            this.showError('Ошибка соединения');
        };

        this.wsClient.connect();
    }

    join(nickname) {
        this.nickname = nickname;
        this.wsClient.send({
            type: 'join',
            nickname: nickname
        });
    }

    sendMessage(text) {
        if (!text.trim()) return;
        this.wsClient.send({
            type: 'message',
            text: text.trim()
        });
        this.messageInput.value = '';
    }

    handleMessage(message) {
        switch (message.type) {
            case 'joined':
                this.onJoined(message);
                break;
            case 'error':
                this.onError(message);
                break;
            case 'users':
                this.updateUsersList(message.users);
                break;
            case 'message':
                this.addMessage(message);
                break;
            default:
                break;
        }
    }

    onJoined(message) {
        if (message.nickname === this.nickname) {
            // Вход выполнен успешно
            document.getElementById('nicknameModal').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'flex';
            this.messageInput.disabled = false;
            this.sendBtn.disabled = false;
            this.updateUsersList(message.users);
        }
    }

    onError(message) {
        this.showError(message.message);
    }

    updateUsersList(users) {
        this.usersList.innerHTML = '';
        for (const user of users) {
            const userEl = document.createElement('div');
            userEl.className = 'user-item';
            userEl.textContent = user;
            this.usersList.append(userEl);
        }
    }

    addMessage(message) {
        const isOwn = message.nickname === this.nickname;
        const messageEl = document.createElement('div');
        messageEl.className = `message ${isOwn ? 'message-own' : 'message-other'}`;

        const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = isOwn ? `Вы (${time})` : `${message.nickname} (${time})`;

        const text = document.createElement('div');
        text.className = 'message-text';
        text.textContent = message.text;

        messageEl.append(header, text);
        this.messagesArea.append(messageEl);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }

    showError(errorMessage) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = errorMessage;
            setTimeout(() => {
                errorDiv.textContent = '';
            }, 3000);
        } else {
            alert(errorMessage);
        }
    }
}