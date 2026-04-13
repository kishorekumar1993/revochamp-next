import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 md:px-20 py-12">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center text-xs font-bold">
         <img
                    src="/logo.png"
                    alt="RevoChamp"
                    width="28"
                    height="28"
                    style={{ objectFit: "contain" }}
                  />    </div>
            <span className="font-bold text-lg">RevoChamp</span>
          </div>
          <p className="text-gray-400 text-sm mt-4 max-w-xs">
            Making education accessible to everyone, everywhere.
          </p>
        </div>

             <div className="footer-links">
               <div className="footer-column">
                 <h4>Explore</h4>
                 <Link href="/tech/courses">Courses</Link>
                 <Link href="/about">About</Link>
                 <Link href="/contact">Contact</Link>
               </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <button
                  // onClick={() =>
                  //   // showSnackbarMessage("Cookie settings coming soon")
                  // }
                >
                  Cookies
                </button>
              </div>
              <div className="footer-column">
            <h5 className="font-semibold mb-3">Connect</h5>
               <ul className="space-y-2 text-gray-400 text-sm">
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>GitHub</li>
            </ul>
               </div>
   
               </div>
        
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between text-gray-500 text-sm">
        <span>© 2026 RevoChamp. All rights reserved.</span>
        <span>❤️ Made with passion</span>
      </div>
    </footer>
  
);
}


// <footer className="footer" id="contact">
//         <div className="container">
//           <div className="footer-content">
//             <div>
//               <div className="footer-logo">
//                 {/* <div className="logo-icon"><span>RL</span></div> */}
//                 <div className="logo-icon">
//                   <img
//                     src="/logo.png"
//                     alt="RevoChamp"
//                     width="28"
//                     height="28"
//                     style={{ objectFit: "contain" }}
//                   />
//                 </div>
//                 <span className="logo-text">RevoChamp</span>
//               </div>
//               <p className="footer-tagline">
//                 Making education accessible
//                 <br />
//                 to everyone, everywhere.
//               </p>
//             </div>
//             <div className="footer-links">
//               <div className="footer-column">
//                 <h4>Explore</h4>
//                 <Link href="/tech/courses">Courses</Link>
//                 <Link href="/about">About</Link>
//                 <Link href="/contact">Contact</Link>
//               </div>
              // <div className="footer-column">
              //   <h4>Legal</h4>
              //   <Link href="/privacy">Privacy</Link>
              //   <Link href="/terms">Terms</Link>
              //   <button
              //     onClick={() =>
              //       showSnackbarMessage("Cookie settings coming soon")
              //     }
              //   >
              //     Cookies
              //   </button>
              // </div>
//               <div className="footer-column">
//                 <h4>Connect</h4>
//                 <button
//                   onClick={() => showSnackbarMessage("Twitter coming soon")}
//                 >
//                   Twitter
//                 </button>
//                 <button
//                   onClick={() => showSnackbarMessage("LinkedIn coming soon")}
//                 >
//                   LinkedIn
//                 </button>
//                 <button
//                   onClick={() => showSnackbarMessage("GitHub coming soon")}
//                 >
//                   GitHub
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="footer-divider"></div>
//           <div className="footer-bottom">
//             <span className="footer-copyright">
//               © 2026 RevoChamp. All rights reserved.
//             </span>
//             <span className="footer-made">❤️ Made with passion</span>
//           </div>
//         </div>
//       </footer>
