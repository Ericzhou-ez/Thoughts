import { getDocs, doc, addDoc, collection } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes } from "firebase/storage";

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
    if (data.images) {
      data.images.forEach((image) => {
        const storageRef = ref(storage, `images/${image.name}`);
        uploadBytes(storageRef, image).then((snapshot) => {
          console.log(`Uploading this file: ${image.name}`);
        });
      });
    }
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document data: ", error);
    throw error;
  }
}

async function createImage(data) {
    try {
      if (data.images) {
        data.images.forEach((image) => {
          const storageRef = ref(storage, `images/${image.name}`);
          uploadBytes(storageRef, image).then((snapshot) => {
            console.log(`Uploading this file: ${image.name}`);
          });
        });
      }
    } catch (error) {
      console.error("Error adding document data: ", error);
      throw error;
    }
  }

export { getJournalEntry, createJournalEntry, createImage };
