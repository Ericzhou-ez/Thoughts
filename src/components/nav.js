export default function Nav({
   isSignInOpen,
   toggleIsSignInOpen,
   signedIn,
   user,
   handleSignOut,
}) {
   return (
      <div className="nav">
         <div className="nav-logo">
            <img src="/logo.svg" alt="Logo" />
            <h2>thoughts</h2>
         </div>

         {signedIn ? (
            <div className="app-nav">
               <img
                  src={user?.photo || "/default-profile.png"}
                  alt={`${user?.name || "User"}'s profile`}
                  className="user-photo"
                  style={{
                     borderRadius: "50%",
                     height: "40px",
                     width: "40px",
                     objectFit: "cover",
                  }}
               />
               <button
                  className="cta-btn-logout"
                  onClick={() => {
                     handleSignOut();
                  }}
                  style={{
                     marginLeft: "10px",
                     border: "1px solid black",
                     padding: "5px 15px",
                     cursor: "pointer",
                  }}
               >
                  Logout
               </button>
            </div>
         ) : (
            <div className="nav-links">
               <p role="button" onClick={toggleIsSignInOpen}>
                  Login
               </p>
               <button className="cta-btn-join" onClick={toggleIsSignInOpen}>
                  Join for free
               </button>
            </div>
         )}
      </div>
   );
}


