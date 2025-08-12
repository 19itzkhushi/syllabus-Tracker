
import Footer from "./Footer";
import { useState,useEffect } from "react";
  import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/Badge"
import { useAuth } from "../context/AuthContext";
import { getWeeklyProgress } from "../lib/getWeeklyProgress";
import { Input} from "./ui/input";
import { useNavigate } from "react-router-dom";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  formatDistanceToNow,
  parseISO,
} from "date-fns";

import {
  BookOpen,
  Calendar,
  Clock,
  Target,
  Plus,
   X,
  CheckCircle2,
  AlertCircle,
  Star,
  Users,
  Bell,
  TrendingUp,
} from "lucide-react"
import API from "../api/axios";
import { toast } from "../hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function LandingPage() {

 const { user, loading,updateUser} = useAuth();
  const navigate = useNavigate();
const [showTaskForm, setShowTaskForm] = useState(false);
  const [about, setAbout] = useState("");
  const [reminder, setReminder] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
const [tasks, setTasks] = useState([]);
const [loadingTasks, setLoadingTasks] = useState(false);
const [refreshTasks, setRefreshTasks] = useState(false);
 const weeklyProgress = getWeeklyProgress(user); 
 

  useEffect(() => {
  const fetchTasks = async () => {
    if (!showTaskList) return;

    setLoadingTasks(true);
    try {
      const res = await API.get("/function/getAllTask", {
        withCredentials: true,
      });
     
      setTasks(res.data.data || []);
       
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  fetchTasks();
}, [refreshTasks, showTaskList]); 




const handleToggleComplete = async (taskId) => {
  try {
    await API.delete(
      `/function/deleteTask/${taskId}`,
      { withCredentials: true }
    );
const res = await API.get("/users/current-user", { withCredentials: true });
    updateUser(res.data.data); 
    setRefreshTasks(prev => !prev); // trigger refetch
  } catch (err) {
    console.error("Failed to update task:", err);
  }
};



 function calculateSubjectProgress(subject) {
  let totalUnits = 0;
  let completedUnits = 0;
   
  subject.chapters.forEach((chapter) => {
    if (chapter.topics && chapter.topics.length > 0) {
      // Chapter has topics: calculate based on topic completion
      chapter.topics.forEach((topic) => {
        totalUnits += 1;
        if (topic.isCompleted) {
          completedUnits += 1;
        }
      });
    } else {
      // No topics: calculate based on chapter completion
      totalUnits += 1;
      if (chapter.completed) {
        completedUnits += 1;
      }
    }
  });

  const progressPercentage = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;
  return Math.round(progressPercentage);
}



//add task

const handleAddTask = async () => {
  if (!about.trim() || !reminder) {
    alert("Please fill in both task and reminder.");
    return;
  }

  setLoading2(true);
  try {

     const reminderDateTime = new Date(reminder)
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
      "/function/addTask",
      { about, reminder },
      { withCredentials: true }
    );
    
const res = await API.get("/users/current-user", { withCredentials: true });
    updateUser(res.data.data); 

    setShowTaskForm(false);
    setAbout("");
    setReminder("");
    setRefreshTasks(prev => !prev); 
   
  } catch (err) {
   
     const message = err?.response?.data?.message || "Failed to add task";
     toast({
      title: "Error ❌",
      description: message,
      variant: "destructive",
    });
  } finally {
    setLoading2(false);
  }
};





  // Show a loader while checking login status
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Optionally redirect or show login if user is null
  
   
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
    <div className="min-h-screen pb-15 ">
      {/* Header */}
    

      <main className=" max-w-7xl mx-auto  px-4  py-8 w-full">
        {/* Welcome Section */}
        <div className="mb-8 w-full max-w-7xl mx-auto">
          {user?(
            <div>
          <h2 className="sm:text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h2>
          <p className="text-gray-600 text-sm sm:text-lg">Let's stay on track!</p>
          </div>
        ):(
          <div>
              <h2 className="sm:text-3xl font-bold text-gray-900 mb-2">Welcome to LearnFlow</h2>  
               <p className="text-gray-600 text-sm sm:text-lg">We are excited to have you here.Let's start this learning journey together.</p>
              
                <h1 className="sm:text-2xl text-sm font-bold text-gray-900 mt-3">Here’s how it works:</h1>

<p  className="sm:text-2xl text-sm ">1. You’ll start with a dashboard displaying all your subjects.

<p>2. Select any subject to view its associated chapters.</p>

<p>3. Click on a chapter to reveal all the topics under it.</p>
<p className="text-gray-600 mt-3">This intuitive structure helps you navigate your academic content seamlessly, track your progress chapter-by-chapter, and stay organized throughout your learning journey.</p>
</p>
               </div> 
          )
          }
         
        </div>

        {/* Subject Progress */}
        <div className="mt-4  bg-gradient-to-tr from-white to-blue-300 rounded-lg shadow-lg shadow-gray-300 max-w-7xl mx-auto w-full">
            <Card className="border-none">
              <CardHeader>
                <CardTitle className="sm:text-2xl text-md ">Subject Progress</CardTitle>
                <CardDescription className="sm:text-xl text-sm ">Track your progress across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                 {user?.syllabi?.map((syllabus) =>
  syllabus.subjects?.map((subject) => {
    const progress = calculateSubjectProgress(subject);
    return (
      <div key={subject._id}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{subject.name}</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-400" />
      </div>
    );
  })
)}
                </div>
              </CardContent>
            </Card>
            </div>


<div className="mt-8 bg-gradient-to-tr from-white to-blue-200 rounded-lg shadow-lg shadow-gray-300 max-w-7xl mx-auto w-full    ">
<Card className="border-none">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 sm:text-2xl text-md">
      <TrendingUp className="h-5 w-5" />
      Weekly Progress
    </CardTitle>
  </CardHeader>     
  <CardContent className="overflow-x-auto">
    <div className="max-w-7xl mx-auto  w-full"> {/* Adjust min-width as needed */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={weeklyProgress}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={40} // Set fixed width for bars
        >
          <XAxis className="text-xs"
  dataKey="week"
  tickFormatter={(dateStr) => {
    const date = new Date(dateStr);
    return `Week ${Math.ceil(date.getDate() / 7)} ${date.toLocaleString('default', { month: 'short' })}`;
  }}
/>
          <YAxis className="text-xs" />
          <Bar dataKey="completed" fill="green" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
</div>



        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5h</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.5h</span> from yesterday
              </p>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12/18</div>
              <p className="text-xs text-muted-foreground">67% completion rate</p>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">2 exams this month</p>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">Keep it up!</span>
              </p>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 ">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-tr from-white to-blue-200 rounded-lg shadow-lg shadow-gray-300 border-none">
              <CardHeader>
                <CardTitle className="sm:text-2xl text-md ">Task/Assignments</CardTitle>
                <CardDescription className="sm:text-lg text-sm ">Get started with your study session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


              <Button onClick={() => setShowTaskForm(true)} className="h-20 flex flex-col space-y-2">
  <Plus className="h-6 w-6" />
  <span className="text-sm">Add</span>
</Button>


   {showTaskForm && user && (
  <div className="fixed inset-0 z-50 p-6 flex items-center justify-center bg-white/50 bg-opacity-40 ">
    <Card className="relative my-4 p-4 w-full max-w-xl shadow-2xl bg-amber-100 border-none ">
      <button
        onClick={() => setShowTaskForm(false)}
        className="absolute top-2 right-2 p-1 text-2xl text-black"
      >
        ✕
      </button>

      <CardHeader>
        <CardTitle className="sm:text-2xl text-md ">Add a New Task</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="What is the task?"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            maxLength={100}
          />

          <Input
            type="datetime-local"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleAddTask}
              disabled={loading2}
              className="hover:shadow-blue-300  shadow-blue-200 shadow-md sm:text-md text-xs"
            >
              {loading2 ? "Adding..." : "Add Task"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTaskForm(false)}
              className="hover:shadow-red-300  shadow-red-200 shadow-md border-none sm:text-md text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}




                  {/* <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                    <Clock className="h-6 w-6" />
                    <span className="text-sm">Timer</span>
                  </Button> */}
                  <Button
  variant="outline"
  className="h-20 flex flex-col space-y-2 bg-transparent"
  onClick={() => setShowTaskList(true)}
>
  <Target className="h-6 w-6" />
  <span className="text-sm">All Tasks</span>
</Button>




            {showTaskList && (
  <div className="fixed inset-0 z-50 p-6 flex items-center justify-center bg-white/50 bg-opacity-40">
    <Card className="relative p-6 w-full max-w-xl max-h-[70vh] overflow-y-auto bg-amber-100 shadow-2xl rounded-xl border-none">
      <button
        onClick={() => setShowTaskList(false)}
        className="absolute top-2 right-2 p-1 text-2xl  text-gray-800"
      >
        ✕
      </button>

      <CardHeader className="border-b-2 border-black">
        <CardTitle className="sm:text-2xl text-md ">Your Tasks</CardTitle>
      </CardHeader>

      <CardContent className="pt-5 ">
        {loadingTasks ? (
          <p className="text-gray-600">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
      <ol className="space-y-3 list-decimal list-inside">
 {[...user.task]
  .sort((a, b) => new Date(a.reminder) - new Date(b.reminder))
  .map((task, index) => {
    const isOverdue = !task.isCompleted && new Date(task.reminder) < new Date();

    // Format deadline as "Today", "Tomorrow", or a readable date
    const getFriendlyDate = (dateStr) => {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const isToday =
        date.toDateString() === today.toDateString();
      const isTomorrow =
        date.toDateString() === tomorrow.toDateString();

      if (isToday) return "Today";
      if (isTomorrow) return "Tomorrow";
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    return (
      <li key={task._id} className="flex items-center justify-between">
        <div className="flex gap-2">
          <p>{index + 1}.</p>
          <div className="relative">
            {/* Red line if task is overdue and not completed */}
            <span
              className={` block text-sm ${
                isOverdue ? "line-through text-black" : ""
              }`}
            >
              {task.about}
            </span>

            <div className="flex items-center gap-1 text-xs text-orange-600 p-1">
              <Clock className="h-3 w-3" />
              Deadline: {getFriendlyDate(task.reminder)}
            </div>
          </div>
        </div>

        {/* Toggle complete icon (X from lucide-react) */}
        <div
          className="text-red-600 cursor-pointer hover:text-red-800"
          onClick={() => handleToggleComplete(task._id, task.isCompleted)}
        >
          <X className="w-4 h-4" />
        </div>
      </li>
    );
  })}

</ol>
        )}
      </CardContent>
    </Card>
  </div>
)}





        
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest study sessions and completed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed: Mathematics Assignment 3</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="secondary">Math</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Study session: Physics - Quantum Mechanics</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                    <Badge variant="secondary">Physics</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created: Chemistry Lab Report outline</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                    <Badge variant="secondary">Chemistry</Badge>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
    <Card className="bg-gradient-to-tr from-white to-blue-200 rounded-lg shadow-lg shadow-gray-300 border-none ">
  <CardHeader>
    <CardTitle className="sm:text-2xl text-md ">Upcoming Deadlines</CardTitle>
    <CardDescription>Don't miss these important dates</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {user?.task
        ?.filter((task) => !task.isCompleted) // only pending tasks
        ?.sort((a, b) => new Date(a.reminder) - new Date(b.reminder)) // sort by nearest
        ?.slice(0, 3) // top 3 upcoming
        ?.map((task) => {
          const date = new Date(task.reminder);
          let label = "";

          if (isToday(date)) label = "Today";
          else if (isTomorrow(date)) label = "Tomorrow";
          else label = format(date, "EEEE, p"); // e.g. Friday, 11:00 AM

          return (
            <div key={task._id} className="flex items-start space-x-3">
              <Calendar className="h-4 w-4 text-blue-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">{task.about}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
              <Badge variant="outline">
                {formatDistanceToNow(date, { addSuffix: true })}
              </Badge>
            </div>
          );
        })}
    </div>
  </CardContent>
</Card>

            {/* Weekly Goals */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Weekly Goals</CardTitle>
                <CardDescription>Track your weekly study targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Study 25 hours</span>
                      <span className="text-sm text-muted-foreground">18/25h</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Complete 15 tasks</span>
                      <span className="text-sm text-muted-foreground">12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Review 3 subjects</span>
                      <span className="text-sm text-muted-foreground">2/3</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Study Groups */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Study Groups</CardTitle>
                <CardDescription>Collaborate with your peers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Physics Study Group</p>
                      <p className="text-xs text-muted-foreground">5 members • Next: Thu 3PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Math Problem Solving</p>
                      <p className="text-xs text-muted-foreground">8 members • Next: Fri 7PM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Join New Group
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
      <Footer/>
    </div>
  )
}
