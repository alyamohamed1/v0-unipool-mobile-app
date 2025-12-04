import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Notification {
  id?: string;
  userId: string;
  type: 'ride_request' | 'ride_accepted' | 'ride_declined' | 'message' | 'rating' | 'reward' | 'reminder' | 'ride_completed';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | Timestamp;
  data?: any; // Additional data specific to notification type
}

export const notificationService = {
  // Create a notification
  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: Timestamp.now(),
        data: data || null,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: 'Failed to create notification',
      };
    }
  },

  // Get all notifications for a user
  async getUserNotifications(userId: string): Promise<{
    success: boolean;
    error?: string;
    notifications?: Notification[];
  }> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const notifications: Notification[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Notification[];

      return {
        success: true,
        notifications,
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return {
        success: false,
        error: 'Failed to fetch notifications',
        notifications: [],
      };
    }
  },

  // Subscribe to real-time notifications
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications: Notification[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Notification[];

      callback(notifications);
    });

    return unsubscribe;
  },

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: 'Failed to mark notification as read',
      };
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map((doc) =>
        updateDoc(doc.ref, {
          read: true,
        })
      );

      await Promise.all(updatePromises);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: 'Failed to mark all notifications as read',
      };
    }
  },

  // Get unread notification count
  async getUnreadCount(userId: string): Promise<{
    success: boolean;
    error?: string;
    count?: number;
  }> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);

      return {
        success: true,
        count: querySnapshot.size,
      };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return {
        success: false,
        error: 'Failed to get unread count',
        count: 0,
      };
    }
  },

  // Helper function to create ride-related notifications
  async notifyRideRequest(driverId: string, riderName: string, rideDetails: string): Promise<void> {
    await this.createNotification(
      driverId,
      'ride_request',
      'New Ride Request',
      `${riderName} requested to join your ride ${rideDetails}`,
      { riderName, rideDetails }
    );
  },

  async notifyRideAccepted(riderId: string, driverName: string): Promise<void> {
    await this.createNotification(
      riderId,
      'ride_accepted',
      'Ride Request Accepted',
      `${driverName} accepted your ride request`,
      { driverName }
    );
  },

  async notifyRideDeclined(riderId: string, driverName: string): Promise<void> {
    await this.createNotification(
      riderId,
      'ride_declined',
      'Ride Request Declined',
      `${driverName} declined your ride request`,
      { driverName }
    );
  },

  async notifyNewMessage(userId: string, senderName: string): Promise<void> {
    await this.createNotification(
      userId,
      'message',
      'New Message',
      `You have a new message from ${senderName}`,
      { senderName }
    );
  },

  async notifyNewRating(userId: string, raterName: string, rating: number): Promise<void> {
    await this.createNotification(
      userId,
      'rating',
      'New Rating',
      `${raterName} rated you ${rating} stars!`,
      { raterName, rating }
    );
  },
};