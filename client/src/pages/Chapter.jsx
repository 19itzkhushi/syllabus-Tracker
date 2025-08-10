
import { useState ,useEffect} from "react";
import API from "../api/axios";
import { useParams,useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/Checkbox"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/seperator"
import { Edit, Trash2, BookOpen, CheckCircle, Clock, TrendingUp, Calendar, Target,Plus } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useAuth } from "../context/AuthContext";

const weeklyProgress = [
  { week: "Week 1", completed: 2 },
  { week: "Week 2", completed: 1 },
  { week: "Week 3", completed: 0 },
  { week: "Week 4", completed: 0 },
]

export default function Component() {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
   const { refreshUser } = useAuth();
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await API.get(`/syllabus/get-subject/${id}`, {
          withCredentials: true,
        });
        const subject2 = res.data.data;
        // setSubject(res.data.data); // adjust based on your actual API response shape
       
      const transformed = subject2.chapters?.map((chapter, index) => ({
        id: index + 1,
        realId :chapter._id,
        name: chapter.title,
        completed: chapter.completed || false,
        completedDate: chapter.completedOn || undefined,
      }));

      setChapters(transformed || []);
       await refreshUser();    
      } catch (err) {
        console.error("Error fetching subject:", err?.response?.data || err.message);
      } finally {
         setLoading(false);
      }
    };

    fetchSubject();
  }, [id,refreshTrigger]);


  //handle go to chapter

const navigate = useNavigate();

const handleGoToChapter = (chapter) => {
  navigate(`/topics/${id}/${chapter.realId}`);
};


  
    const [showForm, setShowForm] = useState(false);
//handle add chapter
 const [newChapter, setNewChapter] = useState("");

 const handleAddChapter = async () => {
    if (newChapter.trim() === "") {
      alert("Please provide chapter detail");
      return;
    }
    try {
      const res = await API.patch(
        "/syllabus/add-new-chapter",
        {
          subjectId: id,
          chapterTitle: newChapter,
        },
        { withCredentials: true }
      );

      // ✅ Update UI with new subject
      setRefreshTrigger((prev)=> !prev);
      setNewChapter("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add chapter:", err?.response?.data || err.message);
      alert("Failed to add chapter please provide chapter in the structured format as asked");
    }
  };




  const completedChapters = chapters.filter((chapter) => chapter.completed).length
  const totalChapters = chapters.length
  const progressPercentage = (completedChapters / totalChapters) * 100

 const toggleChapterCompletion = async (chapter) => {
  const chapterId = chapter.realId;
  const prevCompleted = chapter.completed;

  // Step 1: Optimistically update UI
  const updatedChapters = chapters.map((ch) =>
    ch.realId === chapterId
      ? {
          ...ch,
          completed: !prevCompleted,
          completedDate: !prevCompleted ? new Date().toISOString() : undefined,
        }
      : ch
  );
  setChapters(updatedChapters);
   
  try {
    // Step 2: Backend call
    await API.patch(`/syllabus/toggle-chapter/${id}/${chapterId}`, {
      withCredentials: true,
    });
    
    // Step 3: Refresh user if needed
    setRefreshTrigger((prev) => !prev);
     
  } catch (error) {
    // Step 4: Rollback if error
    const revertedChapters = chapters.map((ch) =>
      ch.realId === chapterId
        ? { ...ch, completed: prevCompleted }
        : ch
    );
    setChapters(revertedChapters);

    console.error("Failed to toggle chapter:", error?.response?.data || error.message);
  }
};


//edit chapter name

const [editingChapterId, setEditingChapterId] = useState(null);
const [editedName, setEditedName] = useState("");
const [isSaving, setIsSaving] = useState(false);

const handleEditChapter = (chapter) => {
  setEditingChapterId(chapter.realId);
  setEditedName(chapter.name);
};

const handleSaveEdit = async () => {
  if (editedName.trim() === "") {
    alert("chapter name cannot be empty");
    return;
  }
   setIsSaving(true);
  try {
    await API.patch(
      "/syllabus/edit-chapter-name",
      { subjectId:id ,
        chapterId:editingChapterId,
        newTitle: editedName },
      { withCredentials: true }
    );
      setChapters(
        chapters.map((chapter) =>
          chapter.realId === editingChapterId
            ? {
                ...chapter,
                name:editedName
              }
            : chapter,
        ),
      )
       setRefreshTrigger((prev)=> !prev);
  } catch (err) {
    console.error("Failed to update Chapter:", err?.response?.data || err.message);
    alert("Failed to update chapter");
  }finally {
    setRefreshTrigger((prev)=> !prev);
     setEditingChapterId(null);
    setEditedName("");
    setIsSaving(false);
  }
};

  const deleteChapter = async (chapter) => {
    // if (!window.confirm(`Are you sure you want to delete "${chapter.name}"?`)) return;
      const chapterId = chapter.realId;
    //  console.log(chapterId)
    
  try {
      await API.delete(`/syllabus/delete-chapter/${id}/${chapterId}`, {
      withCredentials: true,
    });

    // Remove from local state
    setChapters(chapters.filter((chapter) => chapter.realId !== chapterId));
    setRefreshTrigger((prev)=> !prev);
  } catch (err) {
    console.error("Failed to delete chapter:", err?.response?.data || err.message);
   
  }  

  }

  //  if (loading) return <div className="text-center py-10">Loading...</div>;
  // if (!subject) return <div className="text-center py-10 text-red-500">Subject not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl w-full p-4 ">
        <div className="mb-6 ">
          <h1 className="sm:text-3xl text-lg font-bold tracking-tight">Chapter Dashboard</h1>
          <p className="text-muted-foreground sm:text-lg text-sm">Track your learning progress and manage chapters</p>
        </div>

<div className="w-full px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto w-full">

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side - Progress Tracking */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 sm:text-2xl text-lg ">
                  <Target className="h-5 w-5" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32 ">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#22c55e"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${progressPercentage * 3.14} 314`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {completedChapters} of {totalChapters} chapters completed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2  gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex  items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{completedChapters}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{totalChapters - completedChapters}</p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    completed: {
                      label: "Completed",
                      color: "#22c55e",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgress}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completed" fill="#22c55e" radius={[4,4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card> */}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-md sm:text-lg">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              {chapters
  .filter((chapter) => chapter.completed && chapter.completedDate)
  .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate)) // 🔥 Sort newest first
  .slice(0,3)// take the top 3 most recent
  .map((chapter) => (
    <div key={chapter.id} className="flex items-center gap-3">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <div className="flex-1">
        <p className="text-sm font-medium">{chapter.name}</p>
        {/* <p className="text-xs text-muted-foreground">Completed on {chapter.completedDate}</p> */}
      </div>
    </div>
  ))}

{chapters.filter((chapter) => chapter.completed).length === 0 && (
  <p className="text-sm text-muted-foreground">No completed chapters yet</p>
)}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Chapter List */}
          <div className="lg:col-span-2 overflow-x-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-md sm:text-2xl">
                  <BookOpen className="h-5 w-5" />
                  Chapters
                </CardTitle>
                <CardDescription>Manage your learning chapters and track completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id}>
                      {editingChapterId === chapter.realId?
                      (
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
                      ):(
                      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <Checkbox
                          checked={chapter.completed}
                          onCheckedChange={() => toggleChapterCompletion(chapter)}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500  "
                        />

                        <div  onClick={() => handleGoToChapter(chapter)} className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="sm:text-sm text-xs font-medium text-muted-foreground">Chapter {chapter.id}</span>
                            {chapter.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 ">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <h3
                            className={`font-medium sm:text-lg text-sm ${chapter.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {chapter.name}
                          </h3>
                          {chapter.completed && chapter.completedDate && (
                            <p className="text-xs text-muted-foreground">Completed on {chapter.completedDate}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="sm:h-8 sm:w-8 w-4 h-4 text-muted-foreground hover:text-foreground"
                             onClick={() => handleEditChapter(chapter)}
                              title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit chapter</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="sm:h-8 sm:w-8 w-4 h-4 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteChapter(chapter)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete chapter</span>
                          </Button>
                        </div>
                      </div>
                      )}
                      {index < chapters.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                 
                  <div className=" w-full h-full mx-auto">
                          <button
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 hover:border-blue-500 rounded-lg p-4 w-full h-full text-gray-600 hover:text-blue-500 transition-colors duration-200"
        >
          <Plus className="w-6 h-6 mb-2" />
          <span>Add Chapter</span>
        </button>
                  </div>

                </div>

                {chapters.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No chapters available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      
  </div>
</div>

       {showForm && (
        <div className="fixed inset-0 z-50 flex  p-4 items-center justify-center bg-white/80  bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative border-1">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >  
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Add New Chapter</h2>

            <div className="space-y-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
                <textarea
                  rows={8}
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="Paste the Chapter detail here like: 
                                      Unit 1: trignometry 
                                              Introduction to trignometry
                                              Fundamentals of trignometry "
                  className="w-full px-3 py-2 border rounded-md resize-none overflow-y-auto focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                onClick={handleAddChapter}
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}

</div>

    </div>
  )
}
