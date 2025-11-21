import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function rateUser(data) {
  await addDoc(collection(db, "ratings"), {
    ...data,
    createdAt: new Date(),
  });
}
