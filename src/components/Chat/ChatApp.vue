<template>
    <div class="chat-app">
        <!-- Header Section -->
        <header class="chat-header">
            <h2>{{ chatRoomTitle }}</h2>
        </header>

        <!-- Main Chat Window -->
        <div id="chat-window" class="chat-window">
            <div id="messages" class="messages">
                <div v-for="(message, index) in messages" :key="index"
                    :class="['message', message.userid === currentUserId ? 'sent' : 'received']">
                    <!-- Display username if the sender changes -->
                    <div v-if="message.userid !== currentUserId && (index === 0 || messages[index - 1].userid !== message.userid)"
                        class="username-label">
                        {{ message.username }}
                    </div>
                    {{ message.text }}
                </div>
            </div>
        </div>

        <!-- Message Input Section -->
        <div class="input-section">
            <input v-model="messageText" @keyup.enter="sendMessage" placeholder="Type a message..." />
            <button @click="sendMessage">Send</button>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Adjust the path to your Firebase config file

export default {
    data() {
        return {
            currentUserId: null,
            currentUsername: '',
            chatRoom: '',
            chatRoomTitle: 'Chat',
            messageText: '',
            messages: [],
        };
    },
    async mounted() {
        const auth = getAuth();

        // Listen for auth state changes to get the current user
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUserId = user.uid;
                this.currentUsername = user.displayName || user.email;
                this.chatRoom = await this.getUserWatchParty(user.uid);
                this.loadMessages(this.chatRoom);
            }
        });
    },
    methods: {
        // Function to fetch user's watch party
        async getUserWatchParty(userId) {
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                return userDocSnap.data().watchparty;
            }
            console.log('No watch party found for this user');
            return null;
        },

        // Load messages in real-time from Firestore
        loadMessages(chatRoom) {
            if (!chatRoom) return;

            const q = query(
                collection(db, 'chats', chatRoom, 'messages'),
                orderBy('timestamp', 'asc')
            );

            onSnapshot(q, (snapshot) => {
                this.messages = [];
                snapshot.forEach((doc) => {
                    this.messages.push(doc.data());
                });
                this.scrollToBottom();
            });
        },

        // Send a message to Firestore
        async sendMessage() {
            if (!this.messageText.trim() || !this.chatRoom) return;

            await addDoc(collection(db, 'chats', this.chatRoom, 'messages'), {
                userid: this.currentUserId,
                username: this.currentUsername,
                text: this.messageText,
                timestamp: new Date(),
            });

            this.messageText = '';
            this.scrollToBottom();
        },

        // Scroll to the bottom of the chat window
        scrollToBottom() {
            const chatWindow = document.getElementById('messages');
            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        },
    },
};
</script>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
}

body {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100vh;
    background: radial-gradient(circle at center, #0f0b33, #090517);
    /* Dark purple-blue gradient background */
    overflow: hidden;
    color: #e0e0e0;
}

.chat-app {
    width: 100%;
    max-width: 500px;
    height: 100vh;
    background: rgba(20, 20, 50, 0.85);
    /* Dark translucent background */
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.8);
    position: absolute;
    right: 0;
    overflow: hidden;
}

/* Header section */
.chat-header {
    background-color: #1c1333;
    /* Darker header with neon accent */
    color: #ff80ff;
    /* Neon pink text color */
    padding: 10px;
    text-align: center;
    text-shadow: 0 0 5px #ff80ff;
    border-bottom: 1px solid rgba(255, 128, 255, 0.3);
}

.chat-header h2 {
    font-size: 22px;
    letter-spacing: 1px;
}

.username-display {
    font-size: 14px;
    color: #a0e7ff;
    opacity: 0.8;
}

/* Setup section */
.setup-section {
    padding: 15px;
    background-color: #1a1a3b;
    /* Dark setup section */
    border-bottom: 1px solid #333;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.setup-section label {
    font-size: 14px;
    color: #a0e7ff;
    /* Light blue labels */
}

.setup-section input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #555;
    border-radius: 4px;
    background-color: rgba(30, 30, 50, 0.8);
    color: #e0e0e0;
    transition: border 0.2s;
}

.setup-section input[type="text"]:focus {
    border-color: #ff80ff;
    /* Neon border on focus */
    outline: none;
}

#join-room {
    width: 100%;
    padding: 10px;
    background-color: transparent;
    color: #ff80ff;
    border: 2px solid #ff80ff;
    border-radius: 4px;
    cursor: pointer;
    text-shadow: 0 0 3px #ff80ff;
    transition: background-color 0.3s, color 0.3s;
}

#join-room:hover {
    background-color: #ff80ff;
    color: #1c1333;
}

/* Chat window styling */
.chat-window {
    flex-grow: 1;
    background-color: rgba(10, 10, 30, 0.9);
    /* Darker chat background */
    padding: 15px;
    overflow-y: auto;
}

.messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* overflow-y: scroll; */
    /* scroll-behavior: smooth; */
}

/* Message styling */
.message {
    max-width: 75%;
    padding: 10px;
    margin: 5px 0;
    border-radius: 18px;
    line-height: 1.4;
    font-size: 14px;
    color: #f0f0f0;
    position: relative;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
}

.message.sent {
    align-self: flex-end;
    /* background-color: rgba(50, 50, 100, 0.8); Dark blue for sent messages */
    /* border: 1px solid #293462; */
    /* border-color: palevioletred, purple; */
    border-bottom-right-radius: 0;

    /* Edit */
    /* background: radial-gradient(circle at center, palevioletred, purple);  
    color: #a0e7ff;
    text-shadow: 0 0 2px #a0e7ff ; */

    background-color: transparent;
    color: #ff80ff;
    border: 2px solid #ff80ff;
    text-shadow: 0 0 3px #ff80ff;
}

.message.received {
    align-self: flex-start;
    /* background-color: rgba(40, 40, 70, 0.9); Dark purple-gray for received messages */
    /* border: 1px solid #444; */
    border-bottom-left-radius: 0;

    /* Edit */
    /* background: radial-gradient(circle at center, darkgreen, darkblue);  
    color: #ff80ff;
    text-shadow: 0 0 2px #ff80ff; */

    background-color: transparent;
    color: #a0e7ff;
    border: 2px solid #a0e7ff;
    text-shadow: 0 0 3px #a0e7ff;
}

/* Message input section */
.input-section {
    display: flex;
    padding: 10px;
    background-color: #1a1a3b;
    /* Dark background for input section */
    border-top: 1px solid #333;
}

#message-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #555;
    border-radius: 4px;
    background-color: rgba(30, 30, 50, 0.8);
    color: #e0e0e0;
    margin-right: 10px;
}

#message-input:focus {
    border-color: #a0e7ff;
    outline: none;
}

#send-btn {
    padding: 10px;
    background-color: transparent;
    color: #a0e7ff;
    border: 2px solid #a0e7ff;
    border-radius: 4px;
    cursor: pointer;
    text-shadow: 0 0 3px #a0e7ff;
    transition: background-color 0.3s, color 0.3s;
}

#send-btn:hover {
    color: #1a1a3b;
    background-color: #a0e7ff;
    
}
</style>
