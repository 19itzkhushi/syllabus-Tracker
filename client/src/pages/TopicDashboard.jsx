
import { useState ,useEffect} from "react"
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button"
import { useAuth } from "../context/AuthContext.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/Checkbox"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import API from "../api/axios.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tab"
import {
  Clock,
  BookOpen,
  Link,
  Plus,
  Search,
  Filter,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { toast } from "../hooks/use-toast"

// Mock data matching your schema
// const initialTopics = [
//   {
//     _id: "1",
//     name: "React Fundamentals",
//     isCompleted: true,
//     notes: "Completed all basic concepts including hooks, state management, and component lifecycle.",
//     resources: [
//       { title: "React Official Docs", url: "https://react.dev" },
//       { title: "React Tutorial", url: "https://reactjs.org/tutorial" },
//     ],
//     reminder: new Date("2024-01-20T10:00:00"),
//   },
//   {
//     _id: "2",
//     name: "Node.js Backend Development",
//     isCompleted: false,
//     notes: "Currently learning Express.js and middleware concepts.",
//     resources: [{ title: "Node.js Guide", url: "https://nodejs.org/en/docs" }],
//     reminder: new Date("2024-01-25T14:00:00"),
//   },
//   {
//     _id: "3",
//     name: "Database Design",
//     isCompleted: false,
//     notes: "",
//     resources: [],
//     reminder: null,
//   },
//   {
//     _id: "4",
//     name: "API Development",
//     isCompleted: false,
//     notes: "Need to focus on RESTful principles and authentication.",
//     resources: [{ title: "REST API Tutorial", url: "https://restfulapi.net" }],
//     reminder: new Date("2024-01-22T09:00:00"),
//   },
// ]

export default function TopicDashboard() {

  const { subjectid, chapterid } = useParams();
  const [allChecked,setChecked] = useState(false);
   const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [topics, setTopics] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isReminderOpen, setIsReminderOpen] = useState(false)
  const [isResourceOpen, setIsResourceOpen] = useState(false)
  const [newResource, setNewResource] = useState({ title: "", url: "" })
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")
  const { refreshUser } = useAuth();


  //useEffect function

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await API.get(`/syllabus/get-chapter/${subjectid}/chapter/${chapterid}`, {
          withCredentials: true,
        });
        const chapter = res.data.data;
       
      const transformed = chapter.topics?.map((topic, index) => ({
        id: index + 1,
        realId :topic._id,
        name: topic.name,
        completed: topic.isCompleted || false,
        note:topic.notes || '',
        resources:topic.resources || undefined,
        reminder:topic.reminder || undefined
      }));
   
     const todayDate1 = new Date();
    
    const updated = transformed.map((t) => {
  if (new Date(t.reminder) < todayDate1) {
    return { ...t, reminder: null };
  }
  return t;
});

setTopics(updated || []);
      const allNowCompleted = transformed.every((t) => t.completed === true);
     setChecked(allNowCompleted);

      } catch (err) {
        console.error("Error fetching chapter:", err?.response?.data || err.message);
      } 
    };

    fetchChapter();
  }, [chapterid,refreshTrigger]);


  // Filter topics based on search and status
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && topic.completed) ||
      (filterStatus === "pending" && !topic.completed)
    return matchesSearch && matchesFilter
  })


  // Calculate progress statistics
  const completedCount = topics.filter((topic) => topic.completed).length
  const totalCount = topics.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const upcomingReminders = topics.filter((topic) => topic.reminder && new Date(topic.reminder) > new Date()).length


  const toggleTopicCompletion = async (topic) => {
  
    const topicId = topic.realId;

const prevCompleted = topic.completed;
  try {
     

  // Optimistically update UI

const updatedTopics = topics.map((t) =>
  t.realId === topicId ? { ...t, completed: !prevCompleted } : t
);

  setTopics(updatedTopics);
       await API.patch(`/function/toggle/${subjectid}/${chapterid}/${topicId}`, {
      withCredentials: true,
    });

     await refreshUser();


     const allNowCompleted = updatedTopics.every((t) => t.completed === true);
     setChecked(allNowCompleted);
      
   
  } catch (err) {
     setTopics(
      topics.map((t) =>
        t.realId === topicId ? { ...t, completed: prevCompleted } : t
      )
    );
    console.error("Failed to toggle topic:", err?.response?.data || err.message);
    
  }
  }

  const toggleAllTopics = async() =>{
    if(allChecked == false){
      const prevstate = allChecked;
       setChecked(true);
    try {
  // Optimistically update UI
  setTopics(
    topics.map((t) =>(
       { ...t, completed: true} )
    )
  );

       await API.patch("/function/all-done",{
        subjectId:subjectid,
        chapterId:chapterid
       } ,{
      withCredentials: true,
    });
      
  } catch (err) {
    setChecked(prevstate);
    setTopics(
    topics.map((t) =>(
      { ...t, completed: false})
    )
  );
    
    console.error("Failed to toggle topic:", err?.response?.data || err.message);
    
  }
   
    }else{
      const prevState = allChecked;
    
       setChecked(false);

      try {


      setTopics(
    topics.map((t) =>
      ( { ...t, completed: false})
    )
  );

       await API.patch("/function/all-undone",{
        subjectId:subjectid,
        chapterId:chapterid
       } ,{
      withCredentials: true,
    });
    
      
  } catch (err) {
    setChecked(prevState);
      setTopics(
    topics.map((t) =>(
       { ...t, completed: true} )
    )
  );
    
    console.error("Failed to toggle topic:", err?.response?.data || err.message);
    
  }


    }
  }

  // Update topic notes
  const updateNotes = async(topicId, note) => {
    
    try {
         await API.patch(
        "/function/update-notes",
        {
          subjectId: subjectid,
          chapterId: chapterid,
          topicId,
          note
        },
        { withCredentials: true }
      );

      setTopics(topics.map((topic) => (topic.realId === topicId ? { ...topic, note } : topic)))
      toast({
        title: "Note Saved",
        description: "Your note have been saved successfully.",
      })
    } catch (err) {
      console.error("Failed to add note", err?.response?.data || err.message);
      alert("Failed to add note");
     
    }
  }

  // Set reminder
  const setReminder = async(topicId) => {
    if (!reminderDate || !reminderTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for the reminder.",
        variant: "destructive",
      })
      return
    }

 try {
     const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`)
     const now = new Date();
 // rounds to nearest minute

if (reminderDateTime < now) {
  toast({
    title: "Error",
    description: "Reminder cannot be set for past date/time.",
    variant: "destructive",
  });
  return
}
       await API.post(
        "/function/set-reminder",
        {
          subjectId: subjectid,
          chapterId: chapterid,
          topicId,
          reminder:reminderDateTime
        },
        { withCredentials: true }
      );

     setTopics(topics.map((topic) => (topic.realId === topicId ? { ...topic, reminder: reminderDateTime } : topic)))
 
     toast({
       title: "Reminder Set! ⏰",
       description: `Reminder set for ${reminderDateTime.toLocaleString()}`,
     })
 } catch (error) {
   console.error("Failed to add chapter:", err?.response?.data || err.message);
      alert("Failed to add chapter please provide chapter in the structured format as asked");
 }finally{
    setIsReminderOpen(false)
    setReminderDate("")
    setReminderTime("")
 }
  }

  const removeReminder = async(topicId) =>{
     try {
        await API.post(
        "/function/remove-reminder",
        {
          subjectId: subjectid,
          chapterId: chapterid,
          topicId,
        },
        { withCredentials: true }
      );
   

     setTopics(topics.map((topic) => (topic.realId === topicId ? { ...topic, reminder:null } : topic)))
     } catch (err) {
       console.error("Failed to set reminder:", err?.response?.data || err.message);
     }
  }

  // Add resource
  const addResource = async(topicId) => {
    if (!newResource.url) {
      toast({
        title: "Error",
        description: "URL is required for adding a resource.",
        variant: "destructive",
      })
      return
    }
    

    try {
           await API.post(
          "/function/add-resource",
          {
            subjectId: subjectid,
            chapterId: chapterid,
            topicId,
            resource: newResource
          },
          { withCredentials: true }
        );
  
  
      setTopics(
        topics.map((topic) =>
          topic.realId === topicId
            ? {
                ...topic,
                resources: [...topic.resources, { ...newResource }],
              }
            : topic,
        ),
      )
  
      toast({
        title: "Resource Added",
        description: "New resource has been added successfully.",
      })
    } catch (err) {
      console.error("Failed to add resource:", err?.response?.data || err.message);
    }finally{
    setNewResource({ title: "", url: "" })
    setIsResourceOpen(false)
    }
  }

  // Remove resource
  const removeResource = async (topicId, resourceId) => {

   try {
           await API.patch(
           "/function/remove-resource",
           {
             subjectId: subjectid,
             chapterId: chapterid,
             topicId,
             resourceId
           },
           { withCredentials: true }
         )
 
 
     setTopics(
       topics.map((topic) =>
         topic.realId === topicId
           ? {
               ...topic,
               resources: topic.resources.filter((resource) => resource._id !== resourceId),
             }
           : topic,
       ),
     )
 
     toast({
       title: "Resource Removed",
       description: "Resource has been removed successfully.",
     })
   } catch (err) {
    console.error("Failed to add resource:", err?.response?.data || err.message);
   }
  }

  //add new topic
  const [showForm, setShowForm] = useState(false);
 const [newTopic, setNewTopic] = useState("");
  const addTopic = async() =>{
        if (newTopic.trim() === "") {
          alert("Please provide Topic name");
          return;
        }
        try {
           await API.patch(
            "/syllabus/add-topic",
            {
              subjectId: subjectid,
              chapterId:chapterid,
              topicName: newTopic,
            },
            { withCredentials: true }
          );
    
          // ✅ Update UI with new subject
          setRefreshTrigger((prev)=> !prev);
          setNewTopic("");
          setShowForm(false);
        } catch (err) {
          console.error("Failed to add Topic:", err?.response?.data || err.message);
        }
      
  }


  //remove topic
  const removeTopic = async(topic)=>{
     try {
           await API.delete(
            `/syllabus/delete-topic/${subjectid}/${chapterid}/${topic.realId}`,
          
            { withCredentials: true }
          );
    
          // ✅ Update UI with new subject
          setRefreshTrigger((prev)=> !prev);
          setNewTopic("");
          setShowForm(false);
        } catch (err) {
          console.error("Failed to add Topic:", err?.response?.data || err.message);
        }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="sm:text-3xl text-lg font-bold text-gray-900 mb-2">Learning Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-lg">Track your learning progress and manage your study topics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Progress Tracker */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-md sm:text-2xl">
                  <Target className="h-5 w-5 text-blue-600" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completed Topics</span>
                      <span>
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-gray-300" />
                    <p className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-md sm:text-2xl">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <Badge variant="secondary">{completedCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <Badge variant="secondary">{totalCount - completedCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Upcoming Reminders</span>
                    </div>
                    <Badge variant="secondary">{upcomingReminders}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-md sm:text-2xl">Quick Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button  onClick={() => setShowForm(true)}  className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Topic
                  </Button>

                  
                  
       {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 ">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-xl relative border-2">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >  
              ✕
            </button>
            <h2 className="sm:text-xl text-md font-semibold mb-4 text-center">Add New Topic</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Enter Topic name"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* <div>
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
              </div> */}

              <button
                onClick={addTopic}
                className="w-full py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}



                  {/* <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button> */}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-md sm:text-2xl">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Upcoming Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topics
                    .filter((topic) => topic.reminder && new Date(topic.reminder) > new Date())
                    .sort((a, b) => new Date(a.reminder) - new Date(b.reminder))
                    .slice(0, 3)
                    .map((topic) => (
                      <div key={topic._id} className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{topic.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(topic.reminder).toLocaleDateString()} at{" "}
                            {new Date(topic.reminder).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  {upcomingReminders === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No upcoming reminders</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Topics List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle className = "text-lg sm:text-2xl">Topics</CardTitle>
                  <div className="sm:flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 py-2 sm:py-0 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className=" max-w-32">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <Checkbox
                          checked={allChecked}
                           onCheckedChange={() => toggleAllTopics()}
                           className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-600 w-7 h-7 "
                        />
                    </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <div key={topic.realId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="sm:flex items-start gap-4">
                        <Checkbox
                          checked={topic.completed}
                          onCheckedChange={() => toggleTopicCompletion(topic)}
                           className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-600"
                        />

                        <div className="flex-1 ">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`font-medium ${topic.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                            >
                              {topic.name}
                            </h3>
                            {topic.completed && (
                              <Badge variant="secondary" className=" hidden sm:inline-block  text-xs bg-amber-200 text-amber-700">
                                Completed
                              </Badge>
                            )}
                          </div>

                          {topic.note && <p className="text-sm  text-gray-600 mb-2 line-clamp-2 m-h-4 overflow-y-scroll">{topic.note}</p>}

                          {topic.resources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {topic.resources.map((resource, index) => (
                                 <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm  hover:underline flex items-center gap-1"
                                            >
                                               <Badge key={index} variant="outline" className="text-xs">
                                               <Link className="h-3 w-3 mr-1" />
                                              {resource.title || "Resource"}
                                              </Badge>
                                            </a>
                              ))}
                            </div>
                          )}

                          {topic.reminder && (
                            <div className="flex items-center gap-1 text-xs text-orange-600">
                              <Clock className="h-3 w-3" />
                              Reminder: {new Date(topic.reminder).toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-2 items-center gap-1 ">
                          {/* Notes Dialog */}
                          <Dialog
                            open={isNotesOpen && selectedTopic?.realId === topic.realId}
                            onOpenChange={(open) => {
                              setIsNotesOpen(open)
                              if (open) setSelectedTopic(topic)
                            }}
                        >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <BookOpen className="h-4 w-4 " />
                              </Button>
                            </DialogTrigger>
                            <DialogContent >
                              <DialogHeader>
                                <DialogTitle className="text-md sm:text-lg">Notes for {topic.name}</DialogTitle>
                                <DialogDescription>Add or edit your notes for this topic</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Enter your notes here..."
                                  value={selectedTopic?.note || ""}
                                  onChange={(e) => setSelectedTopic({ ...selectedTopic, note: e.target.value })}
                                  rows={6}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setIsNotesOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant = "outline"
                                    onClick={() => {
                                      updateNotes(topic.realId, selectedTopic.note)
                                      setIsNotesOpen(false)
                                    }}
                                  >
                                    Save Notes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Reminder Dialog */}
                         
                        {topic.reminder==null?(<Dialog
                            open={isReminderOpen && selectedTopic?.realId === topic.realId}
                            onOpenChange={(open) => {
                              setIsReminderOpen(open)
                              if (open) setSelectedTopic(topic)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Clock className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-md sm:text-lg">Set Reminder for {topic.name}</DialogTitle>
                                <DialogDescription>
                                  Choose when you want to be reminded about this topic
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="reminder-date">Date</Label>
                                  <Input
                                    id="reminder-date"
                                    type="date"
                                    value={reminderDate}
                                    onChange={(e) => setReminderDate(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="reminder-time">Time</Label>
                                  <Input
                                    id="reminder-time"
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setIsReminderOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => setReminder(topic.realId)}>Set Reminder</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>):(
                            <Dialog
                            open={isReminderOpen && selectedTopic?.realId === topic.realId}
                            onOpenChange={(open) => {
                              setIsReminderOpen(open)
                              if (open) setSelectedTopic(topic)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Clock className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Remove Reminder for {topic.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => removeReminder(topic.realId)}>
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          )
                         }



                          {/* Resources Dialog */}
                          <Dialog
                            open={isResourceOpen && selectedTopic?.realId === topic.realId}
                            onOpenChange={(open) => {
                              setIsResourceOpen(open)
                              if (open) setSelectedTopic(topic)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Link className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-md sm:text-lg">Resources for {topic.name}</DialogTitle>
                                <DialogDescription>Manage your learning resources and references</DialogDescription>
                              </DialogHeader>
                              <Tabs defaultValue="view" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="view">View Resources</TabsTrigger>
                                  <TabsTrigger value="add">Add Resource</TabsTrigger>
                                </TabsList>
                                <TabsContent value="view" className="space-y-4 max-h-50 overflow-y-scroll">
                                  {topic.resources.length > 0 ? (
                                    <div className="space-y-3">
                                      {topic.resources.map((resource, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                          <div className="flex-1">
                                            <p className="font-medium">{resource.title || "Untitled Resource"}</p>
                                            <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                              {resource.url}
                                              <ExternalLink className="h-3 w-3" />
                                            </a>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeResource(topic.realId, resource._id)}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-center text-gray-500 py-8">No resources added yet</p>
                                  )}
                                </TabsContent>
                                <TabsContent value="add" className="space-y-4">
                                  <div>
                                    <Label htmlFor="resource-title">Title (Optional)</Label>
                                    <Input
                                      id="resource-title"
                                      placeholder="e.g., React Documentation"
                                      value={newResource.title}
                                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="resource-url">URL *</Label>
                                    <Input
                                      id="resource-url"
                                      placeholder="https://example.com"
                                      value={newResource.url}
                                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setNewResource({ title: "", url: "" })
                                        setIsResourceOpen(false)
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={() => addResource(topic.realId)}>Add Resource</Button>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                          <div>
                            <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeTopic(topic)}
                                >
                              <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete chapter</span>
                               </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredTopics.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No topics found</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Topic
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
