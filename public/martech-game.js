console.log("Client Setup...");

document.getElementById("play-button").addEventListener('click', () => {
    // Name Input Validation
    let playerNameInput = document.getElementById("player-input");
    let formattedInput = playerNameInput.value.trim().replace(/[^a-z0-9]/gi, '');
    if (formattedInput.length < 3 || formattedInput.length > 16) {
        playerNameInput.value = "";
        window.alert("Invalid player name");
        return;
    }
    document.getElementById("notification-container").innerHTML = '';
    // Socket Server Connection
    const socket = io("http://localhost:8080", {
        query: { playerName: formattedInput }
    });
    // const socket = io("https://ahmetahaydemir-dev.ey.r.appspot.com/", {
    //     query: { playerName: formattedInput }
    // });

    // Player Connection 
    socket.on('connect', () => {
        socket.playerName = formattedInput;
        wordAuthToken = socket.wordAuthToken;
        console.log("Client : Init : " + socket.id + " : " + socket.playerName);
        //
        document.getElementById("panel-seperator").style.visibility = "visible";
        SetupWordContainer();
        SetupKeyboardContainer();
        //
        socket.on('player-container-update', (socketArray, currentScoreResult, currentSocketId, currentSocketName) => {
            wordAuthToken = (currentSocketId === socket.id);
            SetupPlayerContainer(socketArray, currentSocketName, currentScoreResult);
        });
        //
        socket.on('word-container-state', (currentWordState, currentGuessResult, currentSocketId, currentSocketName, currentCharacterIndex) => {
            UpdateWordContainer(currentWordState, currentGuessResult);
            wordAuthToken = (currentSocketId === socket.id);
            wordStartingIndex = currentCharacterIndex;
        });
        //
        socket.on('notification-container-update', (notificationText, notificationOwner, notificationFocus) => {
            if (notificationFocus) {
                SetupNotificationContainer(notificationText, notificationOwner);
            } else {
                ReceiveServerNotification(notificationText, notificationOwner);
            }
        });
        //
        RegisterKeyAction(socket);
    });
    socket.on('connect_error', error => {
        window.alert(error);
        document.getElementById("play-button").remove();
    });
});

//#region CONTAINER

// STATELESS WORD CONTAINER
const wordCharacterArray = [];
const wordTargetLength = 6;
let wordStartingIndex = 0;
let wordAuthToken = false;
function SetupWordContainer() {
    document.getElementById("word-container").innerHTML = '';
    //
    for (let index = 0; index < wordTargetLength; index++) {
        const wordRowGrid = document.createElement("div");
        wordRowGrid.style = "display: grid; grid-template-columns: repeat(6, 1fr); grid-gap: 15px;";
        //
        for (let secIndex = 0; secIndex < wordTargetLength; secIndex++) {
            const wordCell = document.createElement("div");
            wordCell.style = "width:64px; height: 64px; font-size: 3rem;";
            wordCell.className = "bg-dark antialiased flex justify-center items-center outline outline-offset-2 outline-2 outline-accentgray"
            wordCell.textContent = "";
            wordRowGrid.appendChild(wordCell);
            wordCharacterArray.push(wordCell);
        }
        //
        document.getElementById("word-container").appendChild(wordRowGrid);
    }
}
function UpdateWordContainer(currentWordState, currentGuessResult) {
    let iteratorIndex = 0;
    for (let index = 0; index < wordTargetLength; index++) {
        //
        for (let secIndex = 0; secIndex < wordTargetLength; secIndex++) {
            if (currentWordState.length > iteratorIndex) {
                wordCharacterArray[iteratorIndex].textContent = currentWordState[iteratorIndex];
                //
                if (currentGuessResult.length > iteratorIndex) {
                    wordCharacterArray[iteratorIndex].classList.remove("bg-dark");
                    //
                    switch (currentGuessResult[iteratorIndex]) {
                        case 2:
                            wordCharacterArray[iteratorIndex].classList.add("bg-green");
                            break;
                        case 1:
                            wordCharacterArray[iteratorIndex].classList.add("bg-yellow");
                            break;
                        case 0:
                            wordCharacterArray[iteratorIndex].classList.add("bg-accentgray");
                            break;
                    }
                }
            } else {
                wordCharacterArray[iteratorIndex].textContent = "";
                wordCharacterArray[iteratorIndex].classList.remove("bg-green");
                wordCharacterArray[iteratorIndex].classList.remove("bg-yellow");
                wordCharacterArray[iteratorIndex].classList.remove("bg-accentgray");
                wordCharacterArray[iteratorIndex].classList.add("bg-dark");
            }
            //
            iteratorIndex++;
        }
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
        keyCell.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
        keyCell.style = "width:54px; height: 54px; font-size: 2rem;";
        keyCell.textContent = chars[index];
        document.getElementById("key-container").appendChild(keyCell);
    }
}
// STATELESS PLAYER CONTAINER
function SetupPlayerContainer(socketArray, currentSocketName, currentScoreResult) {
    document.getElementById("player-container").innerHTML = '';
    //
    let highestScore = 1;
    let lowestScore = 999999;
    for (let index = 0; index < currentScoreResult.length; index++) {
        if (currentScoreResult[index] > highestScore) highestScore = currentScoreResult[index];
        if (currentScoreResult[index] < lowestScore) lowestScore = currentScoreResult[index];
    }
    //
    if (socketArray) {
        for (let index = 0; index < socketArray.length; index++) {
            const keyCell = document.createElement("li");
            //
            if (socketArray[index] === currentSocketName) {
                keyCell.className = "w-4/5 bg-darkgray flex justify-center items-center text-center outline outline-red rounded-lg p-2";
            } else {
                keyCell.className = "w-4/5 bg-dark flex justify-center items-center p-2";
            }
            //
            if (currentScoreResult[index] === highestScore) {
                keyCell.innerHTML = socketArray[index] + "&nbsp;->&nbsp;<p style=font-size:1.6rem; class=text-green>" + currentScoreResult[index];
            } else if (currentScoreResult[index] === lowestScore) {
                keyCell.innerHTML = socketArray[index] + "&nbsp;->&nbsp;<p style=font-size:1.3rem; class=text-red>" + currentScoreResult[index];
            } else {
                keyCell.innerHTML = socketArray[index] + "&nbsp;->&nbsp;<p style=font-size:1.45rem; class=text-yellow>" + currentScoreResult[index];
            }
            //
            document.getElementById("player-container").appendChild(keyCell);
        }

    }
}
// STATELESS NOTIFICATION CONTAINER
function SetupNotificationContainer(notificationText, notificationOwner) {
    document.getElementById("notification-container").innerHTML = '';
    //
    const keyCell = document.createElement("div");
    keyCell.className = "text-center antialiased";
    keyCell.style = "font-size: 1.5rem;";
    keyCell.innerHTML = notificationText + "<br/><br/><p class=text-red>" + notificationOwner;
    document.getElementById("notification-container").appendChild(keyCell);
}
// STATELESS SERVER CONTAINER
const serverNotificationArray = [];
function ReceiveServerNotification(notificationText, notificationOwner) {
    document.getElementById("server-container").innerHTML = '';
    //
    const notificationLine = document.createElement("li");
    notificationLine.className = "w-full list-none";
    notificationLine.innerHTML = notificationText + "<br/>" + notificationOwner + "<br/>" + ".";
    serverNotificationArray.push(notificationLine);
    //
    let totalNotificationChars = 0;
    for (let index = 0; index < serverNotificationArray.length; index++) {
        let notifLength = serverNotificationArray[index].innerText.length;
        totalNotificationChars += notifLength;
    }
    if (totalNotificationChars > 125) serverNotificationArray.shift();
    console.log(totalNotificationChars)
    //
    for (let index = 0; index < serverNotificationArray.length; index++) {
        document.getElementById("server-container").appendChild(serverNotificationArray[index]);
    }
}

//#endregion

//#region LISTENERS

function SendWordContainerUpdate(socket, key) {
    socket.emit("word-container-update", socket.id, key);
};
//
function FindCharacterInputTarget() {
    for (let index = 0; index < wordCharacterArray.length; index++) {
        if (wordCharacterArray[index].innerText === '') {
            return index;
        }
    }
    //
    return wordCharacterArray.length;
}
//
function RegisterKeyAction(socket) {
    document.addEventListener('keydown', e => {
        if (e.target.matches('input')) return;
        if (!wordAuthToken) return

        let targetIndex = FindCharacterInputTarget();
        let pressedKey = e.key.toLocaleLowerCase();

        // Delete Key Press
        if (pressedKey === "backspace" || pressedKey === "delete") {
            if (targetIndex <= wordStartingIndex) return;
            //
            if (targetIndex - 1 >= 0) {
                wordCharacterArray[targetIndex - 1].classList.remove("rounded-xl");
                wordCharacterArray[targetIndex - 1].innerText = '';
                SendWordContainerUpdate(socket, pressedKey);
                return;
            }
        }

        // Enter Key Press
        if (pressedKey === "enter") {
            if (targetIndex !== wordStartingIndex + wordTargetLength) return;
            if (wordCharacterArray[targetIndex - 1].innerText === '?') return;
            //
            if (targetIndex > 0 && (targetIndex % wordTargetLength === 0)) {
                let guess = '';
                for (let index = wordTargetLength - 1; index >= 0; index--) {
                    guess += wordCharacterArray[targetIndex - index - 1].innerText;
                    wordCharacterArray[targetIndex - index - 1].innerText = '?';
                }
                //
                // wordStartingIndex += wordTargetLength;
                SendWordContainerUpdate(socket, pressedKey);
                wordAuthToken = false;
                return;
            }
        }

        // Alphabet Key Press
        if (targetIndex >= wordStartingIndex + wordTargetLength) return;
        if (targetIndex > wordCharacterArray.length) return;
        for (let keyIndex = 0; keyIndex < document.getElementById("key-container").children.length; keyIndex++) {
            const keyButton = document.getElementById("key-container").children[keyIndex];
            //
            if (pressedKey === keyButton.innerText) {
                wordCharacterArray[targetIndex].classList.add("rounded-xl");
                wordCharacterArray[targetIndex].innerText = pressedKey;
                SendWordContainerUpdate(socket, pressedKey);
                return;
            }
        }

    });
}

//#endregion
