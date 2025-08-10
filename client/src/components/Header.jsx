// Header.jsx
import { Link,NavLink, useNavigate } from "react-router-dom";
import { Bell ,Notebook} from "lucide-react";
import useNotificationListener from "../hooks/notificationListner";
import { useAuth } from "../context/AuthContext";
import UserProfileDropdown from "./UserProfile";
import { useEffect,useState } from "react";
import API from "../api/axios";


export default function Header() {

  const {user} = useAuth();
  const{unread} = useNotificationListener();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await API.get("/notify/getallnotification", {
//   withCredentials: true
// });

//         const allNotifications = res.data.data || [];
//         const unread = allNotifications.filter((n) => !n.isRead);
//         setUnreadCount(unread.length);
//       } catch (err) {
//         console.error("Error fetching notifications", err);
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 60000); // refresh every 60s
//     return () => clearInterval(interval);
//   }, []);


// const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleGetStarted = () => {
//     if (user) {
//       navigate("/");
//     } else {
//       navigate("/login");
//     }
//   };



  return (
    <header className="p-1 bg-white border-b ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16 ">


          {/* Left side - Logo and Website Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="sm:text-xl text-md font-bold text-gray-900">LearnFlow</span>
          </div>

<div className="flex items-center space-x-4 ">
          {/* Right side - Navigation Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            



                  <NavLink
  to="/"
  className={({ isActive }) =>
    `px-4 py-2 font-medium transition-colors duration-200 ${
      isActive
        ? "text-black border-b-2 border-black"
        : "text-gray-700 hover:text-gray-900"
    }`
  }
>
  Home
</NavLink>
            
  {!user?(


          <>
          

           <NavLink
  to="/signup"
  className={({ isActive }) =>
    `px-4 py-2 font-medium transition-colors duration-200 ${
      isActive
        ? "text-black border-b-2 border-black"
        : "text-gray-700 hover:text-gray-900"
    }`
  }
>
  SignUp
</NavLink>
          
          </>


            ) : (

             <>
                 <NavLink
               to="/subject"
  className={({ isActive }) =>
    `px-4 py-2 font-medium transition-colors duration-200 ${
      isActive
        ? "text-black border-b-2 border-black"
        : "text-gray-700 hover:text-gray-900"
    }`
  }
            >
              Subjects
            </NavLink>



           <NavLink to = "/notes"  className={({ isActive }) =>
    `relative px-4 py-2 font-medium transition-colors duration-200 ${
      isActive
        ? "text-black border-b-2 border-black"
        : "text-gray-700 hover:text-gray-900"
    }`
  } ><Notebook className="h-5 w-5"/></NavLink>    
      
<NavLink
  to="/notifications"
  className={({ isActive }) =>
    `relative px-4 py-2 font-medium transition-colors duration-200 ${
      isActive
        ? "text-black border-b-2 border-black"
        : "text-gray-700 hover:text-gray-900"
    }`
  }
>
  <div className="relative">
    <Bell className="h-5 w-5" />
    {unread > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-3 h-3 rounded-full flex items-center justify-center"></span>
    )}
  </div>
</NavLink>

 <div className=""> <UserProfileDropdown/> </div>







<div>


  
</div>







   
             </> 
            )
          }






            
          

      
          
          </div>



         

                        {/* Hamburger Icon for Mobile */}
<div className="sm:hidden">
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="text-gray-700 hover:text-gray-900 focus:outline-none"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</div>

{/* Mobile Dropdown: visible only on <700px when isMenuOpen is true */}
{isMenuOpen && (
  <div className="sm:hidden absolute top-16 right-4 bg-white border rounded-lg shadow-md z-50 w-48 p-2 space-y-2">
   {user && (
    <>
     <div className=""> <UserProfileDropdown/> </div>
     <NavLink to="/" className="block px-4 py-2 text-gray-700 hover:text-black">Home</NavLink>
    <NavLink to="/subject" className="block px-4 py-2 text-gray-700 hover:text-black">Subjects</NavLink>
    <NavLink to="/notes" className="block px-4 py-2 text-gray-700 hover:text-black">Notes</NavLink>
    <NavLink to="/notifications" className="block px-4 py-2 text-gray-700 hover:text-black">Notifications</NavLink>
    </>
   )}
   
    {!user && (
      <>
      <NavLink to="/" className="block px-4 py-2 text-gray-700 hover:text-black">Home</NavLink>
      <NavLink to="/signup" className="block px-4 py-2 text-gray-700 hover:text-black">SignUp</NavLink>
      </>
      
    )}
  </div>
)}
          

</div>
        </div>
      </div>
    </header>
  );
}
