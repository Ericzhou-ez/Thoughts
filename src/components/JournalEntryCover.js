// import React from "react";

// export default function JournalEntryCover({ title, date, photoSrc, onDelete, deleteBtn }) {
//    return (
//       <div className="journal-cover">
//          {deleteBtn && (
//             <button className="delete-button" onClick={onDelete}>
//                ×
//             </button>
//          )}
//          <img src={photoSrc} alt={title} />
//          <div className="journal-description">
//             <h3>{title}</h3>
//             <p>{date}</p>
//          </div>
//       </div>
//    );
// }

import React from "react";

export default function JournalEntryCover({
   title,
   date,
   photoSrc,
   onClick,
   onDelete,
   deleteBtn,
   hexcode,
}) {
   return (
      <div className="journal-cover" onClick={onClick}>
         {deleteBtn && (
            <button
               className="delete-button"
               onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering `onClick` for the journal cover
                  onDelete();
               }}
            >
               ×
            </button>
         )}
         <img src={photoSrc} alt={title} />
         <div className="journal-description">
            <div
               style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  alignItems: "center",
               }}
            >
               <h3>{title}</h3>
               <div
                  style={{
                     width: "20px",
                     height: "20px",
                     backgroundColor: `${hexcode}`,
                     borderRadius: "50%",
                  }}
               />
            </div>

            <p>{date}</p>
         </div>
      </div>
   );
}
