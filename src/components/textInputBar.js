// import "../styles/textBar.css"
// import React, { useState, useLayoutEffect, useRef } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";


// export default function TextInputBar() {
//    const [isExpanded, setIsExpanded] = useState(false);
//    const quillRef = useRef(null);
//    const isInitialized = useRef(false);
//    const [textContent, setTextContent] = useState(
//       () => JSON.parse(localStorage.getItem("textContent")) || ""
//    );

//    const handleExpand = () => setIsExpanded(true);
//    const handleCollapse = () => setIsExpanded(false);

//    const toolbarOptions = [
//       [{ font: ["oxygenmono", "oxygen", "lexend", "newsreader", "poppins"] }],
//       ["bold", "italic", "underline"],
//       [{ header: 2 }, { header: 3 }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["image"],
//    ];

//    const initializeQuill = () => {
//       if (!quillRef.current && isExpanded && !isInitialized.current) {
//          const quill = new Quill("#editor", {
//             theme: "snow",
//             modules: { toolbar: toolbarOptions },
//             placeholder: "Write your thoughts here...",
//          });

//          quillRef.current = quill;
//          isInitialized.current = true;

//          quill.root.innerHTML = textContent;

//          const editorContent = document.querySelector(".ql-editor");
//          const observer = new MutationObserver(() => {
//             const text = editorContent.innerText.trim();
//             setTextContent(text);
//             localStorage.setItem("textContent", JSON.stringify(text));
//          });

//          observer.observe(editorContent, {
//             childList: true,
//             subtree: true,
//             characterData: true,
//          });
//       }
//    };

//    useLayoutEffect(() => {
//       initializeQuill();
//       return () => {
//          if (quillRef.current) {
//             quillRef.current.off("text-change");
//             isInitialized.current = false;
//          }
//       };
//    }, [isExpanded]);

//    return (
//       <div className="text-input-container">
//          {!isExpanded ? (
//             <div className="text-input-bar glass" onClick={handleExpand}>
//                <p>Start typing...</p>
//             </div>
//          ) : (
//             <div className="expanded-editor glass">
//                <div id="editor"></div>
//                <button className="close-btn" onClick={handleCollapse}>
//                   Close
//                </button>
//             </div>
//          )}
//       </div>
//    );
// }
