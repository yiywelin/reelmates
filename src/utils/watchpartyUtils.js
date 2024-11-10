import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';

export const handleCreateWatchparty = async (selectedItems, activeTab) => {
  try {
    // Get all selected user IDs
    const userIds = new Set();
    
    for (const item of selectedItems) {
      if (activeTab === 'groups') {
        // Add all members from the group
        item.members.forEach(memberId => userIds.add(memberId));
      } else {
        // Add individual friend ID
        userIds.add(item.id);
      }
    }

    const sortedUserIds = Array.from(userIds).sort();

    // Check for existing group
    const groupsRef = collection(db, 'groups');
    const q = query(
      groupsRef,
      where('memberCount', '==', sortedUserIds.length),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let existingGroup = null;

    querySnapshot.forEach(doc => {
      const groupData = doc.data();
      const groupMembers = groupData.members.sort();
      if (JSON.stringify(groupMembers) === JSON.stringify(sortedUserIds)) {
        existingGroup = { id: doc.id, ...groupData };
      }
    });

    let groupId, chatId;

    if (existingGroup) {
      groupId = existingGroup.id;
      
      // Check for existing chat
      const chatsRef = collection(db, 'chats');
      const chatQuery = query(chatsRef, where('groupId', '==', groupId));
      const chatSnapshot = await getDocs(chatQuery);
      
      if (!chatSnapshot.empty) {
        chatId = chatSnapshot.docs[0].id;
      } else {
        // Create new chat for existing group
        const chatDoc = await addDoc(collection(db, 'chats'), {
          groupId,
          members: sortedUserIds,
          createdAt: new Date(),
          messages: []
        });
        chatId = chatDoc.id;
      }
    } else {
      // Create new group
      const groupDoc = await addDoc(collection(db, 'groups'), {
        members: sortedUserIds,
        memberCount: sortedUserIds.length,
        createdAt: new Date(),
        name: `Watchparty Group ${new Date().toLocaleDateString()}`
      });
      groupId = groupDoc.id;

      // Create new chat
      const chatDoc = await addDoc(collection(db, 'chats'), {
        groupId,
        members: sortedUserIds,
        createdAt: new Date(),
        messages: []
      });
      chatId = chatDoc.id;
    }

    return { groupId, chatId };
  } catch (error) {
    console.error('Error creating watchparty:', error);
    throw error;
  }
}; 