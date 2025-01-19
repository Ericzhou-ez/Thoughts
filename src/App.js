import "./styles/index.css";
import "./styles/App.css";
import Hero from "./components/hero";
import Nav from "./components/nav";
import { useState, useEffect } from "react";
import { AuthenticationPopUp } from "./components/authentication";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import TextInputBar from "./components/textInputBar";
import JournalHistory from "./components/JournalHistory";
import Journal from "./components/Journal";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import { JournalProvider } from "./context/journalContext";
import { firestore } from "./config/firebase";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";

// Protected Route Component
function ProtectedRoute({ signedIn, children }) {
   if (!signedIn) {
      return <Navigate to="/" replace />;
   }
   return children;
}

function App() {
   const [isSignInOpen, setIsSignInOpen] = useState(false);
   const [user, setUser] = useState(null);
   const [signedIn, setSignedIn] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [entries, setEntries] = useState([]);

   const deleteEntry = async (id) => {
      try {
         await deleteDoc(doc(firestore, "journalEntries", id));
         setEntries((prevEntries) =>
            prevEntries.filter((entry) => entry.id !== id)
         );
      } catch (error) {
         console.error("Error deleting entry:", error);
      }
   };

   const fetchEntries = async () => {
      try {
         const querySnapshot = await getDocs(
            collection(firestore, "journalEntries")
         );
         const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setEntries(
            items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
         );
      } catch (error) {
         console.error("Error fetching entries:", error);
      }
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
            const { displayName, photoURL } = currentUser;
            setUser({
               name: displayName || "Anonymous",
               photo: photoURL || "https://via.placeholder.com/150",
            });
            setSignedIn(true);
            setIsSignInOpen(false);
         } else {
            setUser(null);
            setSignedIn(false);
         }
         setIsLoading(false);
      });

      if (signedIn) {
         fetchEntries();
      }

      return () => unsubscribe();
   }, [signedIn]);

   if (isLoading) {
      return (
         <div className="loading-spinner">
            <img src="/logo.svg" alt="Loading..." />
         </div>
      );
   }

   return (
      <Router>
         <Nav
            isSignInOpen={isSignInOpen}
            toggleIsSignInOpen={() => setIsSignInOpen(!isSignInOpen)}
            user={user}
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            handleSignOut={async () => await signOut(auth)}
            setUser={setUser}
         />

         <Routes>
            {/* Public Route */}
            <Route
               path="/"
               element={
                  !signedIn ? (
                     <Hero
                        isSignInOpen={isSignInOpen}
                        toggleIsSignInOpen={() =>
                           setIsSignInOpen(!isSignInOpen)
                        }
                     />
                  ) : (
                     <Navigate to="/home" replace />
                  )
               }
            />

            {/* Protected Routes */}
            <Route
               path="/home"
               element={
                  <ProtectedRoute signedIn={signedIn}>
                     <JournalProvider>
                        <div className="main-top-app">
                           <JournalHistory
                              entriesProp={entries}
                              refreshEntries={fetchEntries}
                              deleteEntry={deleteEntry}
                           />
                           <TextInputBar refreshEntries={fetchEntries} />
                        </div>
                     </JournalProvider>
                  </ProtectedRoute>
               }
            />

            <Route
               path="/journal/:id"
               element={
                  <ProtectedRoute signedIn={signedIn}>
                     <Journal />
                  </ProtectedRoute>
               }
            />
         </Routes>

         {isSignInOpen && !signedIn && (
            <div
               className="modalOverlay-light"
               onClick={() => setIsSignInOpen(false)}
            >
               <AuthenticationPopUp />
            </div>
         )}
      </Router>
   );
}

export default App;
