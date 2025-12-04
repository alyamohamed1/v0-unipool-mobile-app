import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Ride {
  id?: string;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  driverRating?: number;
  from: string;
  to: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date | Timestamp;
}

export const rideService = {
  //Driver posts a ride
  async createRide(rideData: Omit<Ride, 'id' | 'createdAt'>): Promise<{
    success: boolean;
    error?: string;
    rideId?: string;
  }> {
    try {
      // Validate required fields
      if (!rideData.driverId || !rideData.from || !rideData.to) {
        return {
          success: false,
          error: 'Missing required fields',
        };
      }

      // Validate seats
      if (rideData.totalSeats < 1 || rideData.totalSeats > 6) {
        return {
          success: false,
          error: 'Total seats must be between 1 and 6',
        };
      }

      // Validate price
      if (rideData.price < 0) {
        return {
          success: false,
          error: 'Price cannot be negative',
        };
      }

      // Add the ride to Firestore
      const docRef = await addDoc(collection(db, 'rides'), {
        ...rideData,
        createdAt: Timestamp.now(),
      });

      return {
        success: true,
        rideId: docRef.id,
      };
    } catch (error) {
      console.error('Error creating ride:', error);
      return {
        success: false,
        error: 'Failed to create ride',
      };
    }
  },

  //Get all available rides for riders to browse
  async getAvailableRides(): Promise<{
    success: boolean;
    error?: string;
    rides?: Ride[];
  }> {
    try {
      // Query only active rides with available seats
      const q = query(
        collection(db, 'rides'),
        where('status', '==', 'active'),
        where('availableSeats', '>', 0),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const rides: Ride[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Ride[];

      return {
        success: true,
        rides,
      };
    } catch (error) {
      console.error('Error getting available rides:', error);
      return {
        success: false,
        error: 'Failed to fetch rides',
        rides: [],
      };
    }
  },

  // Get all rides posted by a specific driver
  async getDriverRides(driverId: string): Promise<{
    success: boolean;
    error?: string;
    rides?: Ride[];
  }> {
    try {
      const q = query(
        collection(db, 'rides'),
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const rides: Ride[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Ride[];

      return {
        success: true,
        rides,
      };
    } catch (error) {
      console.error('Error getting driver rides:', error);
      return {
        success: false,
        error: 'Failed to fetch your rides',
        rides: [],
      };
    }
  },

  //Get a single ride by ID
  async getRideById(rideId: string): Promise<{
    success: boolean;
    error?: string;
    ride?: Ride;
  }> {
    try {
      const docRef = doc(db, 'rides', rideId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Ride not found',
        };
      }

      const ride: Ride = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as Ride;

      return {
        success: true,
        ride,
      };
    } catch (error) {
      console.error('Error getting ride:', error);
      return {
        success: false,
        error: 'Failed to fetch ride details',
      };
    }
  },

  //Book a ride
  async bookRide(rideId: string, riderId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // First check if ride exists and has available seats
      const rideDoc = await getDoc(doc(db, 'rides', rideId));

      if (!rideDoc.exists()) {
        return {
          success: false,
          error: 'Ride not found',
        };
      }

      const rideData = rideDoc.data() as Ride;

      if (rideData.availableSeats < 1) {
        return {
          success: false,
          error: 'No seats available',
        };
      }

      if (rideData.status !== 'active') {
        return {
          success: false,
          error: 'This ride is no longer active',
        };
      }

      // Update the ride, decrement available seats
      await updateDoc(doc(db, 'rides', rideId), {
        availableSeats: increment(-1),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error booking ride:', error);
      return {
        success: false,
        error: 'Failed to book ride',
      };
    }
  },

  //Cancel a ride (Driver cancels their posted ride)
  async cancelRide(rideId: string, driverId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Verify the ride belongs to this driver
      const rideDoc = await getDoc(doc(db, 'rides', rideId));

      if (!rideDoc.exists()) {
        return {
          success: false,
          error: 'Ride not found',
        };
      }

      const rideData = rideDoc.data() as Ride;

      if (rideData.driverId !== driverId) {
        return {
          success: false,
          error: 'You can only cancel your own rides',
        };
      }

      // Update ride status to cancelled
      await updateDoc(doc(db, 'rides', rideId), {
        status: 'cancelled',
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error cancelling ride:', error);
      return {
        success: false,
        error: 'Failed to cancel ride',
      };
    }
  },

  //Delete a ride completely
  async deleteRide(rideId: string, driverId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Verify the ride belongs to this driver
      const rideDoc = await getDoc(doc(db, 'rides', rideId));

      if (!rideDoc.exists()) {
        return {
          success: false,
          error: 'Ride not found',
        };
      }

      const rideData = rideDoc.data() as Ride;

      if (rideData.driverId !== driverId) {
        return {
          success: false,
          error: 'You can only delete your own rides',
        };
      }

      // Delete the ride
      await deleteDoc(doc(db, 'rides', rideId));

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting ride:', error);
      return {
        success: false,
        error: 'Failed to delete ride',
      };
    }
  },

  // Get booking requests for driver's active ride
  async getDriverBookingRequests(driverId: string): Promise<{
    success: boolean;
    error?: string;
    requests?: any[];
  }> {
    try {
      // Get the driver's active ride
      const ridesQuery = query(
        collection(db, 'rides'),
        where('driverId', '==', driverId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      const ridesSnapshot = await getDocs(ridesQuery);

      if (ridesSnapshot.empty) {
        return {
          success: true,
          requests: [],
        };
      }

      // Get the most recent active ride
      const rideId = ridesSnapshot.docs[0].id;
      const rideData = ridesSnapshot.docs[0].data();

      // Get booking requests for this ride
      const requestsQuery = query(
        collection(db, 'bookingRequests'),
        where('rideId', '==', rideId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );

      const requestsSnapshot = await getDocs(requestsQuery);

      const requests = await Promise.all(
        requestsSnapshot.docs.map(async (requestDoc) => {
          const requestData = requestDoc.data();
          // Get rider details
          const riderDoc = await getDoc(doc(db, 'users', requestData.riderId));
          const riderData = riderDoc.exists() ? riderDoc.data() : {};

          return {
            id: requestDoc.id,
            rideId: requestData.rideId,
            riderId: requestData.riderId,
            name: riderData.name || riderData.displayName || 'Unknown',
            rating: riderData.rating || 0,
            photo: riderData.photoURL || null,
            pickup: rideData.from,
            destination: rideData.to,
            passengers: requestData.passengers || 1,
            status: requestData.status,
            createdAt: requestData.createdAt?.toDate() || new Date(),
          };
        })
      );

      return {
        success: true,
        requests,
      };
    } catch (error) {
      console.error('Error getting booking requests:', error);
      return {
        success: false,
        error: 'Failed to fetch booking requests',
        requests: [],
      };
    }
  },

  // Accept a booking request
  async acceptBookingRequest(requestId: string, rideId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Get the booking request
      const requestDoc = await getDoc(doc(db, 'bookingRequests', requestId));

      if (!requestDoc.exists()) {
        return {
          success: false,
          error: 'Booking request not found',
        };
      }

      const requestData = requestDoc.data();
      const passengers = requestData.passengers || 1;

      // Check if ride has enough available seats
      const rideDoc = await getDoc(doc(db, 'rides', rideId));

      if (!rideDoc.exists()) {
        return {
          success: false,
          error: 'Ride not found',
        };
      }

      const rideData = rideDoc.data() as Ride;

      if (rideData.availableSeats < passengers) {
        return {
          success: false,
          error: `Not enough seats available. Only ${rideData.availableSeats} seats left.`,
        };
      }

      // Update booking request status
      await updateDoc(doc(db, 'bookingRequests', requestId), {
        status: 'accepted',
        acceptedAt: Timestamp.now(),
      });

      // Decrement available seats
      await updateDoc(doc(db, 'rides', rideId), {
        availableSeats: increment(-passengers),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error accepting booking request:', error);
      return {
        success: false,
        error: 'Failed to accept booking request',
      };
    }
  },

  // Decline a booking request
  async declineBookingRequest(requestId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await updateDoc(doc(db, 'bookingRequests', requestId), {
        status: 'declined',
        declinedAt: Timestamp.now(),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error declining booking request:', error);
      return {
        success: false,
        error: 'Failed to decline booking request',
      };
    }
  },

  // Create a booking request (called by rider when booking)
  async createBookingRequest(
    rideId: string,
    riderId: string,
    passengers: number = 1
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Check if ride exists and has available seats
      const rideDoc = await getDoc(doc(db, 'rides', rideId));

      if (!rideDoc.exists()) {
        return {
          success: false,
          error: 'Ride not found',
        };
      }

      const rideData = rideDoc.data() as Ride;

      if (rideData.availableSeats < passengers) {
        return {
          success: false,
          error: 'Not enough seats available',
        };
      }

      if (rideData.status !== 'active') {
        return {
          success: false,
          error: 'This ride is no longer active',
        };
      }

      // Create booking request
      await addDoc(collection(db, 'bookingRequests'), {
        rideId,
        riderId,
        passengers,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error creating booking request:', error);
      return {
        success: false,
        error: 'Failed to create booking request',
      };
    }
  },
};