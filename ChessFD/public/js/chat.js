let socket = io();

const form = document.querySelector('form');
const input = document.querySelector('input');
let roomNameText = document.getElementById('roomName').innerHTML;
let roomName = roomNameText.slice(6);
//let userName = document.getElementById('username').innerHTML;
let mensajes = document.getElementById('chatList');
let name = document.getElementById('username').innerHTML;

socket.emit('join-room', name, roomName);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (input.value) {
        socket.emit('chat', input.value, roomName);
        input.value = '';
    }
});

socket.on('chat', (data) => {
    appendMessage(data.name + ": " + data.msg);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('join', (msg) => {
    appendMessage(msg);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user-disconnected', name => {
    appendMessage(name);
});

function appendMessage(msg) {
    let item = document.createElement('li');
    item.textContent = msg;

    let usernameMsg = msg.split(': ');
    if (name == usernameMsg[0]) {
        item.className = 'liSelfMsg';
        item.textContent = usernameMsg[1] + " :" + usernameMsg[0];
    }
    
    mensajes.appendChild(item);
}