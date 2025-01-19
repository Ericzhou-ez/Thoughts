import React, { useState, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import "../styles/textBar.css";
import { storage, firestore } from "../config/firebase";

export default function TextInput() {
   const quillRef = useRef(null);
   const observerRef = useRef(null);
   const [isFocused, setIsFocused] = useState(false);
   const isInitialized = useRef(false);

   const imageHandler = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
         const file = input.files[0];
         if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
               "state_changed",
               (snapshot) => {
                  const progress =
                     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(`Upload is ${progress}% done`);
               },
               (error) => {
                  console.error("Image upload failed:", error);
               },
               async () => {
                  const downloadURL = await getDownloadURL(
                     uploadTask.snapshot.ref
                  );
                  const quill = quillRef.current;
                  const range = quill.getSelection();

                  // Insert the image URL into the Quill editor
                  quill.insertEmbed(range.index, "image", downloadURL);
               }
            );
         }
      };
   };

   const saveContent = async () => {
      const quill = quillRef.current;
      if (quill) {
         const delta = quill.getContents(); // Get full Delta, including text and images
         const jsonDelta = JSON.stringify(delta);
         const plainText = quill.getText().trim(); // Extract plain text if needed

         try {
            // Save to Firestore
            const docRef = await addDoc(
               collection(firestore, "journalEntries"),
               {
                  content: jsonDelta, // Save full Quill Delta
                  plainText, // Optional: Save plain text for quick previews/search
                  timestamp: new Date().toISOString(), // Include timestamp
               }
            );
            console.log("Document written with ID:", docRef.id);
         } catch (error) {
            console.error("Error saving content:", error);
         }
      }
   };

   const toolbarOptions = React.useMemo(
      () => [
         ["bold", "italic", "underline"],
         [{ header: 2 }, { header: 3 }],
         [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
         ["image"], // Add image button to the toolbar
      ],
      []
   );

   const clearEditor = () => {
      const quill = quillRef.current;
      if (quill) {
         quill.setContents([]);
      }
   };

   useLayoutEffect(() => {
      const editorElement = document.getElementById("editor");

      if (!quillRef.current && !isInitialized.current && editorElement) {
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: {
               toolbar: {
                  container: toolbarOptions,
                  handlers: {
                     image: imageHandler, // Attach custom image handler
                  },
               },
            },
            placeholder: "Write your thoughts here...",
         });

         quillRef.current = quill;
         isInitialized.current = true;

         // Observe content changes and save text locally
         const editorContent = document.querySelector(".ql-editor");
         observerRef.current = new MutationObserver(() => {
            const text = editorContent.innerText.trim();
            localStorage.setItem("textContent", JSON.stringify(text));
         });

         observerRef.current.observe(editorContent, {
            childList: true,
            subtree: true,
            characterData: true,
         });

         editorContent.addEventListener("focusin", () => setIsFocused(true));
         editorContent.addEventListener("focusout", () => setIsFocused(false));
      }

      return () => {
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      };
   }, [toolbarOptions]);

   return (
      <div
         className={`editor-container ${
            isFocused ? "focused-editor-container" : ""
         }`}
      >
         <div id="editor" className={isFocused ? "focused-editor" : ""}></div>
         <SendBtn saveContent={saveContent} clearEditor={clearEditor} />
      </div>
   );
}

function SendBtn({ saveContent, clearEditor }) {
   return (
      <button
         className="send-button"
         onClick={() => {
            saveContent();
            clearEditor();
         }}
      >
         ↑
      </button>
   );
}
