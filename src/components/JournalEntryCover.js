import React from "react";

export default function JournalEntryCover({ title, date, photoSrc, onDelete, deleteBtn }) {
   return (
      <div className="journal-cover">
         {deleteBtn && (
            <button className="delete-button" onClick={onDelete}>
               ×
            </button>
         )}
         <img src={photoSrc} alt={title} />
         <div className="journal-description">
            <h3>{title}</h3>
            <p>{date}</p>
         </div>
      </div>
   );
}
