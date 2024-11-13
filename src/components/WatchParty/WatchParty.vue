<template>
    <div class="h-screen bg-[#0A0A1F] text-[#D0CCE3] overflow-hidden relative">
        <div class="h-[0px] flex-shrink-0">
            <NavBar />
        </div>
        <div
            class="absolute inset-0 pt-[70px] bg-gradient-to-b from-[#0A0A1F] via-[#13132b] to-[#0A0A1F] animate-gradient">
        </div>
        <!-- End Screen / Curtains -->
        <div class="curtain fixed inset-0 z-50" v-if="showEndScreen">
            <div class="curtain__wrapper">
                <button @click="$router.push('/home')"
                    class="curtain__panel curtain__panel--left hover:bg-[#1d1d42] transition-colors duration-300">
                    <div class="flex flex-col items-center gap-4">
                        <span class="text-4xl">🏠</span>
                        <span class="text-2xl font-bold text-[#D0CCE3]">Return Home</span>
                    </div>
                </button>
                <div class="curtain__content bg-[#0A0A1F]">
                    <div class="space-y-8 text-center">
                        <h2 class="text-3xl font-bold text-[#DB3DCF] mb-8">Watch Party Ended!</h2>
                    </div>
                </div>
                <button @click="$router.push('/friends')"
                    class="curtain__panel curtain__panel--right hover:bg-[#1d1d42] transition-colors duration-300">
                    <div class="flex flex-col items-center gap-4">
                        <span class="text-4xl">👥</span>
                        <span class="text-2xl font-bold text-[#D0CCE3]">New Watch Party</span>
                    </div>
                </button>
            </div>
        </div>
        <div class="fixed top-4 right-4 z-40 space-y-2" ref="notifications"></div>
        <!-- <div class="relative z-10 flex flex-col h-[calc(100vh-70px)] pt-[70px]"> -->
        <div class="relative z-10 flex flex-col h-[calc(100vh-70px)] pt-[70px] pb-24">
            <!-- Header with Movie Info and Progress Bar -->
            <div class="absolute top-[70px] left-0 right-0 h-20 bg-[#13132b]/90 backdrop-blur-sm border-b border-[#DB3DCF] 
                flex items-center justify-between px-6">
                <div class="flex items-center gap-4">
                    <span class="text-[#DB3DCF] text-2xl">🎥</span>
                    <div>
                        <div class="text-lg font-bold mb-1"></div>
                        <!-- <div class="flex items-center gap-3">
                            <span class="text-sm">{{ currentTime }}</span>
                            <div class="relative w-48 h-1 bg-[#1a1a35] rounded overflow-hidden">
                                <div class="absolute top-0 left-0 h-full bg-[#675FF2] rounded animate-pulse"
                                    :style="{ width: progressBarWidth + '%' }"></div>
                            </div>
                            <span class="text-sm">{{ movieDuration }}</span>
                        </div> -->
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-[#D0CCE3] cursor-pointer">🔊</span>
                    <button @click="toggleUserList"
                        class="flex items-center gap-2 px-3 py-1 rounded bg-[#1a1a35] hover:bg-[#675FF2] transition-colors">
                        <span>👥</span>
                        <span>{{ userCount }} watching</span>
                    </button>
                    <button @click="endWatchParty"
                        class="px-4 py-2 bg-[#DB3DCF] rounded hover:bg-[#675FF2] transition-colors">
                        Leave Watch Party
                    </button>
                </div>
            </div>

            <!-- Main Central Area -->
            <div class="flex flex-1 mt-20">
                <!-- Center Area -->
                <div class="flex-1 relative">
                    <div class="absolute bottom-24 w-full flex justify-center" ref="avatars">
                        <div class="flex flex-wrap justify-center gap-6">
                            <div v-for="avatar in avatars" :key="avatar.id" class="group relative">
                                <div class="w-12 h-12 bg-[#675FF2] rounded-full flex items-center justify-center text-2xl"
                                    :class="{ 'opacity-60': avatar.status === 'idle' }">
                                    {{ avatar.emoji }}
                                </div>
                                <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 
                                    bg-[#13132b] px-2 py-1 rounded text-sm whitespace-nowrap">
                                    {{ avatar.username }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User List -->
                <div v-if="showUserList" class="w-64 bg-[#13132b]/90 backdrop-blur-sm border-l border-[#1a1a35]">
                    <div class="p-4 border-b border-[#1a1a35]">
                        <h3 class="font-bold">Viewers</h3>
                    </div>
                    <div class="h-full" ref="userListContainer"></div>
                </div>

                <!-- Chat Area -->
                <div class="w-80 h-full bg-[#13132b]/90 backdrop-blur-sm border-l border-[#1a1a35] flex flex-col">
                    <!-- Can adjust the width of the Chat window-->
                    <div class="p-4 border-b border-[#1a1a35] flex items-center gap-2">
                        <span class="text-2xl">💬</span>
                        <span class="font-bold">Chat</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-370px)]" ref="messageContainer">
                        <div v-for="msg in messages" :key="msg.timestamp"
                            :class="['group relative text-sm p-2 rounded transition-colors', msg.userid === currentUserId ? 'sent' : 'received']">
                            <span class="font-bold text-[#DB3DCF]">{{ msg.username }}: </span>
                            <span class="break-words">{{ msg.text }}</span>
                            <span class="text-xs text-gray-500 absolute right-2 top-2">
                                {{ msg.timestamp.toLocaleTimeString() }}
                            </span>
                        </div>
                    </div>
                    <div class="p-4 border-t border-[#1a1a35]">
                        <div class="flex gap-2">
                            <textarea v-model="messageInput" @keydown.enter="sendMessage"
                                placeholder="Type a message..."
                                class="flex-1 px-3 py-2 bg-[#1a1a35] rounded border-none text-[#D0CCE3] placeholder-gray-400 resize-none h-10 min-h-[40px] max-h-32">
                            </textarea>
                            <button @click="sendMessage" class="px-4 py-2 bg-[#675FF2] rounded hover:bg-[#DB3DCF] transition-colors 
                                flex items-center justify-center">
                                <span>➡️</span>
                            </button>
                        </div>
                        <div class="text-xs text-gray-400 mt-2">Press Enter to send, Shift + Enter for new line</div>
                    </div>
                </div>
            </div>

            <!-- Emoji Reaction Buttons -->
            <div
                class="h-16 bg-[#13132b]/90 backdrop-blur-sm border-t border-[#1a1a35] flex items-center justify-center gap-4 fixed-bottom-bar">
                <button v-for="reaction in reactions" :key="reaction.emoji" @click="handleReaction(reaction.emoji)"
                    class="group relative px-4 py-2 bg-[#1a1a35] rounded hover:bg-[#675FF2] transition-all hover:scale-110">
                    <span class="text-xl">{{ reaction.emoji }}</span>
                    <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#13132b] px-2 py-1 rounded text-sm 
                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{{ reaction.label }}
                    </span>
                </button>
            </div>

            <!-- Floating Emojis Overlay -->
            <div class="fixed inset-0 pointer-events-none">
                <transition-group name="float" tag="div">
                    <span v-for="(reaction, index) in activeReactions" :key="index" class="floating-emoji">
                        {{ reaction }}
                    </span>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/ui/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default {
    components: {
        NavBar
    },
    data() {
        return {
            showEndScreen: false,
            notifications: [],
            messages: [],
            avatars: Array.from({ length: 15 }, (_, i) => ({
                id: i,
                emoji: '👤',
                username: `User${i + 1}`,
                status: Math.random() > 0.3 ? 'active' : 'idle'
            })),
            messageInput: '',
            showUserList: false,
            reactions: [
                { emoji: '👏', label: 'Clap' },
                { emoji: '❤️', label: 'Love' },
                { emoji: '😮', label: 'Wow' },
                { emoji: '😂', label: 'Laugh' },
                { emoji: '🔥', label: 'Fire' }
            ],
            activeReactions: [],
            currentTime: "1:05:30",
            movieDuration: "2:16:00",
            progressBarWidth: 50,
            currentUserId: null,
            currentUsername: '',
            watchparty: null
        };
    },
    computed: {
        userCount() {
            return this.avatars.length;
        }
    },
    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUserId = user.uid;
                await this.fetchUserData(user.uid);
                if (this.watchparty) {
                    this.loadMessages(this.watchparty);
                }
            }
        });
    },
    methods: {
        async fetchUserData(userId) {
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    this.currentUsername = userData.username;
                    this.watchparty = userData.watchparty;
                } else {
                    console.log('No user data found for this user');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        },
        loadMessages(watchparty) {
            if (!watchparty) return;
            const q = query(
                collection(db, 'chats', watchparty, 'messages'),
                orderBy('timestamp', 'asc')
            );
            onSnapshot(q, (snapshot) => {
                this.messages = [];
                snapshot.forEach((doc) => {
                    const messageData = doc.data();
                    if (messageData.timestamp && messageData.timestamp.toDate) {
                        messageData.timestamp = messageData.timestamp.toDate();
                    }
                    this.messages.push(messageData);
                });
                this.scrollToBottom();
            });
        },
        async sendMessage() {
            if (!this.messageInput.trim() || !this.watchparty) return;
            await addDoc(collection(db, 'chats', this.watchparty, 'messages'), {
                userid: this.currentUserId,
                username: this.currentUsername,
                text: this.messageInput,
                timestamp: new Date(),
            });
            this.messageInput = '';
            this.scrollToBottom();
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const messageContainer = this.$refs.messageContainer;
                if (messageContainer) {
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                }
            });
        },
        toggleUserList() {
            this.showUserList = !this.showUserList;
        },
        handleReaction(emoji) {
            this.activeReactions.push(emoji);
            setTimeout(() => {
                this.activeReactions.shift();
            }, 1000);
        },
        endWatchParty() {
            this.showEndScreen = true;
        }
    }
};
</script>


<style scoped>
.curtain {
    margin: 0 auto;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.curtain__wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

.curtain__panel {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #13132b;
    float: left;
    position: relative;
    width: 50%;
    height: 100vh;
    transition: all 1s ease-out;
    z-index: 2;
    border: none;
    cursor: pointer;
    outline: none;
}

.curtain__panel--left {
    animation: slideInLeft 1s forwards;
    border-right: 2px solid #DB3DCF;
}

.curtain__panel--right {
    animation: slideInRight 1s forwards;
    border-left: 2px solid #DB3DCF;
}

.curtain__content {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    padding: 1rem 0;
    position: absolute;
    text-align: center;
    z-index: 1;
    width: 100%;
}

.break-words {
    word-break: break-word;
}

.font-bold {
    color: #ff80ff;
    text-shadow: 0 0 5px #ff80ff;
}

.fixed-bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}


@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-slideIn {
    animation: slideIn 0.3s forwards;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 100% 50%;
    }
}

.animate-gradient {
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes floatUp {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-200px);
    }
}

.floating-emoji {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    animation: floatUp 1s ease-out forwards;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
