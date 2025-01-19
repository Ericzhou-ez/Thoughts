import React, { createContext, useContext, useState } from "react";

export const JournalContext = createContext();

export function JournalProvider({ children }) {
   const [refreshKey, setRefreshKey] = useState(0);

   const refreshEntries = () => {
      setRefreshKey((prev) => prev + 1); // Triggers re-fetch in dependent components
   };

   return (
      <JournalContext.Provider value={{ refreshKey, refreshEntries }}>
         {children}
      </JournalContext.Provider>
   );
}

export const useJournal = () => useContext(JournalContext);
