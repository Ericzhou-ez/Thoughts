export default function Nav() {
   return (
      <div className="nav">
         <div className="nav-logo">
            <img src="/logo.svg" alt="Logo" />
            <h2>thoughts</h2>
         </div>
         <div className="nav-links">
            <p>Explore</p>
            <p>Login</p>
            <button className="cta-btn-join">Join for free</button>
         </div>
      </div>
   );
}
