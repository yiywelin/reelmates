import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const useFriends = () => {
  const friends = ref([]);
  const isFetchingFriends = ref(false);
  const friendsError = ref(null);

  const fetchFriends = async () => {
    console.log('Fetching friends...');
    const auth = getAuth();
    if (!auth.currentUser) {
      console.error('No authenticated user');
      friendsError.value = 'You must be logged in to fetch friends.';
      return [];
    }

    isFetchingFriends.value = true;
    friendsError.value = null;
    friends.value = []; // Reset friends array

    try {
      console.log('Current user UID:', auth.currentUser.uid);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('User document not found for UID:', auth.currentUser.uid);
        friendsError.value = 'User data not found. Please try again later.';
        return [];
      }

      console.log('User document found:', userDoc.id);
      const userData = userDoc.data();
      const friendIds = userData.friends || [];
      console.log('Friend IDs:', friendIds);

      if (friendIds.length === 0) {
        console.log('No friends found');
        return [];
      }

      const usersRef = collection(db, 'users');
      const friendsQuery = query(usersRef, where('uid', 'in', friendIds));
      const friendsSnapshot = await getDocs(friendsQuery);

      const fetchedFriends = friendsSnapshot.docs.map(doc => {
        const friendData = doc.data();
        return {
          id: doc.id,
          name: friendData.username || friendData.email,
          avatar: friendData.avatar || null
        };
      });

      console.log('Fetched friends:', fetchedFriends);
      friends.value = fetchedFriends;
      return fetchedFriends;
    } catch (err) {
      console.error('Error fetching friends:', err);
      friendsError.value = 'Failed to fetch friends. Please try again later.';
      return [];
    } finally {
      isFetchingFriends.value = false;
    }
  };

  return {
    friends,
    isFetchingFriends,
    friendsError,
    fetchFriends
  };
};