import "./styles/index.css";
import "./styles/App.css";
import Hero from "./components/hero";
import Nav from "./components/nav";
import { useState, useEffect } from "react";
import { AuthenticationPopUp } from "./components/authentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";
import TextInputBar from "./components/textInputBar";
import JournalHistory from "./components/JournalHistory";

function App() {
   const [isSignInOpen, setIsSignInOpen] = useState(false);
   const [user, setUser] = useState(null);
   const [signedIn, setSignedIn] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   const handleSignOut = async () => {
      try {
         await signOut(auth);
         console.log("User signed out successfully");
      } catch (error) {
         console.error("Error signing out:", error);
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

            // Automatically close the popup upon successful login
            setIsSignInOpen(false);
         } else {
            setUser(null);
            setSignedIn(false);
         }
         setIsLoading(false); // Stop loading spinner
      });

      return () => unsubscribe();
   }, []);

   function toggleIsSignInOpen() {
      setIsSignInOpen(!isSignInOpen);
   }

   if (isLoading) {
      return (
         <div className="loading-spinner">
            <img src="/logo.svg" alt="Loading..." />
         </div>
      );
   }

   return (
      <>
         <Nav
            isSignInOpen={isSignInOpen}
            toggleIsSignInOpen={toggleIsSignInOpen}
            user={user}
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            handleSignOut={handleSignOut}
            setUser={setUser}
         />

         {!signedIn ? (
            <Hero
               isSignInOpen={isSignInOpen}
               toggleIsSignInOpen={toggleIsSignInOpen}
            />
         ) : (
            <>
               <div className="main-top-app">
                  <JournalHistory />
               </div>

               <TextInputBar />
            </>
         )}

         {isSignInOpen && !signedIn && (
            <div className="modalOverlay-light" onClick={toggleIsSignInOpen}>
               <AuthenticationPopUp />
            </div>
         )}
      </>
   );
}

export default App;
