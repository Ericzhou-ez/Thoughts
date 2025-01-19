

export default function Hero({ isSignInOpen, toggleIsSignInOpen }) {
   return (
      <>
         <div className="hero">
            <h1>
               Organize, reflect, and <br></br>visualize your{" "}
               <span className="clipped-text">thoughts</span>.
            </h1>

            <p>Write the story only you can tell.</p>

            <div className="cta-btns">
               <button
                  className="cta-btn-1"
                  onClick={() => toggleIsSignInOpen()}
               >
                  Join for free
               </button>
               <button className="cta-btns-2">
                  Explore the app <span className="arrow-right">&rarr;</span>
               </button>
            </div>
         </div>

      
      </>
   );
}