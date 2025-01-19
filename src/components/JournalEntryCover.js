

export default function JournalEntryCover({ title, date, photoSrc, handleQuickStart }) {
   console.log("Title: ", title);
   console.log("Date: ", date);
   console.log("Photo Source: ", photoSrc);

   return (
      <div className="journal-cover">
         <img
            src={photoSrc}
            alt="journal-cover-image"
            style={{
               width: "100%",
               height: "auto",
            }}
         />
         <div className="journal-description">
            <h3>{title}</h3>
            <p>{date}</p>
         </div>
      </div>
   );
}
