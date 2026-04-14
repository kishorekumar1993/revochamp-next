"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const courses = [
  {
    id: 1,
    title: "Learning Hub",
    slug: "learning",
    description:
      "Structured courses and tutorials to build strong fundamentals",
    emoji: "📘",
    color: "#1e40af",
    rating: 4.9,
    level: "Beginner",
    category: "Learning",
    duration: "Self-paced",
    studentCount: 15234,
    topics: ["Courses", "Tutorials", "Practice", "Projects", "Guides"],
  },
  {
    id: 2,
    title: "Mock Interviews",
    slug: "mock-interview",
    description: "Practice real-world interview questions with guided answers",
    emoji: "🎯",
    color: "#047857",
    rating: 4.8,
    level: "Intermediate",
    category: "Mock Interview",
    duration: "Flexible",
    studentCount: 28945,
    topics: ["DSA", "System Design", "HR Questions", "Coding", "Behavioral"],
  },
  {
    id: 3,
    title: "Developer Tools",
    slug: "tools",
    description: "Boost productivity with powerful developer tools",
    emoji: "🛠️",
    color: "#6b21a8",
    rating: 4.7,
    level: "All Levels",
    category: "Tools",
    duration: "On-demand",
    studentCount: 12456,
    topics: [
      "Code Generators",
      "API Tester",
      "UI Builder",
      "Automation",
      "Debugging",
    ],
  },
  {
    id: 4,
    title: "Tech Blog",
    slug: "blog",
    description: "Read insights, tutorials, and latest tech trends",
    emoji: "✍️",
    color: "#0369a1",
    rating: 4.9,
    level: "All Levels",
    category: "Blog",
    duration: "Quick Reads",
    studentCount: 9876,
    topics: [
      "Articles",
      "Tutorials",
      "Best Practices",
      "Trends",
      "Case Studies",
    ],
  },
];

const categories = [
  { name: "Frontend", emoji: "🎨", color: "#1e40af", count: 5 },
  { name: "Backend", emoji: "⚙️", color: "#047857", count: 3 },
  { name: "DevOps", emoji: "☁️", color: "#6b21a8", count: 2 },
  { name: "AI & ML", emoji: "🤖", color: "#9f1239", count: 2 },
  { name: "Mobile", emoji: "📱", color: "#0369a1", count: 2 },
];

export default function Home() {
  const router = useRouter(); // ✅ Must be before any function that uses it

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const snackbarTimeoutRef = useRef<NodeJS.Timeout>(); // ✅ Proper cleanup

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);
    snackbarTimeoutRef.current = setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      const results = courses
        .filter(
          (course) =>
            course.title.toLowerCase().includes(value.toLowerCase()) ||
            course.description.toLowerCase().includes(value.toLowerCase()) ||
            course.topics.some((t) =>
              t.toLowerCase().includes(value.toLowerCase())
            )
        )
        .slice(0, 3);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  const scrollToCourses = () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  const startLearning = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    showSnackbarMessage(`🎓 Starting ${course.title}`);
    setShowModal(false);

    switch (course.slug) {
      case "learning":
        router.push("/tech/courses");
        break;
      case "mock-interview":
        router.push("/interview");
        break;
      case "tools":
        router.push("/tools");
        break;
      case "blog":
        window.open("https://revochamp.site/blog/", "_blank");
        break;
      default:
        router.push(`/courses/${course.slug}`);
    }
  };

  const navigateTo = (page: string) => {
    switch (page) {
      case "about":
        router.push("/about");
        break;
      case "contact":
        router.push("/contact");
        break;
      case "privacy":
        router.push("/privacy");
        break;
      case "terms":
        router.push("/terms");
        break;
      case "courses":
        router.push("/tech/courses");
        break;
      default:
        showSnackbarMessage(`Navigating to ${page} page`);
    }
  };

  const filterByCategory = (category: string) => {
    showSnackbarMessage(`Filtering by ${category} coming soon`);
  };

  const createCourseCard = (course: any) => (
    <div
      key={course.id}
      className="course-card"
      onClick={() => {
        setSelectedCourse(course);
        setShowModal(true);
      }}
    >
      <div
        className="course-image"
        style={{
          background: `linear-gradient(135deg, ${course.color}10 0%, ${course.color}05 100%)`,
        }}
      >
        <span className="course-emoji">{course.emoji}</span>
        <div className="course-rating">
          <span className="material-icons">star</span>
          <span>{course.rating}</span>
        </div>
        <div
          className="course-level"
          style={{ background: `${course.color}26`, color: course.color }}
        >
          {course.level}
        </div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="course-topics">
          {course.topics.slice(0, 2).map((topic: string) => (
            <span
              key={topic}
              className="topic-tag"
              style={{
                background: `${course.color}14`,
                color: course.color,
                borderColor: `${course.color}26`,
              }}
            >
              {topic}
            </span>
          ))}
        </div>
        <div className="course-meta">
          <div className="meta-item">
            <span className="material-icons">access_time</span>
            <span>{course.duration}</span>
          </div>
          <div className="meta-item">
            <span className="material-icons">people</span>
            <span>{(course.studentCount / 1000).toFixed(0)}k</span>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            startLearning(course.id);
          }}
        >
          Start Learning
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Cleanup snackbar timeout on unmount
  useEffect(() => {
    return () => {
      if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* App Bar */}
      <header className="app-bar">
        <div className="container app-bar-content">
          <div
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="logo-icon">
              <img
                src="/logo.png"
                alt="RevoChamp"
                width="28"
                height="28"
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="logo-text">RevoChamp</span>
          </div>
          <nav className="nav-menu">
            <button
              className="btn-outline"
              onClick={() => showSnackbarMessage("Login feature coming soon")}
            >
              Sign In
            </button>
            <button
              className="btn-primary"
              onClick={() => showSnackbarMessage("Sign up feature coming soon")}
            >
              Get Started
            </button>
          </nav>
          <button
            className="mobile-menu-btn"
            onClick={() => showSnackbarMessage("Menu coming soon")}
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <span className="hero-badge" >
              ✨ 100% Free Learning
            </span>
            <h1 className="hero-title">
              From first line of code
              <br />
              to <span className="hero-title-gradient">your dream offer</span>
            </h1>
            <p className="hero-description">
              The ultimate developer’s toolkit. Real-world projects, daily tech
              insights, and elite interview preparation. Everything you need to
              lead in tech, at zero cost
            </p>
            <div className="search-container">
              <div className="search-bar">
                <span className="material-icons">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search courses..."
                />
                {searchQuery && (
                  <button className="clear-search" onClick={clearSearch}>
                    <span className="material-icons">close</span>
                  </button>
                )}
                <button onClick={() => handleSearch(searchQuery)}>
                  Search
                </button>
              </div>
            </div>
            <button className="btn-primary-large" onClick={scrollToCourses}>
              Explore All Courses →
            </button>
          </div>
        </section>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <section className="search-results-section">
            <div className="container">
              <div className="section-header">
                <h2>Search Results ({searchResults.length})</h2>
                <Link href="/tech/courses" className="view-all-link">
                  View All Courses →
                </Link>
              </div>
              <div className="courses-grid">
                {searchResults.map(createCourseCard)}
              </div>
            </div>
          </section>
        )}

        {/* Featured Courses */}
        <section className="featured-section" id="courses">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Featured Courses</h2>
                <p className="section-subtitle">
                  4 hand-picked courses to get you started
                </p>
              </div>
              <Link href="/tech/courses" className="view-all-link">
                Browse All →
              </Link>
            </div>
            <div className="courses-grid">
              {courses.slice(0, 4).map(createCourseCard)}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-subtitle">Explore courses by topic</p>
            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="category-card"
                  onClick={() => filterByCategory(cat.name)}
                >
                  <div className="category-emoji">{cat.emoji}</div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.count} courses</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-section" id="about">
          <div className="container">
            <h2 className="section-title">Why Choose RevoChamp?</h2>
            <p className="section-subtitle">What makes us different</p>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-emoji">🎓</div>
                <h3 className="feature-title">Expert-Led</h3>
                <p className="feature-description">
                  Learn from industry professionals
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-emoji">💰</div>
                <h3 className="feature-title">Always Free</h3>
                <p className="feature-description">
                  No hidden costs or subscriptions
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-emoji">🚀</div>
                <h3 className="feature-title">Practical Skills</h3>
                <p className="feature-description">
                  Build job-ready portfolios
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-emoji">📈</div>
                <h3 className="feature-title">Lifetime Access</h3>
                <p className="feature-description">Learn at your own pace</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-card">
              <div className="stats-icon">📊</div>
              <h2 className="stats-title">Impact Numbers</h2>
              <p className="stats-subtitle">Trusted by learners worldwide</p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Learners</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📚</div>
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Courses</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-number">4.8</div>
                  <div className="stat-label">Avg Rating</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🎁</div>
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Free</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial-section">
          <div className="container">
            <div className="testimonial-card">
              <div className="testimonial-heart">❤️</div>
              <h2 className="testimonial-title">What Our Learners Say</h2>
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-icons">
                      star
                    </span>
                  ))}
                </div>
                <p className="testimonial-text">
                  "RevoChamp completely transformed my career. The quality of
                  courses is outstanding, and the fact that it's free makes it
                  truly revolutionary. I went from a complete beginner to
                  landing my first developer job in 6 months!"
                </p>
                <p className="testimonial-author">— Sarah Johnson</p>
                <p className="testimonial-role">Frontend Developer</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2 className="cta-title">Ready to Transform Your Career?</h2>
              <p className="cta-description">
                Join thousands of successful learners already mastering
                in-demand tech skills for free
              </p>
              <button className="btn-primary-large" onClick={scrollToCourses}>
                Browse All Courses →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-logo">
                <div className="logo-icon">
                  <img
                    src="/logo.png"
                    alt="RevoChamp"
                    width="28"
                    height="28"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <span className="logo-text">RevoChamp</span>
              </div>
              <p className="footer-tagline">
                Making education accessible
                <br />
                to everyone, everywhere.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Explore</h4>
                <Link href="/tech/courses">Courses</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <button
                  onClick={() =>
                    showSnackbarMessage("Cookie settings coming soon")
                  }
                >
                  Cookies
                </button>
              </div>
              <div className="footer-column">
                <h4>Connect</h4>
                <button
                  onClick={() => showSnackbarMessage("Twitter coming soon")}
                >
                  Twitter
                </button>
                <button
                  onClick={() => showSnackbarMessage("LinkedIn coming soon")}
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => showSnackbarMessage("GitHub coming soon")}
                >
                  GitHub
                </button>
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <span className="footer-copyright">
              © 2026 RevoChamp. All rights reserved.
            </span>
            <span className="footer-made">❤️ Made with passion</span>
          </div>
        </div>
      </footer>

      {/* Snackbar */}
      <div className={`snackbar ${showSnackbar ? "show" : ""}`}>
        <span className="material-icons">check_circle</span>
        <span>{snackbarMessage}</span>
        <button onClick={() => setShowSnackbar(false)}>
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Course Modal */}
      <div
        className={`modal-overlay ${showModal ? "show" : ""}`}
        onClick={() => setShowModal(false)}
      >
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle"></div>
          <button className="modal-close" onClick={() => setShowModal(false)}>
            <span className="material-icons">close</span>
          </button>
          {selectedCourse && (
            <div>
              <div
                className="modal-header"
                style={{
                  background: `linear-gradient(135deg, ${selectedCourse.color}14 0%, ${selectedCourse.color}05 100%)`,
                }}
              >
                <span className="modal-emoji">{selectedCourse.emoji}</span>
              </div>
              <div className="modal-body">
                <div className="modal-tags">
                  <span
                    className="modal-tag"
                    style={{
                      background: `${selectedCourse.color}1a`,
                      color: selectedCourse.color,
                      borderColor: `${selectedCourse.color}33`,
                    }}
                  >
                    {selectedCourse.category}
                  </span>
                  <span
                    className="modal-tag"
                    style={{
                      background: "#1e3a8a1a",
                      color: "#1e3a8a",
                      borderColor: "#1e3a8a33",
                    }}
                  >
                    {selectedCourse.level}
                  </span>
                  <span
                    className="modal-tag"
                    style={{
                      background: "#10b9811a",
                      color: "#10b981",
                      borderColor: "#10b98133",
                    }}
                  >
                    FREE
                  </span>
                </div>
                <h2 className="modal-title">{selectedCourse.title}</h2>
                <p className="modal-description">
                  {selectedCourse.description}
                </p>
                <div className="modal-meta">
                  <div className="modal-meta-chip">
                    <span className="material-icons">access_time</span>
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <div className="modal-meta-chip">
                    <span className="material-icons">people</span>
                    <span>
                      {(selectedCourse.studentCount / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="modal-meta-chip">
                    <span className="material-icons">school</span>
                    <span>{selectedCourse.topics.length} modules</span>
                  </div>
                </div>
                <div className="modal-divider"></div>
                <h3 className="modal-section-title">What You'll Learn</h3>
                <ul className="modal-topics">
                  {selectedCourse.topics.map((topic: string) => (
                    <li key={topic} className="modal-topic-item">
                      <span className="modal-topic-check">
                        <span className="material-icons">check</span>
                      </span>
                      <span className="modal-topic-text">{topic}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="modal-btn"
                  onClick={() => startLearning(selectedCourse.id)}
                >
                  Start Learning Free
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
