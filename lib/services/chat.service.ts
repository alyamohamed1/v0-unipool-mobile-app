import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Date | Timestamp;
  read: boolean;
}

export interface Chat {
  id?: string;
  participants: string[]; // [userId1, userId2]
  participantNames: { [userId: string]: string };
  rideId?: string;
  lastMessage?: string;
  lastMessageTime?: Date | Timestamp;
  createdAt: Date | Timestamp;
}

export const chatService = {
  // Create or get existing chat between two users
  async getOrCreateChat(
    userId1: string,
    userId2: string,
    userName1: string,
    userName2: string,
    rideId?: string
  ): Promise<{
    success: boolean;
    error?: string;
    chatId?: string;
  }> {
    try {
      // Check if chat already exists
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId1)
      );

      const querySnapshot = await getDocs(q);

      // Find chat with both users
      const existingChat = querySnapshot.docs.find((doc) => {
        const participants = doc.data().participants as string[];
        return participants.includes(userId2);
      });

      if (existingChat) {
        return {
          success: true,
          chatId: existingChat.id,
        };
      }

      // Create new chat
      const docRef = await addDoc(collection(db, 'chats'), {
        participants: [userId1, userId2],
        participantNames: {
          [userId1]: userName1,
          [userId2]: userName2,
        },
        rideId: rideId || null,
        lastMessage: '',
        lastMessageTime: Timestamp.now(),
        createdAt: Timestamp.now(),
      });

      return {
        success: true,
        chatId: docRef.id,
      };
    } catch (error) {
      console.error('Error creating chat:', error);
      return {
        success: false,
        error: 'Failed to create chat',
      };
    }
  },

  // Send a message
  async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    text: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Add message to messages collection
      await addDoc(collection(db, 'messages'), {
        chatId,
        senderId,
        senderName,
        text,
        createdAt: Timestamp.now(),
        read: false,
      });

      // Update chat's last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        lastMessageTime: Timestamp.now(),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: 'Failed to send message',
      };
    }
  },

  // Get messages for a chat
  async getMessages(chatId: string): Promise<{
    success: boolean;
    error?: string;
    messages?: Message[];
  }> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);

      const messages: Message[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];

      return {
        success: true,
        messages,
      };
    } catch (error) {
      console.error('Error getting messages:', error);
      return {
        success: false,
        error: 'Failed to fetch messages',
        messages: [],
      };
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];

      callback(messages);
    });

    return unsubscribe;
  },

  // Get all chats for a user
  async getUserChats(userId: string): Promise<{
    success: boolean;
    error?: string;
    chats?: Chat[];
  }> {
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const chats: Chat[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastMessageTime: doc.data().lastMessageTime?.toDate() || new Date(),
      })) as Chat[];

      return {
        success: true,
        chats,
      };
    } catch (error) {
      console.error('Error getting user chats:', error);
      return {
        success: false,
        error: 'Failed to fetch chats',
        chats: [],
      };
    }
  },

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);

      // Update all unread messages not sent by the current user
      const updatePromises = querySnapshot.docs
        .filter((doc) => doc.data().senderId !== userId)
        .map((doc) =>
          updateDoc(doc.ref, {
            read: true,
          })
        );

      await Promise.all(updatePromises);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false,
        error: 'Failed to mark messages as read',
      };
    }
  },

  // Get chat details
  async getChatById(chatId: string): Promise<{
    success: boolean;
    error?: string;
    chat?: Chat;
  }> {
    try {
      const docRef = doc(db, 'chats', chatId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Chat not found',
        };
      }

      const chat: Chat = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        lastMessageTime: docSnap.data().lastMessageTime?.toDate() || new Date(),
      } as Chat;

      return {
        success: true,
        chat,
      };
    } catch (error) {
      console.error('Error getting chat:', error);
      return {
        success: false,
        error: 'Failed to fetch chat details',
      };
    }
  },
};