import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { User, LogOut, ChevronDown, Settings, Shield, Bell,BellOff  } from "lucide-react";
import ProfileSidebar from "./ProfileSidebar" // make sure path is correct
import API from "../api/axios";

export default function UserProfileDropdown() {
  const { user, logout,updateUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setOpen(!open)

  const handleLogout = () => {
    logout()
    setOpen(false)
  }


  const handleToggleReminder = async () => {
  try {
    await API.patch("/users/togglereminder", {}, { withCredentials: true });
    
    // Immediately reflect the change in UI
  updateUser({ preferences: { ...user.preferences, reminderNotifications:!user?.preferences.reminderNotifications } });


  } catch (err) {
    console.error(err);
    alert("Failed to toggle reminder notifications");
  } 
};


  const handleViewProfile = () => {
    setSidebarOpen(true)
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className="relative w-full " ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200   focus:outline-none focus:ring-1   focus:ring-offset-2"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <div className="relative">
            <img
              src={user?.profilePic || "/public/image/profilepicture.png"}
              alt={`${user?.name || "User"} profile`}
              className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover hover:border-gray-400 shadow-gray-500 transition-colors duration-200"
            />
            {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 hidden sm:block ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40  bg-opacity-25 sm:hidden"
              onClick={() => setOpen(false)}
            />

            <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 transform transition-all duration-200 ease-out">
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>

              <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <img
                      src={user?.profilePic || "/public/image/profilepicture.png"}
                      alt={`${user?.name || "User"} profile`}
                      className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>

                  <h3 className="sm:text-lg text-sm font-semibold text-gray-900 mb-1 truncate max-w-full">
                    {user?.name || "User Name"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 truncate max-w-full">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium"
                    onClick={handleViewProfile}
                  >
                    <User className="w-4 h-4" />
                    <span className="sm:text-md text-xs" >View Profile</span>
                  </button>

                  <button
  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 font-medium 
    ${
      user?.preferences?.reminderNotifications
        ? "text-purple-600 bg-purple-50 hover:bg-purple-100"
        : "text-gray-500 bg-gray-100 hover:bg-gray-200"
    }`}
  onClick={handleToggleReminder}
>
  {user?.preferences?.reminderNotifications ? (
    <Bell className="w-4 h-4" />
  ) : (
    <BellOff className="w-4 h-4" />
  )}
  <span className="sm:text-md text-xs" >Reminders</span>
</button>


                  <div className="border-t border-gray-100 pt-2">
                    <button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="sm:text-md text-xs">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Profile Sidebar (Drawer) */}
      <ProfileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}


