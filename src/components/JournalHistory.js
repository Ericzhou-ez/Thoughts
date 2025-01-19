import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { firestore, auth } from "../config/firebase";
import DefaultJournalCover from "../assets/c606f6afbc52257756b3006db7fe2c7a.webp";
import { useJournal } from "../context/journalContext";
import JournalEntryCover from "./JournalEntryCover";
import { useNavigate } from "react-router-dom";

export default function JournalHistory({ deleteEntry }) {
   const [entries, setEntries] = useState([]); 
   const [userSignInDate, setUserSignInDate] = useState(null);
   const { refreshKey } = useJournal(); 
   const { refreshEntries } = useJournal(); 

   const navigate = useNavigate();

   const handleEntryClick = (id) => {
      navigate(`/journal/${id}`);
   };

   useEffect(() => {
      const fetchSignInDate = () => {
         const user = auth.currentUser;
         if (user?.metadata?.creationTime) {
            setUserSignInDate(new Date(user.metadata.creationTime));
         }
      };

      fetchSignInDate();
   }, []);

   useEffect(() => {
      const fetchEntries = async () => {
         try {
            const querySnapshot = await getDocs(
               collection(firestore, "journalEntries")
            );
            const items = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            setEntries(
               items.sort(
                  (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
               )
            );
            console.log("Entries fetched:", items);
         } catch (error) {
            console.error("Error fetching entries:", error);
         }
      };

      fetchEntries();
   }, [refreshKey]); 

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
            {entries.map((entry) => (
               <JournalEntryCover
                  key={entry.id}
                  id={entry.id}
                  hexcode={entry.hexcode}
                  deleteBtn={true}
                  title={entry.title || "Thoughts"}
                  date={formatDate(entry.timestamp)}
                  photoSrc={
                     entry.content?.includes('"image"')
                        ? JSON.parse(entry.content).ops.find(
                             (op) => op.insert?.image
                          )?.insert.image || DefaultJournalCover
                        : DefaultJournalCover
                  }
                  onClick={() => handleEntryClick(entry.id)}
                  onDelete={async () => {
                     try {
                        await deleteEntry(entry.id); 
                        refreshEntries();
                        // window.location.reload(); 
                     } catch (error) {
                        console.error("Error deleting entry:", error);
                     }
                  }}
               />
            ))}

            {userSignInDate && (
               <JournalEntryCover
                  deleteBtn={false}
                  title="Quick Start"
                  date={formatDate(userSignInDate.toISOString())}
                  photoSrc={DefaultJournalCover}
               />
            )}
         </div>
      </div>
   );
}
