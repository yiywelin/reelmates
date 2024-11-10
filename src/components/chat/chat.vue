<template>
    <div class="chat-container bg-gray-100 p-4 rounded-lg shadow-md">
      <div class="messages-container bg-white p-4 rounded-lg mb-4 h-96 overflow-y-auto" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" class="message mb-4">
          <div :class="['p-3 rounded-lg max-w-xs', message.senderId === currentUserId ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200']">
            <p class="text-sm">{{ message.content }}</p>
            <p class="text-xs mt-1 text-gray-500">{{ formatTimestamp(message.timestamp) }}</p>
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="flex">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Type a message..." 
          class="flex-grow p-2 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button 
          type="submit" 
          class="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { getFirestore, collection, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  export default {
    props: {
      chatId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const db = getFirestore();
      const auth = getAuth();
      const messages = ref([]);
      const newMessage = ref('');
      const messagesContainer = ref(null);
      const currentUserId = ref(null);
  
      const loadMessages = () => {
        const q = query(collection(db, 'chats', props.chatId, 'messages'), orderBy('timestamp'));
        onSnapshot(q, (snapshot) => {
          messages.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        });
      };
  
      const sendMessage = async () => {
        if (newMessage.value.trim() && currentUserId.value) {
          try {
            await addMessage(props.chatId, newMessage.value, currentUserId.value);
            newMessage.value = '';
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
      };
  
      const addMessage = async (chatId, content, senderId) => {
        try {
          await db.collection('chats').doc(chatId).collection('messages').add({
            content,
            senderId,
            timestamp: serverTimestamp(),
            readBy: [senderId]
          });
          
          await db.collection('chats').doc(chatId).update({
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Error adding message:', error);
          throw error;
        }
      };
  
      const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.toDate) {
          const date = timestamp.toDate();
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return '';
      };
  
      const scrollToBottom = () => {
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
          }
        });
      };
  
      onMounted(() => {
        loadMessages();
        currentUserId.value = auth.currentUser ? auth.currentUser.uid : null;
      });
  
      watch(messages, () => {
        scrollToBottom();
      });
  
      return {
        messages,
        newMessage,
        sendMessage,
        formatTimestamp,
        messagesContainer,
        currentUserId
      };
    }
  }
  </script>
  
  <style scoped>
  .messages-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .messages-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .messages-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .messages-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>