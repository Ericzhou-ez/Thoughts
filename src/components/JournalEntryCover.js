import React from "react";

export default function JournalEntryCover({ title, date, photoSrc, hexcode, onDelete, deleteBtn }) {
   return (
      <div className="journal-cover">
         {deleteBtn && (
            <button className="delete-button" onClick={onDelete}>
               ×
            </button>
         )}
         <img src={photoSrc} alt={title} />
         <div className="journal-description">
            <div style={{display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center"}}>
            <h3>{title}</h3>
               <div style={{width: '20px', height: '20px', backgroundColor: `${hexcode}`, borderRadius: '50%'}} />
            </div>
            
            <p>{date}</p>
         </div>
      </div>
   );
}
