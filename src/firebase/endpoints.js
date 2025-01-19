import { getDocs, doc, addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

async function getJournalEntry() {
  try {
    const querySnapshot = await getDocs(collection(db, "entries"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching Firestore data: ", error);
  }
}

async function createJournalEntry(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error adding document data: ", error);
      throw error;
    }
  }

export { getJournalEntry };
