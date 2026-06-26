import React, { useState, useEffect } from 'react';

// Default tasks loaded when the app is opened for the first time
const DEFAULT_TASKS = [
  { id: 1, title: "Explore Tick It Dashboard", status: "Pending", priority: "High" },
  { id: 2, title: "Review Simple Code with the Team", status: "Pending", priority: "Medium" },
  { id: 3, title: "Complete Col lege Viva Preparation", status: "Done", priority: "Low" }
];

export default function App() {
  // 1. Navigation state: controls which page is currently visible ('workspace' | 'about' | 'contact')
  const [currentPage, setCurrentPage] = useState('workspace');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. Simple Toast Notification state (one single toast message instead of a complex queue)
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info"); // 'success' | 'warning' | 'info' | 'danger'

  // Helper function to trigger a temporary toast notification
  const triggerToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    // Automatically hide after 3 seconds
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // 3. Simple Tasks State (Loads from localStorage, or uses defaults if empty)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tick_it_simple_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  // 4. Input Fields for adding a new task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");

  // 5. Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // 'ALL' | 'PENDING' | 'DONE'

  // Whenever tasks state updates, save them immediately
  useEffect(() => {
    localStorage.setItem('tick_it_simple_tasks', JSON.stringify(tasks));
  }, [tasks]);


  // CREATE: Adds a new task to the array list
  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskTitle.trim() === "") {
      triggerToast("Please write a task description first!", "warning");
      return;
    }

    const newTask = {
      id: Date.now(), // Generates simple unique ID based on current timestamp
      title: taskTitle.trim(),
      status: "Pending",
      priority: taskPriority
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle(""); // Clears the input field
    triggerToast("Task created successfully!", "success");
  };

  // UPDATE: Toggles status between "Pending" and "Done"
  const handleToggleTask = (id) => {
    const updated = tasks.map(task => {
      if (task.id === id) {
        const nextStatus = task.status === "Pending" ? "Done" : "Pending";
        triggerToast(
          nextStatus === "Done" ? "Task marked as Complete! 🎉" : "Task marked as Pending",
          "info"
        );
        return { ...task, status: nextStatus };
      }
      return task;
    });
    setTasks(updated);
  };

  // DELETE: Removes a task completely from the array list
  const handleDeleteTask = (id) => {
    const remaining = tasks.filter(task => task.id !== id);
    setTasks(remaining);
    triggerToast("Task deleted.", "danger");
  };


  // Filter and search tasks together dynamically
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeFilter === "ALL" ||
      (activeFilter === "PENDING" && task.status === "Pending") ||
      (activeFilter === "DONE" && task.status === "Done");
    return matchesSearch && matchesTab;
  });

  // Calculate stats to show in simple metrics panel
  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === "Done").length;
  const pendingCount = totalCount - doneCount;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;


  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans antialiased">
      
      {}
      {/* Absolute floating simple Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-fade-in">
          <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border shadow-xl backdrop-blur-md ${
            toastType === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
            toastType === 'warning' ? 'bg-amber-950/90 border-amber-500/30 text-amber-300' :
            toastType === 'danger' ? 'bg-red-950/90 border-red-500/30 text-red-300' :
            'bg-sky-950/90 border-sky-500/30 text-sky-300'
          }`}>
            <span className="font-bold text-sm">
              {toastType === 'success' && '✓ '}
              {toastType === 'warning' && '⚠ '}
              {toastType === 'danger' && '🗑 '}
              {toastType === 'info' && 'ℹ '}
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {}
      {/* Header Sticky Navigation Menu */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding Logo display */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => { setCurrentPage('workspace'); setMobileMenuOpen(false); }}
            >
              <img 
                src="tickIt.png-removebg-preview.png" 
                alt="Tick It Logo" 
                className="h-10 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(34,197,94,0.3)] hover:scale-105 transition-transform"
                onError={(e) => {
                  // Fallback logo placeholder in case image doesn't load locally
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-md font-extrabold tracking-widest uppercase bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Tick It
              </span>
            </div>

            {/* Desktop Navigation Link buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage('workspace')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  currentPage === 'workspace' 
                    ? "bg-slate-900 text-emerald-400 border border-slate-800" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Workspace
              </button>
              <button 
                onClick={() => setCurrentPage('about')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  currentPage === 'about' 
                    ? "bg-slate-900 text-emerald-400 border border-slate-800" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                About Team
              </button>
            </div>

            {/* Mobile burger navigation controller */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-400 hover:text-slate-100 p-2 text-xl focus:outline-none"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown display drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 py-2 px-4 space-y-1">
            <button 
              onClick={() => { setCurrentPage('workspace'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
            >
              Workspace
            </button>
            <button 
              onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
            >
              About Team
            </button>
          </div>
        )}
      </nav>

      {/* Main shell container layout */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">

        {}
        {/* VIEW 1: TASK MANAGEMENT WORKSPACE */}
        {currentPage === 'workspace' && (
          <div className="space-y-6">
            
            {/* Simple Top Indicator Banner */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Active Dashboard</p>
                <p className="text-[11px] text-slate-500 font-semibold tracking-wider">Group 5 Academic Submission</p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Main responsive grid setup splits 12-cols */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* SIDEBAR COLUMNS (Metric indicators & Add task form) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Simplified metrics analytics card */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Workspace Metrics</h3>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/40">
                      <p className="text-xl font-bold text-slate-100">{totalCount}</p>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">Total</p>
                    </div>
                    <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/40">
                      <p className="text-xl font-bold text-amber-400">{pendingCount}</p>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">Pending</p>
                    </div>
                    <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/40">
                      <p className="text-xl font-bold text-emerald-400">{doneCount}</p>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">Done</p>
                    </div>
                  </div>

                  {/* Clean progress completion line bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-semibold uppercase">Progress Bar</span>
                      <span className="font-bold text-slate-200">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/40">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Simple Create Task Panel Form */}
                <form onSubmit={handleAddTask} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Create Task</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Task Description</label>
                      <input 
                        type="text"
                        placeholder="Write something to accomplish..."
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 p-3 rounded-lg w-full text-xs focus:outline-none focus:border-slate-700 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['High', 'Medium', 'Low'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTaskPriority(p)}
                            className={`py-2 rounded-md text-[10px] font-bold uppercase transition-all border ${
                              taskPriority === p
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                                : 'bg-slate-950/40 text-slate-500 border-slate-905 hover:text-slate-300'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-lg text-xs font-extrabold uppercase transition-all shadow-md w-full mt-2"
                    >
                      Add Task
                    </button>
                  </div>
                </form>

              </div>

              {/* MAIN CONTENT WORKSPACE PANEL (Search, FilterTabs & Active Task List) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Integrated Search and Filtering tab header row */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <input 
                    type="text" 
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 px-3 py-2 rounded-lg text-xs w-full sm:max-w-xs focus:outline-none"
                  />

                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/50 w-full sm:w-auto">
                    {['ALL', 'PENDING', 'DONE'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex-1 sm:flex-none ${
                          activeFilter === tab 
                            ? "bg-slate-900 text-slate-100" 
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main dynamic tasks viewport render list */}
                <div className="space-y-2">
                  {filteredTasks.map((task) => {
                    const isDone = task.status === "Done";
                    return (
                      <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isDone 
                            ? "bg-emerald-950/5 border-emerald-950/10 opacity-60" 
                            : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80 shadow-sm"
                        }`}
                      >
                        {/* Task Left Actions: Checkbox + Text Title */}
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isDone}
                            onChange={() => handleToggleTask(task.id)}
                            className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                          />
                          <span className={`text-xs font-semibold leading-relaxed ${
                            isDone ? "text-slate-500 line-through" : "text-slate-200"
                          }`}>
                            {task.title}
                          </span>
                        </div>

                        {/* Task Right Actions: Priority Badge & Delete trigger */}
                        <div className="flex items-center gap-3">
                          {!isDone && (
                            <span className={`text-[8px] px-2 py-0.5 rounded font-extrabold uppercase tracking-widest border ${
                              task.priority === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                              task.priority === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                              'text-blue-400 bg-blue-500/10 border-blue-500/20'
                            }`}>
                              {task.priority}
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-600 hover:text-red-500 transition-colors p-1"
                            title="Delete Task"
                          >
                            ✕
                          </button>
                        </div>

                      </div>
                    );
                  })}

                  {filteredTasks.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-slate-800/60 rounded-xl bg-slate-900/10">
                      <span className="block text-2xl mb-1">🎉</span>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No Tasks Found</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {}
        {/* VIEW 2: ABOUT US */}
        {currentPage === 'about' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-xl space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-3xl font-black text-slate-100 tracking-wide">About Tick It</h2>
                <p className="text-xs uppercase tracking-widest text-emerald-400 mt-2">Lightweight academic task management</p>
              </div>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>
                  Tick It is a lightweight productivity application designed to help students manage academic tasks efficiently. Our project focuses on providing a clean, distraction-free interface with local data persistence, ensuring that student progress is saved across browser sessions.
                </p>
                <p>
                  This project was developed by a team of five students. Our development process included:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  <li><strong>UI &amp; Navbar Design</strong>: Focusing on a responsive, user-friendly layout.</li>
                  <li><strong>Logic &amp; CRUD Operations</strong>: Implementing core features to add, toggle, and delete tasks.</li>
                  <li><strong>Data Persistence</strong>: Using <code>localStorage</code> to ensure reliable offline data storage.</li>
                  <li><strong>Testing &amp; Documentation</strong>: Verifying application functionality through manual testing and maintaining structured, commented code to simplify future maintenance.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}