import { db } from "../firebaseConfig";
import { collection, addDoc, doc, setDoc, updateDoc } from "firebase/firestore";

export async function createRide(rideData) {
  const docRef = await addDoc(collection(db, "rides"), {
    ...rideData,
    status: "open",
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function addPassenger(rideId, userId) {
  await setDoc(doc(db, "rides", rideId, "passengers", userId), {
    userId,
    bookedAt: new Date(),
  });

  // decrease available seats
  await updateDoc(doc(db, "rides", rideId), {
    seatsAvailable: rideData.seatsAvailable - 1,
  });
}
