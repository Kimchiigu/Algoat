import { doc, getDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot, DocumentData, DocumentSnapshot, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

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

export const createRoom = async (roomName: string, roomPassword: string, owner: any): Promise<number> => {
  try {
    const roomId = await generateRoomId();
    await setDoc(doc(db, 'Rooms', roomId.toString()), {
      ownerId: owner,
      name: roomName,
      password: roomPassword,
      topic: "Data Structure",
      numQuestions: 10,
      answerTime: 5
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

export const sendMessage = async (roomId: string, userId: string, message: string) => {
  try {
    const messagesCollectionRef = collection(db, 'Rooms', roomId, 'Messages');
    await addDoc(messagesCollectionRef, {
      userId,
      message,
      timestamp: new Date()
    });
  } catch (e) {
    console.error('Error sending message: ', e);
  }
};

export const subscribeToMessages = (roomId: string, callback: (messages: any[]) => void) => {
  const messagesCollectionRef = collection(db, 'Rooms', roomId, 'Messages');
  const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, async (querySnapshot) => {
    const messages: any[] = [];
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      try {
        const playerDocRef = doc(db, 'Rooms', roomId, 'Players', data.userId);
        const playerDocSnap: DocumentSnapshot<DocumentData> = await getDoc(playerDocRef);
        const userName = playerDocSnap.exists() ? playerDocSnap.data()?.userName || "Unknown" : "Unknown";
        messages.push({ ...data, id: docSnap.id, userName });
      } catch (error) {
        console.error("Error fetching user name: ", error);
        messages.push({ ...data, id: docSnap.id, userName: "Unknown" });
      }
    }
    callback(messages);
  });
};

export const fetchRoomData = async (roomId: string, callback: (data: { roomData: any, playersList: any[] }) => void): Promise<() => void> => {
  const roomDocRef = doc(db, 'Rooms', roomId);

  // Set up real-time listener for the room document
  const unsubscribeRoom = onSnapshot(roomDocRef, async (roomDocSnap) => {
    if (roomDocSnap.exists()) {
      const roomData = roomDocSnap.data();

      // Set up real-time listener for the players subcollection
      const playersCollectionRef = collection(roomDocRef, 'Players');
      const unsubscribePlayers = onSnapshot(playersCollectionRef, (playersSnapshot) => {
        const playersList = playersSnapshot.docs.map(doc => doc.data());
        callback({ roomData, playersList });
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
};

export const leaveRoom = async (roomId: string, userId: string): Promise<void> => {
  try {
    const roomDocRef = doc(db, 'Rooms', roomId);
    const roomDocSnap = await getDoc(roomDocRef);

    if (!roomDocSnap.exists()) {
      console.log('No such room!');
      return;
    }

    const roomData = roomDocSnap.data();

    if (!roomData) {
      console.log('No room data found!');
      return;
    }

    // Remove the player from the players collection
    const playersCollectionRef = collection(db, 'Rooms', roomId, 'Players');
    const playerDocRef = doc(playersCollectionRef, userId);
    await deleteDoc(playerDocRef);
    console.log(`User ${userId} left room ${roomId}`);

    // Check if the leaving user is the owner
    if (roomData.ownerId === userId) {
      const playersSnapshot = await getDocs(playersCollectionRef);

      if (playersSnapshot.empty) {
        // If there are no other players, delete the room
        await deleteDoc(roomDocRef);
        console.log(`Room ${roomId} deleted as there are no players left.`);
      } else {
        // Assign the next player as the owner
        const nextPlayer = playersSnapshot.docs[0];
        await setDoc(roomDocRef, { ownerId: nextPlayer.id }, { merge: true });
        console.log(`Ownership transferred to user ${nextPlayer.id}`);
      }
    }
  } catch (e) {
    console.error('Error leaving room: ', e);
  }
};

export const updateRoomSettings = async (roomId: string, settings: { topic: string, numQuestions: number, answerTime: number }) => {
  try {
    const roomDocRef = doc(db, 'Rooms', roomId);
    await setDoc(roomDocRef, settings, { merge: true });
    console.log('Room settings updated');
  } catch (e) {
    console.error('Error updating room settings: ', e);
  }
};

interface RoomData {
  name: string;
  password: string;
  ownerId: string;
  topic: string;
  numQuestions: number;
  answerTime: number;
}

interface Player {
  userName: string;
  userId: string;
}

export const handleRoomLifecycle = async (
  roomId: string,
  currentUser: any,
  setRoomData: React.Dispatch<React.SetStateAction<RoomData | null>>,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setTopic: React.Dispatch<React.SetStateAction<string>>,
  setNumQuestions: React.Dispatch<React.SetStateAction<number>>,
  setAnswerTime: React.Dispatch<React.SetStateAction<number>>,
  router: any
) => {
  if (!roomId || Array.isArray(roomId)) return;

  if (!currentUser) {
    console.log("User not authenticated");
    router.push("/");
    return;
  }

  const fetchData = async () => {
    // Fetch player list first
    let unsubscribePlayers: (() => void) | undefined;
    unsubscribePlayers = await fetchRoomData(
      roomId,
      async ({ playersList, roomData }) => {
        const isMember = playersList.some(
          (player) => player.userId === currentUser?.id
        );

        if (!isMember) {
          console.log("User is not a member of the room");
          router.push("/");
          return;
        }

        setPlayers(playersList);

        // Fetch room data
        setRoomData(roomData);
        setTopic(roomData.topic || "Data Structure");
        setNumQuestions(roomData.numQuestions || 10);
        setAnswerTime(roomData.answerTime || 5);

        // Subscribe to messages
        const unsubscribeMessages = subscribeToMessages(
          roomId,
          setMessages
        );

        return () => {
          if (unsubscribeMessages) unsubscribeMessages();
        };
      }
    );

    return () => {
      if (unsubscribePlayers) unsubscribePlayers();
    };
  };

  fetchData();
};
