// CLIENT SETUP
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

var clickAudio = new Audio('sfx/click.wav');
var changeAudio = new Audio('sfx/change.wav');
var reloadAudio = new Audio('sfx/reload.wav');

let currentSocket;
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
        currentSocket = socket;
        wordAuthToken = socket.wordAuthToken;
        wordGuessToken = true;
        //
        socket.on('player-container-update', (socketArray, currentScoreResult, currentSocketId, currentSocketName) => {
            wordAuthToken = (currentSocketId === socket.id);
            SetupPlayerContainer(socketArray, currentSocketName, currentScoreResult);
        });
        //
        socket.on('word-container-state', (currentWordState, currentGuessResult, currentSocketId, currentSocketName, currentCharacterIndex) => {
            if (currentCharacterIndex > wordStartingIndex) {
                wordGuessToken = true;
                changeAudio.currentTime = 0;
                changeAudio.play();
            } else {
                wordGuessToken = false;
                clickAudio.currentTime = 0;
                clickAudio.play();
            }
            UpdateWordContainer(currentWordState, currentGuessResult);
            wordAuthToken = (currentSocketId === socket.id);
            wordStartingIndex = currentCharacterIndex;
            wordGuessToken = false;
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
            ResetKeyboardContainer();
            SetupWordContainer();
            reloadAudio.play();
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

//#region CONTAINER

// STATELESS WORD CONTAINER
const wordTargetLength = 6;
let wordCharacterArray = [];
let wordStartingIndex = 0;
let wordAuthToken = false;
let wordGuessToken = false;
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
                wordCell.style = "width:2.5rem; height: 2.5rem; font-size: 1.75rem;";
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
                if (wordGuessToken) {
                    if (currentGuessResult.length > iteratorIndex) {
                        wordCharacterArray[iteratorIndex].classList.remove("bg-dark");
                        //
                        switch (currentGuessResult[iteratorIndex]) {
                            case 2:
                                wordCharacterArray[iteratorIndex].classList.add("bg-green");
                                UpdateKeyboardContainer(currentWordState[iteratorIndex], 2);
                                break;
                            case 1:
                                wordCharacterArray[iteratorIndex].classList.add("bg-yellow");
                                UpdateKeyboardContainer(currentWordState[iteratorIndex], 1);
                                break;
                            case 0:
                                wordCharacterArray[iteratorIndex].classList.add("bg-accentgray");
                                UpdateKeyboardContainer(currentWordState[iteratorIndex], 0);
                                break;
                        }
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
let keyboardArray = [];
function SetupKeyboardContainer(socket) {
    document.getElementById("key-container-1").innerHTML = '';
    document.getElementById("key-container-2").innerHTML = '';
    document.getElementById("key-container-3").innerHTML = '';
    //
    if (isMobile()) {
        document.getElementById("key-container").classList.remove("max-w-xl");
        document.getElementById("key-container").classList.remove("p-5");
        document.getElementById("key-container").classList.remove("items-center");
        document.getElementById("key-container").classList.remove("justify-center");
        document.getElementById("key-container").classList.add("gap-2");
        document.getElementById("key-container").style = "align-content: flex-start;";
    }
    //
    const chars = ['e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i',
        'z', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'];
    //
    for (let index = 0; index < chars.length; index++) {
        const keyCell = document.createElement("button");
        keyCell.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
        //
        let targetContainer;
        if (index < 10) {
            targetContainer = document.getElementById("key-container-1");
            if (isMobile()) {
                keyCell.style = "user-select:none; touch-action: manipulation; width:1.75rem; height: 3rem; font-size: 1.5rem;";
            } else {
                keyCell.style = "user-select:none; touch-action: manipulation; width:2.75rem; height: 3.5rem; font-size: 2rem;";
            }
        } else if (index < 21) {
            targetContainer = document.getElementById("key-container-2");
            if (isMobile()) {
                keyCell.style = "user-select:none; touch-action: manipulation; width:1.5rem; height: 3rem; font-size: 1.5rem;";
            } else {
                keyCell.style = "user-select:none; touch-action: manipulation; width:2.5rem; height: 3.5rem; font-size: 2rem;";
            }
        } else {
            targetContainer = document.getElementById("key-container-3");
            if (isMobile()) {
                keyCell.style = "user-select:none; touch-action: manipulation; width:1.75rem; height: 3rem; font-size: 1.5rem;";
            } else {
                keyCell.style = "user-select:none; touch-action: manipulation; width:2.75rem; height: 3.5rem; font-size: 2rem;";
            }
        }
        //
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
        //
        if (chars[index] === 'z') {
            const keyCellEnter = document.createElement("button");
            keyCellEnter.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
            if (isMobile()) {
                keyCellEnter.style = "user-select:none; touch-action: manipulation; width:3rem; height: 3rem; font-size: 0.75rem;";
            } else {
                keyCellEnter.style = "user-select:none; touch-action: manipulation; width:4.5rem; height: 3.5rem; font-size: 1rem;";
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
            targetContainer.appendChild(keyCellEnter);
        }
        //
        targetContainer.appendChild(keyCell);
        keyboardArray.push(keyCell);
        //
        if (chars[index] === 'ç') {
            const keyCellDelete = document.createElement("button");
            keyCellDelete.className = "bg-dark outline outline-2 outline-accentgray rounded-lg antialiased";
            if (isMobile()) {
                keyCellDelete.style = "user-select:none; touch-action: manipulation; width:3rem; height: 3rem; font-size: 0.75rem;";
            } else {
                keyCellDelete.style = " user-select:none; touch-action: manipulation; width:4.5rem; height: 3.5rem; font-size: 1rem;";
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
            targetContainer.appendChild(keyCellDelete);
        }
    }
}
function UpdateKeyboardContainer(keyText, keyColorResult) {
    for (let index = 0; index < keyboardArray.length; index++) {
        if (keyText === keyboardArray[index].textContent) {
            switch (keyColorResult) {
                case 2:
                    if (!keyboardArray[index].classList.contains("bg-green")) {
                        keyboardArray[index].classList.add("bg-green");
                    }
                    keyboardArray[index].classList.remove("bg-yellow");
                    keyboardArray[index].classList.remove("bg-red");
                    break;
                case 1:
                    if (!keyboardArray[index].classList.contains("bg-green")
                        && !keyboardArray[index].classList.contains("bg-yellow")) {
                        keyboardArray[index].classList.add("bg-yellow");
                    }
                    keyboardArray[index].classList.remove("bg-red");
                    break;
                case 0:
                    if (!keyboardArray[index].classList.contains("bg-green")
                        && !keyboardArray[index].classList.contains("bg-yellow")
                        && !keyboardArray[index].classList.contains("bg-red")) {
                        keyboardArray[index].classList.add("bg-red");
                    }
                    break;
            }
        }
    }
}
function ResetKeyboardContainer() {
    for (let index = 0; index < keyboardArray.length; index++) {
        if (keyboardArray[index].classList.contains("bg-green")) {
            keyboardArray[index].classList.remove("bg-green");
        }
        if (keyboardArray[index].classList.contains("bg-yellow")) {
            keyboardArray[index].classList.remove("bg-yellow");
        }
        if (keyboardArray[index].classList.contains("bg-red")) {
            keyboardArray[index].classList.remove("bg-red");
        }
    }
}
// STATELESS PLAYER CONTAINER
let currentScoreDictionary = {};
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
            currentScoreDictionary[socketArray[index]] = currentScoreResult[index];
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
    let notificationOwnerScore = "...";
    if (currentScoreDictionary[notificationOwner]) notificationOwnerScore = currentScoreDictionary[notificationOwner];
    const notifCell = document.createElement("div");
    notifCell.className = "text-center antialiased";
    if (isMobile()) {
        notifCell.style = "font-size: 1.25rem; text-center antialiased";
        notifCell.innerHTML = notificationText + "<br/><p style='font-size: 1.5rem;' class='text-red'>" + notificationOwner + "<br/><b style='font-size: 1.25rem;' class='text-green'>" + notificationOwnerScore;
    } else {
        notifCell.style = "font-size: 1.75rem; text-center antialiased";
        notifCell.innerHTML = notificationText + "<br/><br/><b style='font-size: 2rem;' class='text-red'>" + notificationOwner + " </b><b class='text-yellow'> -> </b><b style='font-size: 1.5rem;' class='text-green'>" + notificationOwnerScore;
    }
    //
    document.getElementById("notification-container").appendChild(notifCell);
    //
    if (document.getElementById("player-time-bar") === null) {
        const timeBarElement = document.createElement("progress");
        timeBarElement.style = 'height:5px; width:100%; position: absolute; top:0px; background-color: red;';
        timeBarElement.setAttribute("id", "player-time-bar");
        timeBarElement.setAttribute("max", 3000);
        timeBarElement.setAttribute("value", 1500);
        document.getElementById("notification-container").appendChild(timeBarElement);
    }
    StartRemainingPlayerTime();
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
    //
    for (let index = 0; index < serverNotificationArray.length; index++) {
        document.getElementById("server-container").appendChild(serverNotificationArray[index]);
    }
}

//#endregion

//#region LISTENERS

function StartRemainingPlayerTime() {
    const timeBar = document.getElementById("player-time-bar");
    timeBar.value = 3000;
    //
    if (window.currentTimeId) {
        clearInterval(window.currentTimeId);
    }
    window.currentTimeId = setInterval(timeCountdown, 10);
    function timeCountdown() {
        if (timeBar.value <= 0) {
            clearInterval(window.currentTimeId);
            timeBar.value = 0;
            // Trigger Turn Skip
        } else {
            timeBar.value = timeBar.value - 1;
        }
    }
}

function SendWordContainerUpdate(socket, key) {
    socket.emit("word-container-update", socket.id, key);
};
//
window.KickUser = function (userIndex, adminToken) {
    if (currentSocket) {
        currentSocket.emit("kick-user", userIndex, adminToken);
    }
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
let keyDownLimit;
function RegisterKeyAction(socket) {
    document.addEventListener('keydown', e => {
        if (keyDownLimit < 3) {
            keyDownLimit++;
        } else {
            return;
        }

        if (e.target.matches('input')) return;
        if (!wordAuthToken) return
        if (wordCharacterArray.length <= 0) return

        let targetIndex = FindCharacterInputTarget();
        let pressedKey = e.key.toLocaleLowerCase();

        TryCharacterInput(socket, pressedKey, targetIndex);
    });
    window.addEventListener('keyup', function (e) {
        keyDownLimit = 0;
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
    console.log(targetIndex, wordStartingIndex, wordTargetLength);
    for (let keyIndex = 0; keyIndex < document.getElementById("key-container-1").children.length; keyIndex++) {
        const keyButton = document.getElementById("key-container-1").children[keyIndex];
        //
        if (pressedKey === keyButton.innerText) {
            if (wordCharacterArray[targetIndex]) {
                wordCharacterArray[targetIndex].classList.add("rounded-xl");
                wordCharacterArray[targetIndex].innerText = pressedKey;
            }
            SendWordContainerUpdate(socket, pressedKey);
            return;
        }
    }
    for (let keyIndex = 0; keyIndex < document.getElementById("key-container-2").children.length; keyIndex++) {
        const keyButton = document.getElementById("key-container-2").children[keyIndex];
        //
        if (pressedKey === keyButton.innerText) {
            if (wordCharacterArray[targetIndex]) {
                wordCharacterArray[targetIndex].classList.add("rounded-xl");
                wordCharacterArray[targetIndex].innerText = pressedKey;
            }
            SendWordContainerUpdate(socket, pressedKey);
            return;
        }
    }
    for (let keyIndex = 0; keyIndex < document.getElementById("key-container-3").children.length; keyIndex++) {
        const keyButton = document.getElementById("key-container-3").children[keyIndex];
        //
        if (pressedKey === keyButton.innerText) {
            if (wordCharacterArray[targetIndex]) {
                wordCharacterArray[targetIndex].classList.add("rounded-xl");
                wordCharacterArray[targetIndex].innerText = pressedKey;
            }
            SendWordContainerUpdate(socket, pressedKey);
            return;
        }
    }
}

//#endregion
