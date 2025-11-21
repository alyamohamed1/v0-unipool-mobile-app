import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export async function createBooking(data) {
  const bookingRef = await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: new Date(),
  });

  return bookingRef.id;
}
