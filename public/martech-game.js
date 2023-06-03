console.log("Client Setup...");

document.getElementById("play-button").addEventListener('click', () => {
    let playerNameInput = document.getElementById("player-input");
    if (!playerNameInput.checkValidity()) return;

    // Socket Server Connection
    const socket = io("http://localhost:8080");
    // Player Connection 
    socket.on('connect', () => {
        socket.on('player-container-update', (socketArray) => {
            SetupPlayerContainer(socketArray);
        });
        //
        window.SendCustomPlayerAction = function (socketId, key) {
            console.log("Client : Emit :", key);
            socket.emit("player-action", socketId, key);
        };
        RegisterKeyAction(socket);
    });
    // Stateless Connection
    SetupWordContainer();
    SetupKeyboardContainer();
    SetupPlayerContainer();
    SetupNotificationContainer("Waiting For Action");
});

//#region  CONTAINER

// STATELESS WORD CONTAINER
function SetupWordContainer() {
    for (let index = 0; index < 6; index++) {
        const wordRowGrid = document.createElement("div");
        wordRowGrid.style = "display: grid; grid-template-columns: repeat(5, 1fr); grid-gap: 10px;";
        //
        for (let secIndex = 0; secIndex < 5; secIndex++) {
            const wordCell = document.createElement("div");
            wordCell.style = "width:64px; height: 64px;";
            wordCell.classList = "bg-dark flex justify-center items-center outline outline-2 outline-accentgray"
            wordCell.textContent = "-";
            wordRowGrid.appendChild(wordCell);
        }
        //
        document.getElementById("word-container").appendChild(wordRowGrid);
    }
}
// STATELESS KEYBOARD CONTAINER
function SetupKeyboardContainer() {
    document.getElementById("key-container").innerHTML = '';
    //
    const chars = ['e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i',
        'z', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'];
    //
    for (let index = 0; index < chars.length; index++) {
        const keyCell = document.createElement("button");
        keyCell.className = "bg-dark outline outline-2 outline-accentgray rounded-lg";
        keyCell.style = "width:54px; height: 54px;";
        keyCell.textContent = chars[index];
        document.getElementById("key-container").appendChild(keyCell);
    }
}
// STATELESS PLAYER CONTAINER
function SetupPlayerContainer(socketArray) {
    document.getElementById("player-container").innerHTML = '';
    //
    if (socketArray) {
        for (let index = 0; index < socketArray.length; index++) {
            const keyCell = document.createElement("div");
            keyCell.className = "w-4/5 outline outline-2 flex justify-center items-center rounded-lg p-2";
            keyCell.textContent = socketArray[index];
            document.getElementById("player-container").appendChild(keyCell);
        }
    }
}
// STATELESS NOTIFICATION CONTAINER
function SetupNotificationContainer(notificationText) {
    document.getElementById("notification-container").innerHTML = '';
    //
    const keyCell = document.createElement("div");
    keyCell.className = "";
    keyCell.textContent = notificationText;
    document.getElementById("notification-container").appendChild(keyCell);
}
// STATELESS SERVER CONTAINER
const serverNotificationArray = [];
function ReceiveServerNotification(serverNotification) {
    document.getElementById("server-container").innerHTML = '';
    //
    const notificationLine = document.createElement("li");
    notificationLine.className = "";
    notificationLine.textContent = serverNotification;
    serverNotificationArray.push(notificationLine);
    //
    let totalNotificationChars = 0;
    for (let index = 0; index < serverNotificationArray.length; index++) {
        let notifLength = serverNotificationArray[index].innerText.length;
        totalNotificationChars += notifLength;
    }
    if (totalNotificationChars > 250) serverNotificationArray.shift();
    console.log(totalNotificationChars)
    //
    for (let index = 0; index < serverNotificationArray.length; index++) {
        document.getElementById("server-container").appendChild(serverNotificationArray[index]);
    }
}

//#endregion

//#region LISTENERS

function RegisterKeyAction(socket) {
    document.addEventListener('keydown', e => {
        if (e.target.matches('input')) return;

        // Alphabet Key Press
        let pressedKey = e.key.toLocaleLowerCase();
        for (let keyIndex = 0; keyIndex < document.getElementById("key-container").children.length; keyIndex++) {
            const keyButton = document.getElementById("key-container").children[keyIndex];
            //
            if (pressedKey === keyButton.innerText) SendCustomPlayerAction(socket.id, pressedKey);
        }

        // Enter Key Press
        if (pressedKey === "enter") SendCustomPlayerAction(socket.id, pressedKey);

        // Delete Key Press
        if (pressedKey === "backspace" || pressedKey === "delete") SendCustomPlayerAction(socket.id, pressedKey);

    });
}

//#endregion
