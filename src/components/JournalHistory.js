import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { firestore, auth } from "../config/firebase";
import DefaultJournalCover from "../assets/c606f6afbc52257756b3006db7fe2c7a.webp";
import { useJournal } from "../context/journalContext";
import JournalEntryCover from "./JournalEntryCover";

export default function JournalHistory() {
   const [entries, setEntries] = useState([]);
   const [userSignInDate, setUserSignInDate] = useState(null);
   const { refreshKey } = useJournal(); // Listen for refresh events

   useEffect(() => {
      const fetchSignInDate = () => {
         const user = auth.currentUser;
         if (user?.metadata?.creationTime) {
            setUserSignInDate(new Date(user.metadata.creationTime));
         }
      };

      const fetchEntries = async () => {
         const querySnapshot = await getDocs(
            collection(firestore, "journalEntries")
         );
         const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setEntries(
            items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
         );
      };

      fetchSignInDate();
      fetchEntries();
   }, [refreshKey]); // Refetch entries when refreshKey changes

   const deleteEntry = async (id) => {
      try {
         // Remove entry from Firestore
         await deleteDoc(doc(firestore, "journalEntries", id));

         // Remove entry from state
         setEntries((prevEntries) =>
            prevEntries.filter((entry) => entry.id !== id)
         );
      } catch (error) {
         console.error("Error deleting entry:", error);
      }
   };

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString(undefined, {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   return (
      <div className="journal-history-wrapper">
         <div className="journal-history">
            {/* Render Quick Start Entry First */}
            {userSignInDate && (
               <JournalEntryCover
                  title={"Quick Start"}
                  deleteBtn={false}
                  date={formatDate(userSignInDate)}
                  photoSrc={DefaultJournalCover}
               />
            )}

            {/* Render User Entries */}
            {entries.map((entry) => (
               <JournalEntryCover
                  key={entry.id}
                  id={entry.id}
                  hexcode={entry.hexcode}
                  deleteBtn={true}
                  title={entry.oneword || "Thoughts"}
                  date={formatDate(entry.timestamp)}
                  photoSrc={
                     entry.content?.includes('"image"')
                        ? JSON.parse(entry.content).ops.find(
                             (op) => op.insert?.image
                          )?.insert.image || DefaultJournalCover
                        : DefaultJournalCover
                  }
                  onDelete={() => deleteEntry(entry.id)}
               />
            ))}
         </div>
      </div>
   );
}
