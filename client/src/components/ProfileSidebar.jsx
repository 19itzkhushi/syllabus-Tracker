import { useState } from "react"
import { X, User, Mail, Lock, Camera, Check, AlertCircle,Trash2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import API from "../api/axios"

export default function ProfileSidebar({ isOpen, onClose }) {
  const { user, updateUser } = useAuth()
  const [activeSection, setActiveSection] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const removeAvatar = async()=>{
     try {
      
        const res = await API.patch("/users/remove-avatar",{}, { withCredentials: true });
      
        updateUser({ profilePic: "temp/profilepicture.png" });


     } catch (error) {
      alert("error here")
       console.log("Error:- ",error)
     }
  }

  const handleSubmit = async (section) => {
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (section) {

        case "profile":
  if (formData.profilePic) {
    try {
      const fileData = new FormData();
      fileData.append("profilePic", formData.profilePic);

      const res = await API.patch("/users/avatar", fileData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser({ profilePic: res.data.data.profilePic }); // immediately update UI

      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Failed to update profile picture.",
      });
    }
  }
  break;

        
        case "username":
          if (formData.username) {
           
        try {

       const updatedName = formData.username;
       const currentEmail = user?.email;

        await API.patch("/users/update-account", {fullName:updatedName,email:currentEmail}, { withCredentials: true });
 
         // Immediately reflect the change in UI
          updateUser({ name: updatedName })
           setMessage({ type: "success", text: "Username updated successfully!" })

          } catch (err) {
           console.error(err);
            setMessage({ type: "error", text: "Failed to update username" })
           }      
          }else{
            setMessage({ type: "error", text: "Failed to update username" })
            }
          break
        
        
          case "email":
          if (formData.email) {
       try {

       const updatedEmail = formData.email;
       const currentname = user?.name;

        await API.patch("/users/update-account", {fullName:currentname,email:updatedEmail}, { withCredentials: true });
 
         // Immediately reflect the change in UI
         updateUser({ email: updatedEmail })
        setMessage({ type: "success", text: "Email updated successfully!" })
          } catch (err) {
           console.error(err);
           setMessage({ type: "error", text: "Failed to update email" })
           }  
         
          }else{
            setMessage({ type: "error", text: "Failed to update email" })
            }
          break


        case "password":
          if (formData.currentPassword && formData.newPassword && (formData.newPassword == formData.confirmPassword)) {


              try {

       const oldPassword = formData.currentPassword;
       const updatedPassword = formData.newPassword;

        await API.post("/users/change-password", {oldPassword,newPassword:updatedPassword}, { withCredentials: true });
 
        setMessage({ type: "success", text: "Password updated successfully!" })
          } catch (err) {
           console.error(err);
           alert("Failed to change password");
           setMessage({ type: "error", text: "please fill current password correctly" })
           } 
            
          } else {
            if(formData.newPassword != formData.confirmPassword){
              setMessage({ type: "error", text: "please fill confirm password same as new password" })
            }else{
            setMessage({ type: "error", text: "Please fill in all password fields!" })
            }
          }
          break
        default:
          break
      }

      if (message.type === "success") {
        setTimeout(() => {
          setActiveSection(null)
          setFormData({})
          setMessage({ type: "", text: "" })
        }, 2000)
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => {
    switch (activeSection) {
      case "profile":
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Profile Picture</label>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user?.profilePic || "/temp/profilepicture.png"}
            alt="Current profile"
            className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
          />
        </div>
      </div>
      {user?.profilePic === "/temp/profilepicture.png" ? (
 <div>
          <button
      className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg transition"
    >
      <Trash2 size={18} />
      <span>Delete Avatar</span>
    </button>
         </div>
) : (
  <div>
          <button
        onClick={removeAvatar}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      <Trash2 size={18} />
      <span>Delete Avatar</span>
    </button>
         </div>
)}
         
      <div>
       
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange("profilePic", e.target.files[0])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );


      case "username":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Username</label>
            <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">{user?.name}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Username</label>
            <input
              type="text"
              placeholder="Enter new username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.username || ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
        )

      case "email":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
            <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">{user?.email}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Email</label>
            <input
              type="email"
              placeholder="Enter new email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
        )

      case "password":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.currentPassword || ""}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.newPassword || ""}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.confirmPassword || ""}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!activeSection ? (
              <>
                <div className="p-6 border-b border-gray-200 text-center">
                  <div className="relative mb-4">
                    <img
                      src={user?.profilePic || "/public/image/profilepicture.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover shadow-sm"
                    />
                    <div  />
                  </div>
                  
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>

                <div className="p-6 space-y-3">
                  {[
                    { label: "Change Profile Picture", icon: <Camera className="text-blue-600 w-5 h-5" />, key: "profile" },
                    { label: "Change Username", icon: <User className="text-green-600 w-5 h-5" />, key: "username" },
                    { label: "Change Email Address", icon: <Mail className="text-purple-600 w-5 h-5" />, key: "email" },
                    { label: "Change Password", icon: <Lock className="text-red-600 w-5 h-5" />, key: "password" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition duration-200 text-left"
                    >
                      {item.icon}
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6">
                <button
                  onClick={() => {
                    setActiveSection(null)
                    setFormData({})
                    setMessage({ type: "", text: "" })
                  }}
                  className="text-blue-600 hover:text-blue-700 mb-6"
                >
                  ← Back to Settings
                </button>

                <h3 className="text-lg font-semibold mb-6">
                  {activeSection === "profile" && "Change Profile Picture"}
                  {activeSection === "username" && "Change Username"}
                  {activeSection === "email" && "Change Email Address"}
                  {activeSection === "password" && "Change Password"}
                </h3>

                {renderForm()}

                {message.text && (
                  <div
                    className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleSubmit(activeSection)}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection(null)
                      setFormData({})
                      setMessage({ type: "", text: "" })
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
