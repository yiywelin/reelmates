// Firebase configuration settings
// replace with the firebase projects configuration details
const firebaseConfig = {
    // apiKey: "YOUR_API_KEY",
    // authDomain: "YOUR_AUTH_DOMAIN",
    // projectId: "YOUR_PROJECT_ID",
    // storageBucket: "YOUR_STORAGE_BUCKET",
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    // appId: "YOUR_APP_ID"
    apiKey: "AIzaSyAD2_EJ31SfTZRFMegeF7N8FNFGMgR7GX0",
    authDomain: "chat-app-ecdf8.firebaseapp.com",
    projectId: "chat-app-ecdf8",
    storageBucket: "chat-app-ecdf8.appspot.com",
    messagingSenderId: "670536230248",
    appId: "1:670536230248:web:b6be5782ea92f109a862dd",
    measurementId: "G-B01KVZM89N"
};


/**
 * Regarding authorisation, the user should only be able to access the chat id they are logged in
 * This check happens earlier on. Users should not be able to access the chat page simply by plugging in the address.
 * */


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

// Join a chat room when the "Join Room" button is clicked
joinRoomButton.addEventListener("click", () => {
    // Set the username and chat room based on user input
    username = usernameInput.value.trim();
    chatRoom = chatRoomInput.value.trim();

    // Validate inputs
    if (!username || !chatRoom) {
        alert("Please enter both username and chat room name.");
        return;
    }

    // Display the current room and username in the header
    chatRoomTitle.textContent = chatRoom;
    document.querySelector(".setup-section").style.display = "none"; // Hide setup, this is to be removed
    usernameDisplay.textContent = `Username: ${username}`;
    messagesDiv.innerHTML = "";  // Clear previous messages

    // Load messages in real-time for the selected chat room
    loadMessages(chatRoom);
});

// We are using nested collections
// chatrooms > messages > documents storing key:value pairs
// we can thus use the same DB as the user details and authorisation DB
// Load messages from Firestore in real-time
function loadMessages(room) {
    // Access the specified chat room's messages, ordered by timestamp
    db.collection("chatrooms").doc(room).collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
            messagesDiv.innerHTML = "";  // Clear messages before loading

            // Loop through each message and display it in the chat window
            snapshot.forEach(doc => {
                const message = doc.data();
                displayMessage(message);
            });
        });
}

// Display a message in the chat window
function displayMessage(message) {
    const messageDiv = document.createElement("div");  // Create a div for the message
    messageDiv.classList.add("message");

    // Add the class based on who sent the message
    messageDiv.classList.add(message.username === username ? "sent" : "received");

    // Display the username and message text
    messageDiv.textContent = `${message.username}: ${message.text}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Auto-scroll to the latest message
}

// Send a message when the "Send" button is clicked
sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();  // Get the message text

    if (!messageText) return;  // Do nothing if message is empty

    // Save the message to Firestore with the current chat room, user, and timestamp
    db.collection("chatrooms").doc(chatRoom).collection("messages").add({
        username: username,
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = "";  // Clear the message input field
});
