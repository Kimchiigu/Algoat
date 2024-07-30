// firebaseFunctions.ts
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { User } from 'lucide-react';
import useUserStore from "@/lib/user-store";

const generateRoomId = async (): Promise<number> => {
  const min = 100000;
  const max = 999999;
  let roomId: any;
  let roomExists = true;

  while (roomExists) {
    roomId = Math.floor(Math.random() * (max - min + 1)) + min;
    const roomDocRef = doc(db, 'Rooms', roomId.toString());
    const roomDocSnap = await getDoc(roomDocRef);

    if (!roomDocSnap.exists()) {
      roomExists = false;
    }
  }

  return roomId;
};

export const createRoom = async (roomName: string, roomPassword: string, ownerId: any): Promise<number> => {
  try {
    const roomId = await generateRoomId();
    await setDoc(doc(db, 'Rooms', roomId.toString()), {
      owner: ownerId,
      name: roomName,
      password: roomPassword,
    });
    console.log('Room created with ID: ', roomId);
    return roomId;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const joinRoom = async (roomId: string, roomPassword: string, userId: string, userName: string, isCreating: boolean = false): Promise<string | null> => {
  try {
    const roomDocRef = doc(db, 'Rooms', roomId);
    const roomDocSnap = await getDoc(roomDocRef);

    if (roomDocSnap.exists()) {
      const roomData = roomDocSnap.data();
      if (isCreating || roomData.password === roomPassword) {
        const playersCollectionRef = collection(roomDocRef, 'Players');
        const playerDocRef = doc(playersCollectionRef, userId);

        const playerDocSnap = await getDoc(playerDocRef);
        if (!playerDocSnap.exists()) {
          await setDoc(playerDocRef, { userName, userId });
          console.log(`User ${userName} joined room ${roomId}`);
        } else {
          console.log(`User ${userName} already in room ${roomId}`);
        }
        return roomId;
      } else {
        console.log('Incorrect password');
        return null;
      }
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
    const roomDocRef = doc(db, 'Rooms', roomId);
    const playerDocRef = doc(roomDocRef, 'Players', userId);
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
    const roomDocRef = doc(db, 'Rooms', roomId);
    
    // Set up real-time listener for the room document
    const unsubscribeRoom = onSnapshot(roomDocRef, async (roomDocSnap) => {
      if (roomDocSnap.exists()) {
        const roomData = roomDocSnap.data();

        // Set up real-time listener for the Players subcollection
        const playersCollectionRef = collection(roomDocRef, 'Players');
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
