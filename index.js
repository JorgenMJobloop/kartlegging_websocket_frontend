const userNameLocation = document.querySelector("#username");
const rerollBtn = document.querySelector("#rerollUserName");
const chatArea = document.querySelector("#output");
const messageinput = document.querySelector("#typingInput");
const sendBtn = document.querySelector("#sendMessage");
const duckContainer = document.querySelector(".duckContainer");

const apiUri = "https://kartlegging.kodehode.no:443"
const apiUrl = new URL(apiUri);

let generatedName = await getName();

userNameLocation.textContent = generatedName;

async function getName(name = null) {
    const response = await fetch(apiUrl + "name" + (name === null ? "" : `/${name}`));
    return await response.text();
}

const webSocket = new WebSocket(apiUrl + generatedName);

rerollBtn.addEventListener("click", async () => {
    let oldGeneratedName = generatedName;
    generatedName = await getName(oldGeneratedName);
    userNameLocation.textContent = generatedName;
})

sendBtn.addEventListener("click", sendMessage)

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        console.log(duckContainer);
        duckContainer.classList.toggle("duckContainer");
        duckContainer.classList.toggle("duckContainerActive");
        sendMessage();
        setTimeout(() => {
            duckContainer.classList.toggle("duckContainerActive");
            duckContainer.classList.toggle("duckContainer");
        }, 250);

    }
})

const writeToOuput = (message) => {
    const messagePara = document.createElement("p");
    messagePara.textContent = message;
    //chatArea.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
}

const sendOnSocket = (message) => {
    writeToOuput(`SENT: ${message}`);
    webSocket.send(message);
}

webSocket.onopen = (e) => {
    writeToOuput("CONNECTED!");
    sendOnSocket(`${generatedName} has connected!`);
}

webSocket.onmessage = (e) => {
    writeToOuput(`${e.data}`)
}

webSocket.onclose = (e) => {
    writeToOuput("DISCONNECTED!");
}
function sendMessage() {
    const text = messageinput.value;
    text && sendOnSocket(generatedName + ": " + text);
    messageinput.value = "";
    messageinput.focus();
}
