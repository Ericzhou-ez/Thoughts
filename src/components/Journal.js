import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../styles/journal.css";

export default function Journal() {
   const { id } = useParams(); // Get journal ID from URL
   const [entry, setEntry] = useState(null);
   const titleEditorRef = useRef(null); // Reference for title editor
   const contentEditorRef = useRef(null); // Reference for content editor
   const isContentInitialized = useRef(false);

   const fetchEntry = async () => {
      try {
         const docRef = doc(firestore, "journalEntries", id);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
            setEntry(docSnap.data());
         } else {
            console.error("No such document!");
         }
      } catch (error) {
         console.error("Error fetching journal entry:", error);
      }
   };

   const saveEntry = async () => {
      try {
         const titleDelta = titleEditorRef.current.getContents();
         const contentDelta = contentEditorRef.current.getContents();

         const docRef = doc(firestore, "journalEntries", id);
         await updateDoc(docRef, {
            title: JSON.stringify(titleDelta),
            content: JSON.stringify(contentDelta),
         });

         console.log("Journal entry saved successfully!");
      } catch (error) {
         console.error("Error saving journal entry:", error);
      }
   };

   useEffect(() => {
      fetchEntry();
   }, [id]);

   useEffect(() => {
      if (entry) {
         // Initialize Quill for title editor
         const titleElement = document.getElementById("title-editor");
         if (titleElement) {
            const titleQuill = new Quill("#title-editor", {
               theme: "snow",
               placeholder: "",
               modules: {
                  toolbar: false, // No toolbar for title
               },
            });
            titleEditorRef.current = titleQuill;

            if (entry.title) {
               titleQuill.setContents(JSON.parse(entry.title));
            } else {
               titleQuill.setContents("Thoughts");
            }
         } else {
            console.error("Title editor container not found.");
         }

         // Initialize Quill for content editor
         const contentElement = document.getElementById("content-editor");
         if (contentElement && !isContentInitialized.current) {
            const contentQuill = new Quill("#content-editor", {
               theme: "snow",
               modules: {
                  toolbar: {
                     container: [
                        ["bold", "italic", "underline"],
                        [{ header: 2 }, { header: 3 }],
                        [
                           { list: "ordered" },
                           { list: "bullet" },
                           { list: "check" },
                        ],
                        ["image"], // Add image button to the toolbar
                     ],
                  },
               },
               placeholder: "",
            });

            contentEditorRef.current = contentQuill;

            // Set content for content editor
            if (entry.content) {
               contentQuill.setContents(JSON.parse(entry.content));
            }

            isContentInitialized.current = true;
         } else if (!contentElement) {
            console.error("Content editor container not found.");
         }
      }
   }, [entry]);

   return (
      <div className="journal">
         <div id="title-editor" className="title-editor"></div>
         <div id="content-editor" className="content-editor"></div>
         <button className="save-button" onClick={saveEntry}>
            Save
         </button>
      </div>
   );
}
