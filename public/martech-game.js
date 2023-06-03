console.log("Client Setup...");

document.getElementById("play-button").addEventListener('click', () => {
    // Name Input Validation
    let playerNameInput = document.getElementById("player-input");
    let formattedInput = playerNameInput.value.trim().replace(/[^a-z0-9]/gi, '');
    if (formattedInput.length < 3 || formattedInput.length > 20) {
        playerNameInput.value = "";
        window.alert("Invalid player name");
        return;
    }
    // Socket Server Connection
    const socket = io("http://localhost:8080", {
        query: { playerName: formattedInput }
    });
    // Player Connection 
    socket.on('connect', () => {
        socket.playerName = formattedInput;
        //
        socket.on('player-container-update', (socketArray) => {
            SetupPlayerContainer(socketArray);
        });
        //
        RegisterKeyAction(socket);
        //
        SetupWordContainer();
        SetupKeyboardContainer();
        SetupPlayerContainer();
        SetupNotificationContainer("Waiting For Action");
    });
    socket.on('connect_error', error => {
        window.alert(error);
        document.getElementById("play-button").remove();
    });
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

function SendPlayerAction(socket, key) {
    console.log("Client : Emit :", key);
    socket.emit("player-action", socket.playerName, key);
};
//
function RegisterKeyAction(socket) {
    document.addEventListener('keydown', e => {
        if (e.target.matches('input')) return;

        // Alphabet Key Press
        let pressedKey = e.key.toLocaleLowerCase();
        for (let keyIndex = 0; keyIndex < document.getElementById("key-container").children.length; keyIndex++) {
            const keyButton = document.getElementById("key-container").children[keyIndex];
            //
            if (pressedKey === keyButton.innerText) SendPlayerAction(socket, pressedKey);
        }

        // Enter Key Press
        if (pressedKey === "enter") SendPlayerAction(socket, pressedKey);

        // Delete Key Press
        if (pressedKey === "backspace" || pressedKey === "delete") SendPlayerAction(socket, pressedKey);

    });
}

//#endregion
