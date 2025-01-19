import React, { useState, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "../styles/textBar.css";

export default function TextInput() {
   const quillRef = useRef(null);
   const observerRef = useRef(null);
   const [isFocused, setIsFocused] = useState(false);
   const isInitialized = useRef(false);
   const [textContent, setTextContent] = useState(
      () => JSON.parse(localStorage.getItem("textContent")) || ""
   );

   const toolbarOptions = React.useMemo(
      () => [
         ["bold", "italic", "underline"],
         [{ header: 2 }, { header: 3 }],
         [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ],
      []
   );

   useLayoutEffect(() => {
      const editorElement = document.getElementById("editor");

      if (!quillRef.current && !isInitialized.current && editorElement) {
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: {
               toolbar: toolbarOptions,
            },
            placeholder: "Thoughts...", // Add placeholder
         });

         quillRef.current = quill;
         isInitialized.current = true;

         quill.root.innerHTML = textContent;

         const editorContent = document.querySelector(".ql-editor");
         observerRef.current = new MutationObserver(() => {
            const text = editorContent.innerText.trim();
            setTextContent(text);
            localStorage.setItem("textContent", JSON.stringify(text));
         });

         observerRef.current.observe(editorContent, {
            childList: true,
            subtree: true,
            characterData: true,
         });

         // Handle focus and blur events
         editorContent.addEventListener("focusin", () => setIsFocused(true));
         editorContent.addEventListener("focusout", () => setIsFocused(false));
      }

      return () => {
         if (quillRef.current || isInitialized.current) {
            quillRef.current.off("text-change");
            isInitialized.current = false;
         }

         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      };
   }, [toolbarOptions, textContent]);

   return (
      <div
         className={`editor-container ${
            isFocused ? "focused-editor-container" : ""
         }`}
      >
         <div id="editor" className={isFocused ? "focused-editor" : ""}></div>
      </div>
   );
}
