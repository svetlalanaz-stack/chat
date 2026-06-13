import './styles.css';
import WebSocketClient from './js/WebSocketClient';
import Chat from './js/Chat';

const wsClient = new WebSocketClient('ws://localhost:3000');
const chat = new Chat(wsClient);

const joinBtn = document.getElementById('joinBtn');
const nicknameInput = document.getElementById('nicknameInput');

joinBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
        alert('Введите никнейм');
        return;
    }
    chat.join(nickname);
});

nicknameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinBtn.click();
    }
});


const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
    chat.sendMessage(messageInput.value);
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});