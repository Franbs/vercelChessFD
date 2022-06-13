let socket = io();

let roomName = "playersRoom";
let name = document.getElementById('username').innerHTML;
let mensajes = document.getElementById('chatList');
let opponent;

socket.emit('show-user', name, roomName);

socket.on('join', (msg) => {
    appendMessage(msg);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user-disconnected', msg => {
    let usernameMsg = msg.split(' ');
    
    document.getElementById(usernameMsg[0]).remove();
});

socket.on('chat', (data) => {
    appendMessage(data.name + ": " + data.msg);
    window.scrollTo(0, document.body.scrollHeight);
});

function setOpponent() {
    var form_elements = document.getElementById('form').elements;
    var selected = form_elements['gender'].value;
    opponent = selected;
    let newGame = new Game({ player1: name, player2: opponent});
    newGame.save();
}

setInterval(function() {
    
}, 1000);

function appendMessage(msg) {
    let item = document.createElement('input');
    item.setAttribute("type", "radio");
    item.setAttribute("name", "users");

    let usernameMsg = msg.split(': ');
    item.id = usernameMsg[0];

    item.setAttribute("value", usernameMsg[0]);
    let label = document.createElement('label');
    label.setAttribute("for", usernameMsg[0]);
    label.classList.add("radioBtn");
    label.innerHTML = usernameMsg[0];
    
    mensajes.appendChild(item);
    mensajes.appendChild(label);
    item.appendChild(link);
}