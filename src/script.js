// Firebase configuration settings
const firebaseConfig = {
    // apiKey: "YOUR_API_KEY",
    // authDomain: "YOUR_AUTH_DOMAIN",
    // projectId: "YOUR_PROJECT_ID",
    // storageBucket: "YOUR_STORAGE_BUCKET",
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    // appId: "YOUR_APP_ID"
    apiKey: "AIzaSyDbJrpGdM6mUDPD-iGTQK97Nz_iMtnQNGQ",
    authDomain: "wad2-20e6f.firebaseapp.com",
    projectId: "wad2-20e6f",
    storageBucket: "wad2-20e6f.firebasestorage.app",
    messagingSenderId: "1075148882917",
    appId: "1:1075148882917:web:7279d743c8f7f78664250c",
    measurementId: "G-ELR7RHQCYY"
};



// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Selecting HTML elements by their ID
// const usernameInput = document.getElementById("username");
// const chatRoomInput = document.getElementById("chat-room");
// const joinRoomButton = document.getElementById("join-room");
let messageInput = document.getElementById("message-input");
let sendButton = document.getElementById("send-btn");
let messagesDiv = document.getElementById("messages");
messagesDiv.style.overflowY = "scroll";
let chatRoomTitle = document.getElementById("chat-room-title");
// const usernameDisplay = document.getElementById("username-display");


let lastSender = ""; // Keeps track of the last message's sender to group messages

// Testing
// let chatRoom = "1";
// let username = "Bob";
// let userid = "5";
// chatRoomTitle.textContent = "Hallows";

// NOTE: we will be getting parameters from previous page via url parameters
// ?chatid=&username=&userid=&chatname=

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);

let chatRoom = urlParams.get('chatid');
let username = urlParams.get('username');
let userid = urlParams.get('userid');
chatRoomTitle.textContent = urlParams.get('chatname');   // chatroomName




messagesDiv.innerHTML = "";  // Clear previous messages
loadMessages(chatRoom);  // Load messages in real-time


// Load messages from Firestore in real-time
function loadMessages(room) {
    db.collection("chats").doc(room).collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
            messagesDiv.innerHTML = "";  // Clear messages before loading

            snapshot.forEach(doc => {
                const message = doc.data();
                displayMessage(message);
                scrollToBottom();
            });
            lastSender = "";  // Reset last sender after reloading messages
        });
}

// Display a message in the chat window
function displayMessage(message) {
    const usernameLabel = document.createElement("div");
    const messageDiv = document.createElement("div");

    // Check if the message is from the same sender as the last message
    // check check
    if (lastSender !== message.userid) {
        usernameLabel.classList.add("username-label");
        usernameLabel.textContent = message.username;
        messagesDiv.appendChild(usernameLabel);
        lastSender = message.userid;  // Update last sender to the current one
    }

    messageDiv.classList.add("message");
    messageDiv.classList.add(message.userid === userid ? "sent" : "received");


    // Clarify
    messageDiv.setAttribute("data-userid", message.userid);
    messageDiv.textContent = message.text;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

// Send a message when the "Send" button is clicked
sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();

    if (!messageText) return;

    db.collection("chats").doc(chatRoom).collection("messages").add({
        userid: userid,
        username: username,
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = "";  // Clear the message input field

    scrollToBottom();
});


function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    // Auto-scroll to the latest message  
}

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
