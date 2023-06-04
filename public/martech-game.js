console.log("Client Setup...");

function isMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

document.getElementById("play-button").addEventListener('click', () => {
    // Name Input Validation
    let playerNameInput = document.getElementById("player-input");
    let formattedInput = playerNameInput.value.trim().replace(/[^a-z0-9]/gi, '');
    if (formattedInput.length < 3 || formattedInput.length > 18) {
        playerNameInput.value = "";
        window.alert("Invalid player name");
        return;
    }
    document.getElementById("notification-container").innerHTML = '';
    // Socket Server Connection
    // const socket = io("http://localhost:8080", {
    //     query: { playerName: formattedInput }
    // });
    const socket = io("https://ahmetahaydemir-dev.ey.r.appspot.com/", {
        query: { playerName: formattedInput }
    });

    // Player Connection 
    socket.on('connect', () => {
        socket.playerName = formattedInput;
        wordAuthToken = socket.wordAuthToken;
        console.log("Client : Init : " + socket.id + " : " + socket.playerName);
        //
        document.getElementById("panel-seperator").style.visibility = "visible";
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
        socket.on('word-container-reset', (currentSocketId) => {
            wordStartingIndex = 0;
            wordAuthToken = false;
            wordCharacterArray = [];
            //
            SetupWordContainer();
        });
        //
        SetupWordContainer();
        SetupKeyboardContainer(socket);
        RegisterKeyAction(socket);
    });
    socket.on('connect_error', error => {
        window.alert(error);
        document.getElementById("play-button").remove();
    });
});

if (!isMobile()) {
    document.getElementById("player-input").style = "font-size: 2rem;";
    document.getElementById("play-button").style = "font-size: 2rem;";
} else {
    document.getElementById("play-button").style = "font-size: 3rem; padding-top:2rem;";
}


//#region CONTAINER

// STATELESS WORD CONTAINER
const wordTargetLength = 6;
let wordCharacterArray = [];
let wordStartingIndex = 0;
let wordAuthToken = false;
function SetupWordContainer() {
    document.getElementById("word-container").innerHTML = '';
    wordCharacterArray.clear
    //
    for (let index = 0; index < wordTargetLength; index++) {
        const wordRowGrid = document.createElement("div");
        wordRowGrid.style = "display: grid; grid-template-columns: repeat(6, 1fr); grid-gap: 15px;";
        //
        for (let secIndex = 0; secIndex < wordTargetLength; secIndex++) {
            const wordCell = document.createElement("div");
            if (isMobile()) {
                wordCell.style = "width:7.5rem; height: 7.5rem; font-size: 5rem;";
            } else {
                wordCell.style = "width:4rem; height: 4rem; font-size: 3rem;";
            }
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
function SetupKeyboardContainer(socket) {
    document.getElementById("key-container").innerHTML = '';
    if (isMobile()) {
        document.getElementById("key-container").classList.remove("max-w-xl");
    }
    //
    const chars = ['e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i',
        'z', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'];
    //
    for (let index = 0; index < chars.length; index++) {
        const keyCell = document.createElement("button");
        keyCell.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
        if (isMobile()) {
            keyCell.style = "width:6rem; height: 6rem; font-size: 4rem;";
        } else {
            keyCell.style = "width:3.5rem; height: 3.5rem; font-size: 2rem;";
        }
        keyCell.textContent = chars[index];
        keyCell.addEventListener('click', (e) => {
            if (!wordAuthToken) return
            if (wordCharacterArray.length <= 0) return
            //
            let targetIndex = FindCharacterInputTarget();
            let pressedKey = e.target.innerText;
            //
            TryCharacterInput(socket, pressedKey, targetIndex);
            e.target.blur();
        });
        document.getElementById("key-container").appendChild(keyCell);
        //
        if (chars[index] === 'v') {
            const keyCellEnter = document.createElement("button");
            keyCellEnter.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
            if (isMobile()) {
                keyCellEnter.style = "width:9rem; height: 6rem; font-size: 1.75rem;";
            } else {
                keyCellEnter.style = "width:5rem; height: 3.5rem; font-size: 1.25rem;";
            }
            keyCellEnter.textContent = "enter";
            keyCellEnter.addEventListener('click', (e) => {
                if (!wordAuthToken) return
                if (wordCharacterArray.length <= 0) return
                //
                let targetIndex = FindCharacterInputTarget();
                let pressedKey = e.target.innerText;
                //
                TryCharacterInput(socket, pressedKey, targetIndex);
                e.target.blur();
            });
            document.getElementById("key-container").appendChild(keyCellEnter);
        }
        if (chars[index] === 'ç') {
            const keyCellDelete = document.createElement("button");
            keyCellDelete.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
            if (isMobile()) {
                keyCellDelete.style = "width:9rem; height: 6rem; font-size: 1.75rem;";
            } else {
                keyCellDelete.style = "width:5rem; height: 3.5rem; font-size: 1.25rem;";
            }
            keyCellDelete.textContent = "delete";
            keyCellDelete.addEventListener('click', (e) => {
                if (!wordAuthToken) return
                if (wordCharacterArray.length <= 0) return
                //
                let targetIndex = FindCharacterInputTarget();
                let pressedKey = e.target.innerText;
                //
                TryCharacterInput(socket, pressedKey, targetIndex);
                e.target.blur();
            });
            document.getElementById("key-container").appendChild(keyCellDelete);
        }
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
    const notifCell = document.createElement("div");
    notifCell.className = "text-center antialiased";
    if (isMobile()) {
        notifCell.style = "font-size: 3rem; text-center antialiased";
        notifCell.innerHTML = notificationText + "<br/><br/><br/><p style='font-size: 3.5rem;' class='text-red'>" + notificationOwner + "<br/><br/><br/><p style='font-size: 3rem;' class='text-green'>" + 123;
    } else {
        notifCell.style = "font-size: 1.75rem; text-center antialiased";
        notifCell.innerHTML = notificationText + "<br/><br/><b style='font-size: 2rem;' class='text-red'>" + notificationOwner + " </b><b class='text-yellow'> -> </b><b style='font-size: 1.5rem;' class='text-green'>" + 123;
    }
    document.getElementById("notification-container").appendChild(notifCell);
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
        if (wordCharacterArray.length <= 0) return

        let targetIndex = FindCharacterInputTarget();
        let pressedKey = e.key.toLocaleLowerCase();

        TryCharacterInput(socket, pressedKey, targetIndex);
    });
}
//
function TryCharacterInput(socket, pressedKey, targetIndex) {
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
}

//#endregion
