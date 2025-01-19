import JournalEntryCover from "./JournalEntryCover";
import DefaultJournalCover from "../assets/c606f6afbc52257756b3006db7fe2c7a.webp";

export default function JournalHistory() {

   return (
      <div className="journal-history">
         <JournalEntryCover
            title={"Quick Start"}
            date={"Jan 18th"}
            photoSrc={DefaultJournalCover} 
         />
      </div>
   );
}
