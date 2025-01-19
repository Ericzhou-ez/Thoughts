import CalendarIcon from "../assets/calendar_month_24dp_UNDEFINED_FILL0_wght400_GRAD0_opsz24.svg";
import NotificationsIcon from "../assets/notifications_24dp_UNDEFINED_FILL0_wght400_GRAD0_opsz24.svg";
import SearchIcon from "../assets/search_24dp_UNDEFINED_FILL0_wght400_GRAD0_opsz24.svg";
import { useState } from "react";

function Icons() {
   return (
      <div>
         <img className="nav-app-icon" src={CalendarIcon} alt="Calendar" />
         <img
            className="nav-app-icon"
            src={NotificationsIcon}
            alt="Notifications"
         />
         <img className="nav-app-icon" src={SearchIcon} alt="Search" />
      </div>
   );
}

export default function Nav({
   isSignInOpen,
   toggleIsSignInOpen,
   signedIn,
   user,
   handleSignOut,
}) {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
   };

   return (
      <div className="nav">
         <div className="nav-logo">
            <img src="/logo.svg" alt="Logo" />
            <h2>thoughts</h2>
         </div>

         {signedIn ? (
            <div className="app-nav">
               <Icons />
               <div
                  className="profile-container"
                  style={{ position: "relative" }}
               >
                  <img
                     src={user?.photo || "../assets/default-profile.webp"}
                     alt={`${user?.name || "User"}'s profile`}
                     className="user-photo"
                     style={{
                        borderRadius: "50%",
                        height: "40px",
                        width: "40px",
                        objectFit: "cover",
                        cursor: "pointer",
                     }}
                     onClick={toggleModal}
                  />
                  {isModalOpen && (
                     <div
                        className="profile-modal"
                        style={{
                           position: "absolute",
                           top: "50px",
                           right: "0",
                           background: "white",
                           borderRadius: "5px",
                           boxShadow: "0 4px 6px rgba(1, 0, 0, 0.2)",
                           zIndex: 100,
                           padding: "10px",
                        }}
                     >
                        <button
                           className="cta-btn-logout"
                           onClick={() => {
                              handleSignOut();
                              toggleModal(); // Close modal after sign-out
                           }}
                           style={{
                              background: "none",
                              border: "1px solid black",
                              padding: "12px 15px",
                              borderRadius: "20px",
                              cursor: "pointer",
                              marginTop: "10px",
                              width: "100%",
                           }}
                        >
                           Logout
                        </button>
                     </div>
                  )}
               </div>
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
