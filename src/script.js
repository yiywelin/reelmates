// Firebase configuration settings
const firebaseConfig = {
    // apiKey: "YOUR_API_KEY",
    // authDomain: "YOUR_AUTH_DOMAIN",
    // projectId: "YOUR_PROJECT_ID",
    // storageBucket: "YOUR_STORAGE_BUCKET",
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    // appId: "YOUR_APP_ID"
};


// Have to authenticate?
// Chat page should only be accessible to the logged-in user

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Selecting HTML elements by their ID
const usernameInput = document.getElementById("username");
const chatRoomInput = document.getElementById("chat-room");
const joinRoomButton = document.getElementById("join-room");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const messagesDiv = document.getElementById("messages");
const chatRoomTitle = document.getElementById("chat-room-title");
const usernameDisplay = document.getElementById("username-display");

let chatRoom = ""; // Variable to store the current chat room name
let username = ""; // Variable to store the user's name
let lastSender = ""; // Keeps track of the last message's sender to group messages


// The below code is to be removed in the actual implementation
// Join a chat room when the "Join Room" button is clicked
joinRoomButton.addEventListener("click", () => {
    username = usernameInput.value.trim();
    chatRoom = chatRoomInput.value.trim();

    if (!username || !chatRoom) {
        alert("Please enter both username and chat room name.");
        return;
    }

    document.querySelector(".setup-section").style.display = "none"; // Hide setup, this is to be removed
    chatRoomTitle.textContent = chatRoom;
    usernameDisplay.textContent = `Username: ${username}`; 
    messagesDiv.innerHTML = "";  // Clear previous messages
    loadMessages(chatRoom);  // Load messages in real-time
});

// Load messages from Firestore in real-time
function loadMessages(room) {
    db.collection("chatrooms").doc(room).collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
            messagesDiv.innerHTML = "";  // Clear messages before loading

            snapshot.forEach(doc => {
                const message = doc.data();
                displayMessage(message);
            });
            lastSender = "";  // Reset last sender after reloading messages
        });
}

// Display a message in the chat window
function displayMessage(message) {
    const usernameLabel = document.createElement("div");
    const messageDiv = document.createElement("div");

    // Check if the message is from the same sender as the last message
    if (lastSender !== message.username) {
        usernameLabel.classList.add("username-label");
        usernameLabel.textContent = message.username;
        messagesDiv.appendChild(usernameLabel);
        lastSender = message.username;  // Update last sender to the current one
    }

    messageDiv.classList.add("message");
    messageDiv.classList.add(message.username === username ? "sent" : "received");

    
    messageDiv.setAttribute("data-username", message.username);
    messageDiv.textContent = message.text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Auto-scroll to the latest message
}

// Send a message when the "Send" button is clicked
sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();

    if (!messageText) return;

    db.collection("chatrooms").doc(chatRoom).collection("messages").add({
        username: username,
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = "";  // Clear the message input field
});



// to get info from chat homepage
// Parse the room name from URL parameters
// const urlParams = new URLSearchParams(window.location.search);
// chatRoom = urlParams.get("room");       //check, what if access chatRoom directly, from a group div say, and not from chat home

// if (chatRoom) {
//     document.getElementById("chat-room").value = chatRoom;
//     loadMessages(chatRoom);
// } else {
//     alert("No chat room specified.");
// }
