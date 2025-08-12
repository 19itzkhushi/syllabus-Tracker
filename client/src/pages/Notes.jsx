import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/input";
import {
  Plus,
  Search,
  FileText,
  Bookmark,
  File,
  Trash2,
  BookOpen,
} from "lucide-react";
import API from "../api/axios"; // Adjust the path based on your project structure

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showForm, setShowForm] = useState(false);
const [title, setTitle] = useState("");
const [text, setText] = useState("");
const [file, setFile] = useState(null);
const [selectedNote, setSelectedNote] = useState(null);
const [loading, setLoading] = useState(false);
const handleCardClick = (note) => {
  setSelectedNote(note);
};

  useEffect(() => {
    const fetchNotes = async () => {
    
      try {
        const res = await API.get("/function/getAllNotes", {
          withCredentials: true,
        });
        const notes2 = res.data.data.notes;
       

        const transformed = notes2?.map((note, index) => ({
          id: index + 1,
          realId: note._id,
          name: note.title,
          textFile: note.text || "",
          file: note.file || "",
        }));

        setNotes(transformed || []);
      } catch (err) {
        console.error("Error fetching notes:", err?.response?.data || err.message);
      } 
    };

    fetchNotes();
  }, [refreshTrigger]);


const handleAddNotes = async () => {
  if (!text.trim() || !file) {
    alert("Please provide both description and notes file.");
    return;
  }

    if (loading) return;
   setLoading(true); 
  try {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (text) formData.append("text", text);
    if (file) formData.append("file", file); // file should be a File object from input

    const res = await API.post("/function/addNotes", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ Update UI
    setRefreshTrigger(prev => !prev);
    setTitle("");
    setText("");
    setFile(null);
    setShowForm(false);

  } catch (err) {
    console.error("Failed to add note:", err?.response?.data || err.message);
    alert("Failed to add note. Please try again.");
  } finally {
    setLoading(false); // ✅ End loading
  }
};


const deleteNote = async (noteId) => {
  
  try {
    const res = await API.delete(`/function/deleteNote/${noteId}`, {
     withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

     setSelectedNote(null);
     setRefreshTrigger(prev => !prev);

   
    // Refresh your notes list
  } catch (err) {
    console.error("Failed to delete note:", err?.response?.data || err.message);
  }
};


  



  return (
    <div className="p-8 ">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="sm:text-3xl font-bold text-gray-900 mb-2">Notes</h1>
          <p className="text-gray-600 sm:text-lg text-xs">Organize your study notes and materials</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
         <Plus className="h-5 w-5 mr-2" />
           Add Notes
        </Button>
      </div>

      {/* Search Input */}
      <Card className="mb-6 w-full border-0 relative shadow-none">
        <CardContent className=" w-full flex justify-end p-0 ">
          <div className="relative flex-1 sm:w-94 max-w-md shadow-sm shadow-gray-500  rounded-lg border-gray-600 border-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-none ring-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* No Notes Message */}
      { notes.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notes available</p>
        </div>
      )}

      {/* Notes Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full max-w-7xl mx-auto max-h-200  overflow-y-auto ">
  {notes
    .filter((note) =>
      note.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((note) => (
      <div key={note.realId} className="flex justify-center">
        <Card
          onClick={() => handleCardClick(note)}
          className=" w-full hover:shadow-xl transition-shadow border-none cursor-pointer shadow-lg shadow-gray-400 "
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm sm:text-lg">{note.name || "Title"}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 truncate">
                {note.textFile?.slice(0, 60)}...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    ))}
</div>



{showForm && (
     <div className="fixed inset-0 z-50 p-4 flex items-center justify-center  bg-opacity-40">
  <Card className="relative my-4 p-4 w-full  max-w-2xl shadow-2xl  bg-gray-50">
      <button
        onClick={() => setShowForm(false) && setLoading(false)}
        className="absolute top-2 right-2 p-1 text-2xl text-black"
      >
        ✕
      </button>
    <CardHeader> 
      <CardTitle className="text-md sm:text-lg">Add a New Note</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Title (optional)"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className=" w-full  border border-gray-300 rounded p-2"
          rows={2}
           maxLength={100}
          placeholder="Description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-blue-800"
        />
        <div className="flex gap-2">
          <Button onClick={handleAddNotes}  disabled={loading} className="hover:shadow-lg ;shadow-blue-200 shadow-sm shadow-blue-300">  {loading ? "Uploading..." : "Submit"} </Button>
          <Button variant="outline" onClick={() => setShowForm(false) && setLoading(false)} className="hover:shadow-lg ;shadow-red-200 shadow-sm shadow-red-300 border-none">
            Cancel
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
  </div>
)}

{selectedNote && (
  <div className="fixed inset-0 p-4 bg-gray-500/90 bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white  p-6 rounded-lg shadow-lg w-full max-w-lg relative border border-gray-400">
      <button
        className="absolute top-2 right-2 text-gray-600 "
        onClick={() => setSelectedNote(null)}
      >
        ✕
      </button>
  <div className="flex items-center justify-between">
  <div className="flex items-center space-x-2">
    <h2 className="sm:text-2xl text-md font-semibold p-1">{selectedNote.name || "Title"}</h2>
    {selectedNote.file && (
      <a
        href={selectedNote.file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 p-2"
      >
        <File />
      </a>
    )}
  </div>

  <button onClick={() => deleteNote(selectedNote.realId)}>
    <Trash2 className="text-red-500 hover:text-red-700 mr-2" />
  </button>
</div>

      {selectedNote.textFile && (
        <div className="mb-4 max-h-[70vh]  overflow-y-auto relative mt-5 border-t-gray-500 border-t-2 pt-3">
          <h4 className="text-sm text-gray-500 font-medium">Description:</h4>
          <p className="whitespace-pre-wrap text-gray-700">
            {selectedNote.textFile}
          </p>
        </div>
      )}
 
    </div>
  </div>
)}




    </div>



  );
};

export default NotesPage;
