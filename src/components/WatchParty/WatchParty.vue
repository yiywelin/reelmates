<template>
    <div class="h-screen bg-[#0A0A1F] text-[#D0CCE3] overflow-hidden relative">
        <!-- Loading Overlay -->
        <LoadingPage v-if="showLoading" @complete="showLoading = false" />

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
        <div class="relative z-10 flex flex-col h-[calc(100vh-70px)] pt-[70px] pb-24">
            <!-- Header with Movie Info and Progress Bar -->
            <div class="absolute top-[70px] left-0 right-0 h-20 bg-[#13132b]/90 backdrop-blur-sm border-b border-[#DB3DCF] 
                flex items-center justify-between px-6">
                <div class="flex items-center gap-4">
                    <span class="text-[#DB3DCF] text-2xl">🎥</span>
                    <div>
                        <div class="text-lg font-bold mb-1">
                            Now Showing: {{ movieTitle || '(standby)' }}
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
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
                <div class="flex-1 relative flex flex-col items-center">
                    <!-- Movie Trailer/Placeholder Section -->
                    <div class="w-full max-w-4xl mx-auto mb-8 mt-4">
                        <div class="relative bg-[#13132b]/90 backdrop-blur-sm border border-[#1a1a35] rounded-lg overflow-hidden">
                            <!-- If there's a movie trailer -->
                            <div v-if="movieTrailerUrl" class="aspect-video">
                                <iframe 
                                    :src="movieTrailerUrl" 
                                    class="w-full h-full"
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                ></iframe>
                            </div>
                            <!-- If no movie selected -->
                            <div v-else class="aspect-video flex items-center justify-center bg-[#1a1a35]">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-[#DB3DCF] mb-2">Looking for movies...</div>
                                    <div class="text-[#D0CCE3] opacity-60">Waiting for host to select a movie</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Avatar and Reaction Section -->
                    <div class="w-full flex flex-col items-center gap-8">
                        <!-- Avatar Group -->
                        <div ref="avatars">
                            <AvatarGroup :avatars="avatars" />
                        </div>
                        
                        <!-- Reaction Bar -->
                        <div class="w-full max-w-xl">
                            <ReactionBar @reaction="handleReaction" />
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

            <!-- Floating Emojis Overlay -->
            <div class="fixed inset-0 pointer-events-none">
                <div class="absolute w-full bottom-[180px]">
                    <transition-group name="float" tag="div" class="relative">
                        <span v-for="(reaction, index) in activeReactions" 
                              :key="index" 
                              class="floating-emoji absolute left-1/2"
                        >
                            {{ reaction }}
                        </span>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/ui/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import AvatarGroup from './AvatarGroup.vue';
import ReactionBar from './ReactionBar.vue';
import LoadingPage from '../ui/LoadingPage.vue';
import { useRoute } from 'vue-router';

export default {
    components: {
        NavBar,
        AvatarGroup,
        ReactionBar,
        LoadingPage
    },
    setup() {
        const route = useRoute();
        return { route };
    },
    data() {
        return {
            showLoading: true, // Start with loading screen visible
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
            activeReactions: [],
            currentTime: "1:05:30",
            movieDuration: "2:16:00",
            progressBarWidth: 50,
            currentUserId: null,
            currentUsername: '',
            watchparty: null,
            movieTitle: '',
            movieTrailerId: null,
            movieTrailerUrl: null
        };
    },
    computed: {
        userCount() {
            return this.avatars.length;
        }
    },
    watch: {
        // Watch for route params changes
        '$route.params': {
            immediate: true,
            handler(params) {
                if (params.movieTitle) {
                    this.movieTitle = params.movieTitle;
                }
                if (params.movieTrailerId) {
                    this.movieTrailerUrl = `https://www.youtube.com/embed/${params.movieTrailerId}?autoplay=1`;
                }
            }
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

.floating-emoji {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    animation: floatUp 1s ease-out forwards;
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
        transform: translate(-50%, 0);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -200px);
    }
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