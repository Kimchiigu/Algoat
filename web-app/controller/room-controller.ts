// firebaseFunctions.ts
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

export const createRoom = async (roomName: string, roomId: string, roomPassword: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'rooms', roomId), {
      name: roomName,
      password: roomPassword,
    });
    console.log('Room created with ID: ', roomId);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const joinRoom = async (roomId: string, userId: string, userName: string): Promise<string | null> => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    const roomDocSnap = await getDoc(roomDocRef);

    if (roomDocSnap.exists()) {
      const playersCollectionRef = collection(roomDocRef, 'players');
      const playerDocRef = doc(playersCollectionRef, userId);

      const playerDocSnap = await getDoc(playerDocRef);
      if (!playerDocSnap.exists()) {
        await setDoc(playerDocRef, { userName });
        console.log(`User ${userName} joined room ${roomId}`);
      } else {
        console.log(`User ${userName} already in room ${roomId}`);
      }
      return roomId;
    } else {
      console.log('No such room!');
      return null;
    }
  } catch (e) {
    console.error('Error getting document: ', e);
    return null;
  }
};

export const leaveRoom = async (roomId: string, userId: string): Promise<void> => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    const playerDocRef = doc(roomDocRef, 'players', userId);
    await deleteDoc(playerDocRef);
    console.log(`User ${userId} left room ${roomId}`);
  } catch (e) {
    console.error('Error leaving room: ', e);
  }
};

export const fetchRoomData = async (
  roomId: string,
  onUpdate: (data: { roomData: any, playersList: any[] }) => void
): Promise<() => void> => {
  try {
    const roomDocRef = doc(db, 'rooms', roomId);
    
    // Set up real-time listener for the room document
    const unsubscribeRoom = onSnapshot(roomDocRef, async (roomDocSnap) => {
      if (roomDocSnap.exists()) {
        const roomData = roomDocSnap.data();

        // Set up real-time listener for the players subcollection
        const playersCollectionRef = collection(roomDocRef, 'players');
        const unsubscribePlayers = onSnapshot(playersCollectionRef, (playersSnapshot) => {
          const playersList = playersSnapshot.docs.map(doc => doc.data());
          onUpdate({ roomData, playersList });
        });

        // Combine unsubscribe functions
        const unsubscribe = () => {
          unsubscribeRoom();
          unsubscribePlayers();
        };

        return unsubscribe;
      } else {
        console.log('No such room!');
        return () => {}; // Return an empty function if the room doesn't exist
      }
    });

    return unsubscribeRoom; // Return the room unsubscribe function
  } catch (e) {
    console.error('Error fetching room data: ', e);
    return () => {}; // Return an empty function in case of an error
  }
};
