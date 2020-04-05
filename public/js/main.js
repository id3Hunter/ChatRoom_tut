const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Listens for Message Submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //Gets Message from HTML Form
    const msg = e.target.elements.msg.value;

    //Sends message to server
    socket.emit('chatMessage', msg);

    //Clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus;

    
})

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 
        `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
}