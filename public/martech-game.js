console.log("Client Setup...");

// const socket = io("http://localhost:8080");

// // When user connects to the server
// socket.on('connect', () => {
//     console.log("Connected with identifier : " + socket.id);
//     //
//     // receive a message from the server
//     socket.on("user-connected", (...args) => {
//         // ...
//         console.log(args);
//     });
// });

// function SendCustomClientEvent() {
//     // send a message to the server
//     socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
// }

// document.addEventListener('keydown', e => {
//     if (e.target.matches('input')) return;
//     //
//     if (e.key === 's') SendCustomClientEvent();
//     // if (e.key === 'c') socket.connect();
//     // if (e.key === 'd') socket.disconnect();
// });

function SetupWordContainer() {
    for (let index = 0; index < 6; index++) {
        for (let secIndex = 0; secIndex < 6; secIndex++) {
            const wordCell = document.createElement("div");
            wordCell.className = "outline outline-2 flex justify-center items-center";
            wordCell.textContent = 0;
            document.getElementById("word-container").appendChild(wordCell);
        }
    }
}

function SetupKeyboardContainer() {
    const chars = ['e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i',
        'z', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'];
    // Enter & Delete Buttons
    for (let index = 0; index < chars.length; index++) {
        const keyCell = document.createElement("div");
        keyCell.className = "outline outline-2 flex justify-center items-center";
        keyCell.textContent = chars[index];
        document.getElementById("key-container").appendChild(keyCell);
    }
}

SetupWordContainer();
SetupKeyboardContainer();
