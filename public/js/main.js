const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message =>{
    console.log(message);
    outputMessage(message);
});

//Listens for Message Submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //Gets Message from HTML Form
    const msg = e.target.elements.msg.value;

    //Sends message to server
    socket.emit('chatMessage', msg);
})

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 
        `<p class="meta">Brad <span>9:12pm</span></p>
        <p class="text">
            ${message}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
}