
// SubjectDashboard.jsx
import { Pencil, Trash2 } from "lucide-react";
import API from "../api/axios";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"



export default function SubjectDashboard() {
  const [subjects, setSubjects] = useState([
  ]);
  const { refreshUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [syllabus, setSyllabus] = useState("");

const [editingSubjectId, setEditingSubjectId] = useState(null);
const [editedName, setEditedName] = useState("");
const [isSaving, setIsSaving] = useState(false);


//editing a subject name

const handleDeleteSubject = async (subject) => {
  if (!window.confirm(`Are you sure you want to delete "${subject.name}"?`)) return;
      
  try {
      await API.delete(`/syllabus/delete-subject/${subject._id}`, {
      withCredentials: true,
    });

    // Remove from local state
    setSubjects((prevSubjects) =>
      prevSubjects.filter((s) => s._id !== subject._id)
    );
     await refreshUser();
  } catch (err) {
    console.error("Failed to delete subject:", err?.response?.data || err.message);
    alert("Failed to delete subject.");
  }
};

//navigating to chapters

const navigate = useNavigate();

const handleGoToSubject = (subject) => {
  navigate(`/subjects/${subject._id}`);
};


const handleEditSubject = (subject) => {
  setEditingSubjectId(subject._id);
  setEditedName(subject.name);
};

const handleSaveEdit = async () => {
  if (editedName.trim() === "") {
    alert("Subject name cannot be empty");
    return;
  }
   setIsSaving(true);
  try {
    await API.patch(
      "/syllabus/edit-subject-name",
      { subjectId:editingSubjectId ,
        newName: editedName },
      { withCredentials: true }
    );
   setSubjects(prevSubjects =>
      prevSubjects.map(sub =>
        sub._id === editingSubjectId ? { ...sub, name: editedName } : sub
      )
    );
     await refreshUser();
  } catch (err) {
    console.error("Failed to update subject:", err?.response?.data || err.message);
    alert("Failed to update subject");
  }finally {
     setEditingSubjectId(null);
    setEditedName("");
    setIsSaving(false);
  }
};




   // ✅ Move fetchSubjects outside so it's reusable
  const fetchSubjects = async () => {
    try {
      const res = await API.get("/syllabus/get-started", { withCredentials: true });
      const subjects = res.data.data.subjects;
      console.log("Fetched subjects:", subjects);

      if (Array.isArray(subjects)) {
        setSubjects(subjects);
      }
       await refreshUser();
    } catch (err) {
      console.error("Failed to fetch subjects:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchSubjects(); // ✅ runs on mount
  }, []);



 const handleAddSubject = async () => {
    if (newSubjectName.trim() === "" || syllabus.trim() === "") {
      alert("Please provide both subject name and syllabus");
      return;
    }

    try {
      const res = await API.patch(
        "/syllabus/upload-syllabus",
        {
          subjectName: newSubjectName,
          rawSyllabus: syllabus,
        },
        { withCredentials: true }
      );

      // ✅ Update UI with new subject
      await fetchSubjects();
      setNewSubjectName("");
      setSyllabus("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add subject:", err?.response?.data || err.message);
      alert("Failed to add subject please provide syllabus in the structured format as asked");
    }
  };

  return (
    <div className="min-h-screen  p-6">
       <div className="max-w-7xl mx-auto">
      <h1 className="sm:text-2xl text-lg font-bold mb-6 ">Your Subjects</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
         <div className="flex items-center justify-center">
            <Card className="w-full h-full max-h-[600px] overflow-hidden shadow-none border-none">
              <CardContent className="p-0 h-full">
                <img
                  src="/temp/syllabus-image.jpg"
                  alt="Students learning"
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          </div>

      <div className="grid  gap-4 h-full overflow-y-auto p-2 hide-scrollbar min-h-100  ">
       {subjects.map((subject, idx) => (
<div
  key={subject._id || idx}
  className=" shadow-amber-700 shadow-md rounded-lg p-2 border border-amber-100 hover:shadow-lg transition flex justify-between items-start max-h-30  "
>
  <div   className="flex-1 h-full">
    {editingSubjectId === subject._id ? (
      <input
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
         onBlur={() => {
    if (!isSaving) handleSaveEdit();
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isSaving) handleSaveEdit();
    }
  }}
        autoFocus
        className="text-lg font-semibold text-gray-800 border-b border-blue-500 focus:outline-none focus:ring-0 w-full"
      />
    ) : (
      <div onClick={() => handleGoToSubject(subject)}  className="w-full h-full p-2">
      <h2  className="sm:text-lg text-sm font-semibold text-gray-800">{subject.name}</h2>
      </div>
    )}
  </div>

  <div className="flex space-x-2">
    <button
      className="text-gray-500 hover:text-blue-600 transition"
      onClick={() => handleEditSubject(subject)}
      title="Edit"
    >
      <Pencil className="w-5 h-5" />
    </button>

    <button
      className="text-gray-500 hover:text-red-600 transition"
      onClick={() => handleDeleteSubject(subject)}
      title="Delete"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
</div>

))}

        {/* Add Subject Box */}
        <button
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 hover:border-black rounded-lg p-4 text-gray-600 hover:text-black transition-colors duration-200 max-h-30"
        >
          <Plus className="w-6 h-6 mb-2" />
          <span>Add Subject</span>
        </button>
      </div>
      </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >  
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Add New Subject</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
                <textarea
                  rows={8}
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Paste the syllabus here in the given format:
chapter 1: chapter's name
                 topic 1
                 topic 2
chapter 2: chapter's name
                 topic 1
                 topic 2           "
                  className="w-full px-3 py-2 border rounded-md resize-none overflow-y-auto focus:ring-2 focus:ring-amber-600"
                ></textarea>
              </div>

              <button
                onClick={handleAddSubject}
                className="w-full py-2 bg-amber-700 text-white font-medium rounded-md hover:bg-amber-800 transition"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
