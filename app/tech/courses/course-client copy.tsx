// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Course, CategoryItem } from "@/types/course";
// import { motion } from "framer-motion";

// interface Props {
//   initialCourses: Course[];
//   initialCategories: CategoryItem[];
// }

// export default function CourseClient({ initialCourses, initialCategories }: Props) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // State
//   const [courses] = useState(initialCourses);
//   const [categories] = useState(initialCategories);
//   const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
//   const [selectedLevel, setSelectedLevel] = useState<string | null>(searchParams.get("level") || null);
//   const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
//   const [filteredCourses, setFilteredCourses] = useState(initialCourses);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [showFilterSheet, setShowFilterSheet] = useState(false);
//   const [tempCategory, setTempCategory] = useState(selectedCategory);
//   const [tempLevel, setTempLevel] = useState(selectedLevel);
//   const [snackbar, setSnackbar] = useState({ show: false, message: "" });

//   // Filter logic
//   useEffect(() => {
//     let filtered = [...courses];
//     if (selectedCategory !== "All") {
//       filtered = filtered.filter(c => c.category === selectedCategory);
//     }
//     if (selectedLevel) {
//       filtered = filtered.filter(c => c.level === selectedLevel);
//     }
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       filtered = filtered.filter(c =>
//         c.title.toLowerCase().includes(q) ||
//         c.description.toLowerCase().includes(q) ||
//         c.topics.some(t => t.toLowerCase().includes(q))
//       );
//     }
//     setFilteredCourses(filtered);
//   }, [courses, selectedCategory, selectedLevel, searchQuery]);

//   // Update URL
//   const updateUrl = useCallback(() => {
//     const params = new URLSearchParams();
//     if (selectedCategory !== "All") params.set("category", selectedCategory);
//     if (selectedLevel) params.set("level", selectedLevel);
//     if (searchQuery) params.set("q", searchQuery);
//     router.push(`/tech/courses${params.toString() ? `?${params}` : ""}`, { scroll: false });
//   }, [selectedCategory, selectedLevel, searchQuery, router]);

//   useEffect(() => {
//     updateUrl();
//   }, [selectedCategory, selectedLevel, searchQuery, updateUrl]);

//   // Helper functions (same as your HTML but converted to React)
//   const clearAllFilters = () => {
//     setSelectedCategory("All");
//     setSelectedLevel(null);
//     setSearchQuery("");
//     showSnackbarMessage("All filters cleared");
//   };

//   const showSnackbarMessage = (msg: string) => {
//     setSnackbar({ show: true, message: msg });
//     setTimeout(() => setSnackbar({ show: false, message: "" }), 3000);
//   };

//   const startLearning = (course: Course) => {
//     showSnackbarMessage(`🎓 Starting ${course.title}`);
//     setTimeout(() => {
//       // window.location.href = `/tech/${course.slug}`;
//  router.push(`/tech//${course.slug}`);
// //  router.push(`/tech/${course.category.toLowerCase()}/${course.slug}`);
//     }, 1000);
//   };

//   // Compute total stats
//   const totalStudents = courses.reduce((sum, c) => sum + (c.studentCount || 0), 0);
//   const totalTopics = courses.reduce((sum, c) => sum + (c.topics?.length || 0), 0);

//   // Render the UI – use the exact same HTML structure as your original,
//   // but replace all `onclick` with `onClick`, and use state variables.
//   // I'll provide a shortened version here; you should copy your full JSX
//   // and adapt the event handlers.

//   return (
//     <>
//       {/* App Bar (sticky header) */}
//       <header className="app-bar">
//         <div className="container app-bar-content">
//           <div className="app-bar-left">
//             <button className="back-btn" onClick={() => router.back()}>
//               <span className="material-icons">arrow_back_ios_new</span>
//             </button>
//             <div className="app-bar-title">
//               <h1>All Courses</h1>
//               <p>Browse and explore courses</p>
//             </div>
//           </div>
//           <div className="app-bar-actions">
//             <button className="icon-btn mobile-search-btn" onClick={() => document.getElementById("searchInput")?.focus()}>
//               <span className="material-icons">search</span>
//             </button>
//             <button className="icon-btn" onClick={() => setShowFilterSheet(true)}>
//               <span className="material-icons">filter_list</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main>
 

// {/* Hero Section */}
// <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
//   {/* Modern Background Decor */}
//   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
//     <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
//     <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-50 rounded-full blur-[100px] opacity-60" />
//   </div>

//   <div className="container relative z-10 max-w-5xl mx-auto px-4 text-center">
//     {/* Animated Badge */}
//     <motion.span 
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.15em] mb-8 shadow-xl shadow-slate-200"
//     >
//       <span className="relative flex h-2 w-2">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
//       </span>
//       {courses.length}+ Courses Live
//     </motion.span>

//     {/* Typography Upgrade */}
//     <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
//       Master Tech Skills <br />
//       <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500">
//         100% Free Forever
//       </span>
//     </h1>

//     <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
//       Access the world's most comprehensive library of technical mock interviews and tutorials. 
//       <span className="text-slate-900 font-semibold"> No subscriptions. No catch.</span> Just pure learning.
//     </p>

//     {/* Premium Search Bar */}
//     <div className="max-w-2xl mx-auto">
//       <div className="relative group p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 flex items-center transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
//         <div className="pl-4 pr-2 text-slate-400">
//           <svg className="w-5 h-5 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>
        
//         <input
//           type="search"
//           placeholder="Search courses by title, topic, or skill..."
// className="flex-1 py-3 bg-transparent outline-none ring-0 border-none focus:ring-0 focus:outline-none"          value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />

//         {searchQuery && (
//           <button 
//             className="p-2 mr-2 text-slate-300 hover:text-slate-500 transition-colors"
//             onClick={() => setSearchQuery("")}
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </button>
//         )}

//         <button className="hidden sm:flex px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-indigo-100 uppercase tracking-wider text-xs">
//           Search
//         </button>
//       </div>
      
//       {/* Quick Search Tags */}
//       <div className="mt-6 flex flex-wrap justify-center gap-3 items-center">
//         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Popular:</span>
//         {['Flutter', 'System Design', 'React', 'DSA'].map((tag) => (
//           <button 
//             key={tag}
//             className="text-xs font-semibold text-slate-500 hover:text-indigo-600 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full hover:bg-white hover:border-indigo-200 transition-all"
//             onClick={() => setSearchQuery(tag)}
//           >
//             {tag}
//           </button>
//         ))}
//       </div>
//     </div>
//   </div>
// </section>
//         {/* Stats Banner
//         <div className="stats-banner">
//           <div className="container">
//             <div className="stats-card">
//               <div className="stat-item">
//                 <div className="stat-value">{courses.length}+</div>
//                 <div className="stat-label">Free Courses</div>
//               </div>
//               <div className="stat-divider"></div>
//               <div className="stat-item">
//                 <div className="stat-value">{Math.round(totalStudents / 1000)}K+</div>
//                 <div className="stat-label">Active Learners</div>
//               </div>
//               <div className="stat-divider"></div>
//               <div className="stat-item">
//                 <div className="stat-value">{totalTopics}+</div>
//                 <div className="stat-label">Topics Covered</div>
//               </div>
//             </div>
//           </div>
//         </div> */}

//         {/* Categories Section */}
//         <section className="categories-section">
//           <div className="container">
//             <div className="section-header">
//               <h2>Popular Categories</h2>
//               <p>Explore courses by technology stack</p>
//             </div>
//             <div className="categories-grid">
//               {categories.map((cat) => (
//                 <div
//                   key={cat.name}
//                   className={`category-card ${selectedCategory === cat.name ? "selected" : ""}`}
//                   onClick={() => setSelectedCategory(cat.name)}
//                 >
//                   <div className="category-emoji">{cat.emoji}</div>
//                   <div className="category-name">{cat.name}</div>
//                   <div className="category-count">{cat.count} courses</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Courses Section */}
//         <section className="courses-section">
//           <div className="container">
//             <div className="courses-header">
//               <div className="courses-title">
//                 <h2>Available Courses</h2>
//                 <p>{filteredCourses.length} courses available</p>
//               </div>
//               {(selectedCategory !== "All" || selectedLevel || searchQuery) && (
//                 <button className="clear-filters-btn" onClick={clearAllFilters}>
//                   <span className="material-icons">clear</span>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="level-filters">
//               {["All Levels", "Beginner", "Intermediate", "Advanced"].map((level) => {
//                 const isSelected = (level === "All Levels" && !selectedLevel) || selectedLevel === level;
//                 const count = level === "All Levels" ? courses.length : courses.filter(c => c.level === level).length;
//                 return (
//                   <button
//                     key={level}
//                     className={`filter-chip ${isSelected ? "selected" : ""}`}
//                     onClick={() => setSelectedLevel(level === "All Levels" ? null : level)}
//                   >
//                     {level} ({count})
//                   </button>
//                 );
//               })}
//             </div>

//             {filteredCourses.length === 0 ? (
//               <div className="empty-state">
//                 <span className="material-icons">search_off</span>
//                 <h3>No courses found</h3>
//                 <p>Try adjusting your filters or search term</p>
//                 <button onClick={clearAllFilters}>
//                   <span className="material-icons">refresh</span>
//                   Clear all filters
//                 </button>
//               </div>
//             ) : (
//               <div className="courses-grid">
//                 {filteredCourses.map((course) => (
//                   <div key={course.id} className="course-card" onClick={() => setSelectedCourse(course)}>
//                     <div className="course-image" style={{ background: `linear-gradient(135deg, ${course.color}10 0%, ${course.color}05 100%)` }}>
//                       <span className="course-emoji">{course.emoji}</span>
//                       <div className="course-badge">
//                         <span className="material-icons">star</span>
//                         <span>{(course.rating || 4.5).toFixed(1)}</span>
//                       </div>
//                       <div className="course-level" style={{ background: `${course.color}26`, color: course.color }}>
//                         {course.level}
//                       </div>
//                     </div>
//                     <div className="course-content">
//                       <h3 className="course-title">{course.title}</h3>
//                       <p className="course-description">{course.description}</p>
//                       <div className="course-topics">
//                         {course.topics.slice(0, 2).map((topic) => (
//                           <span key={topic} className="topic-tag" style={{ background: `${course.color}14`, color: course.color, borderColor: `${course.color}26` }}>
//                             {topic}
//                           </span>
//                         ))}
//                       </div>
//                       <div className="course-meta">
//                         <div className="meta-item">
//                           <span className="material-icons">access_time</span>
//                           <span>{course.duration}</span>
//                         </div>
//                         <div className="meta-item">
//                           <span className="material-icons">people</span>
//                           <span>{Math.round((course.studentCount || 0) / 1000)}k</span>
//                         </div>
//                       </div>
//                       <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); startLearning(course); }}>
//                         Start Learning
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* CTA Section */}
//    {/* CTA Section */}
// <section className="py-20 relative overflow-hidden">
//   {/* Decorative background glow */}
//   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
//     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]" />
//   </div>

//   <div className="container max-w-6xl mx-auto px-4 relative z-10">
//     <div className="relative group overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-indigo-200/20">
      
//       {/* Decorative SVG Pattern */}
//       <svg className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none" fill="none" viewBox="0 0 400 400">
//         <defs>
//           <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
//             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#grid)" />
//       </svg>

//       <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
//         <div className="flex-1 text-center md:text-left">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
//             <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
//             Personalized Path
//           </div>
          
//           <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
//             Not sure where to <br />
//             <span className="text-indigo-400">start your journey?</span>
//           </h2>
          
//           <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
//             Take our 5-minute skill assessment. We'll analyze your current level and build a custom learning roadmap tailored to your career goals.
//           </p>
//         </div>

//         <div className="shrink-0">
//           <button 
//             onClick={() => showSnackbarMessage("🎓 Skill assessment coming soon!")}
//             className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all duration-300 shadow-xl active:scale-95"
//           >
//             <span className="relative z-10 flex items-center gap-3">
//               Take Assessment
//               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//               </svg>
//             </span>
//           </button>
          
//           <p className="mt-4 text-center text-slate-500 text-xs font-bold uppercase tracking-tighter">
//             No sign-up required
//           </p>
//         </div>
//       </div>

//       {/* Background Emoji Icon - Large and faded */}
//       <div className="absolute -bottom-10 -left-10 text-[12rem] opacity-[0.03] select-none pointer-events-none rotate-12">
//         🎯
//       </div>
//     </div>
//   </div>
// </section>

//       </main>

//       {/* Footer – same as your HTML */}
//       <footer className="footer">
//         <div className="container">
//           <div className="footer-content">
//             <div className="footer-brand">
//               <div className="footer-logo">
//                 <div className="logo-icon">RL</div>
//                 <span className="logo-text">RevoChamp</span>
//               </div>
//               <p className="footer-tagline">Making education accessible to everyone, everywhere. Free programming courses for developers of all levels.</p>
//             </div>
//             <nav className="footer-links">
//               <div className="footer-column">
//                 <h4>Explore</h4>
//                 <a href="/tech/courses">Courses</a>
//                 <a href="/tech/about">About</a>
//                 <a href="/tech/contact">Contact</a>
//                 <a href="/tech/blog">Blog</a>
//               </div>
//               <div className="footer-column">
//                 <h4>Legal</h4>
//                 <a href="/tech/privacy">Privacy Policy</a>
//                 <a href="/tech/terms">Terms of Service</a>
//                 <a href="/tech/cookies">Cookie Policy</a>
//               </div>
//               <div className="footer-column">
//                 <h4>Connect</h4>
//                 <a href="https://twitter.com/revochamp" target="_blank">Twitter</a>
//                 <a href="https://linkedin.com/company/revochamp" target="_blank">LinkedIn</a>
//                 <a href="https://github.com/revochamp" target="_blank">GitHub</a>
//               </div>
//             </nav>
//           </div>
//           <div className="footer-divider"></div>
//           <div className="footer-bottom">
//             <span>© 2026 RevoChamp. All rights reserved.</span>
//             <span>❤️ Made with passion for developers</span>
//           </div>
//         </div>
//       </footer>

//       {/* Course Detail Modal */}
//       {selectedCourse && (
//         <div className="modal-overlay show" onClick={() => setSelectedCourse(null)}>
//           <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-handle"></div>
//             <button className="modal-close" onClick={() => setSelectedCourse(null)}>
//               <span className="material-icons">close</span>
//             </button>
//             <div className="modal-header" style={{ background: `linear-gradient(135deg, ${selectedCourse.color}14 0%, ${selectedCourse.color}05 100%)` }}>
//               <span className="modal-emoji">{selectedCourse.emoji}</span>
//             </div>
//             <div className="modal-body">
//               <div className="modal-tags">
//                 <span className="modal-tag" style={{ background: `${selectedCourse.color}1a`, color: selectedCourse.color, borderColor: `${selectedCourse.color}33` }}>
//                   {selectedCourse.category}
//                 </span>
//                 <span className="modal-tag" style={{ background: "#1e3a8a1a", color: "#1e3a8a" }}>{selectedCourse.level}</span>
//                 <span className="modal-tag" style={{ background: "#10b9811a", color: "#10b981" }}>FREE</span>
//               </div>
//               <h2 className="modal-title">{selectedCourse.title}</h2>
//               <p className="modal-description">{selectedCourse.description}</p>
//               <div className="modal-meta">
//                 <div className="modal-meta-chip"><span className="material-icons">access_time</span><span>{selectedCourse.duration}</span></div>
//                 <div className="modal-meta-chip"><span className="material-icons">people</span><span>{Math.round((selectedCourse.studentCount || 0) / 1000)}k students</span></div>
//                 <div className="modal-meta-chip"><span className="material-icons">school</span><span>{selectedCourse.topics.length} modules</span></div>
//               </div>
//               <div className="modal-divider"></div>
//               <h3 className="modal-section-title">What You'll Learn</h3>
//               <ul className="modal-topics">
//                 {selectedCourse.topics.map((topic) => (
//                   <li key={topic} className="modal-topic-item">
//                     <span className="modal-topic-check"><span className="material-icons">check</span></span>
//                     <span className="modal-topic-text">{topic}</span>
//                   </li>
//                 ))}
//               </ul>
//               <button className="modal-btn" onClick={() => { startLearning(selectedCourse); setSelectedCourse(null); }}>
//                 Start Learning Free
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filter Sheet Modal */}
//       {showFilterSheet && (
//         <div className="modal-overlay show" onClick={() => setShowFilterSheet(false)}>
//           <div className="modal-sheet" style={{ maxWidth: 500, margin: "0 auto" }} onClick={(e) => e.stopPropagation()}>
//             <div className="modal-handle"></div>
//             <div className="filter-sheet">
//               <h3 className="filter-title">Filter Courses</h3>
//               <div className="filter-section">
//                 <h4>Category</h4>
//                 <div className="filter-chips">
//                   {categories.map((cat) => (
//                     <button
//                       key={cat.name}
//                       className={`filter-chip-select ${tempCategory === cat.name ? "selected" : ""}`}
//                       onClick={() => setTempCategory(cat.name)}
//                     >
//                       {cat.emoji} {cat.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="filter-section">
//                 <h4>Level</h4>
//                 <div className="filter-chips">
//                   {["All Levels", "Beginner", "Intermediate", "Advanced"].map((level) => {
//                     const isSelected = (level === "All Levels" && !tempLevel) || tempLevel === level;
//                     return (
//                       <button
//                         key={level}
//                         className={`filter-chip-select ${isSelected ? "selected" : ""}`}
//                         onClick={() => setTempLevel(level === "All Levels" ? null : level)}
//                       >
//                         {level}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//               <div className="filter-actions">
//                 <button className="btn-secondary" onClick={() => { setTempCategory("All"); setTempLevel(null); }}>
//                   Clear All
//                 </button>
//                 <button className="btn-primary" onClick={() => {
//                   setSelectedCategory(tempCategory);
//                   setSelectedLevel(tempLevel);
//                   setShowFilterSheet(false);
//                 }}>
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Snackbar */}
//       {snackbar.show && (
//         <div className="snackbar show">
//           <span className="material-icons">check_circle</span>
//           <span>{snackbar.message}</span>
//           <button onClick={() => setSnackbar({ show: false, message: "" })}>
//             <span className="material-icons">close</span>
//           </button>
//         </div>
//       )}
//     </>
//   );
// }