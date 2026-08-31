import React, { useState, useEffect } from 'react';
import {
  Course,
  Note,
  Assignment,
  Quiz,
  Assessment,
  Payment,
  Certificate,
  Route,
} from '../../types';
import {
  Button,
  Badge,
  StatCardUI,
  ProgressBar,
  Modal,
  RatingStars,
  ThemeToggle,
} from '../common/CommonUI';
import { CourseCard } from '../common/CourseCard';
import {
  DashboardIcon,
  BookOpenIcon,
  CompassIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  HelpCircleIcon,
  ShieldAlertIcon,
  BarChart3Icon,
  AwardIcon,
  CreditCardIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BellIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  ClockIcon,
  CheckCircleIcon,
  DownloadIcon,
  UploadIcon,
  PlayCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CameraIcon,
  MicIcon,
  MaximizeIcon,
  UsersIcon,
  SparklesIcon,
} from '../icons/Icons';

type StudentPortalProps = {
  route: Route;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (route: Route) => void;
  onLogout: () => void;
  courses: Course[];
  notes: Note[];
  assignments: Assignment[];
  quizzes: Quiz[];
  assessments: Assessment[];
  payments: Payment[];
  certificates: Certificate[];
  onBuyCourse: (course: Course) => void;
  onUpdateAssignments: (assignments: Assignment[]) => void;
  onAddNote: (note: Note) => void;
  studentName: string;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
};

export const StudentPortal: React.FC<StudentPortalProps> = ({
  route,
  theme,
  onToggleTheme,
  onNavigate,
  onLogout,
  courses,
  notes,
  assignments,
  quizzes,
  assessments,
  payments,
  certificates,
  onBuyCourse,
  onUpdateAssignments,
  studentName,
  onShowToast,
}) => {
  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected entities for modals & players
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || null);
  const [activeLessonId, setActiveLessonId] = useState<number>(1001);
  const [learningModalOpen, setLearningModalOpen] = useState(false);

  // Note preview modal
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  // Assignment submission modal
  const [submitAssignmentModal, setSubmitAssignmentModal] = useState<Assignment | null>(null);
  const [assignmentFile, setAssignmentFile] = useState<string>('project_solution_v1.zip');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Course Buy Modal
  const [buyModalCourse, setBuyModalCourse] = useState<Course | null>(null);

  // Certificate Modal
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Quiz runner state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [quizTimerSeconds, setQuizTimerSeconds] = useState(900); // 15 mins

  // Assessment & AI Proctoring State
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [pretestStage, setPretestStage] = useState(false);
  const [proctoringStarted, setProctoringStarted] = useState(false);
  const [testQuestionIndex, setTestQuestionIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testMarkedForReview, setTestMarkedForReview] = useState<Record<number, boolean>>({});
  const [testTimerSeconds, setTestTimerSeconds] = useState(3600); // 60 mins
  const [testWarnings, setTestWarnings] = useState(0);
  const [testCompletedResult, setTestCompletedResult] = useState<any | null>(null);

  // Filter states
  const [myCoursesTab, setMyCoursesTab] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<'All' | 'Pending' | 'Submitted' | 'Graded' | 'Overdue'>('All');
  const [marketplaceCategory, setMarketplaceCategory] = useState('All');
  const [marketplaceSearch, setMarketplaceSearch] = useState('');

  // Timer effect for Quiz
  useEffect(() => {
    let interval: any = null;
    if (activeQuiz && !quizResult && quizTimerSeconds > 0) {
      interval = setInterval(() => {
        setQuizTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuiz, quizResult, quizTimerSeconds]);

  // Timer effect for Proctored Test
  useEffect(() => {
    let interval: any = null;
    if (proctoringStarted && !testCompletedResult && testTimerSeconds > 0) {
      interval = setInterval(() => {
        setTestTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [proctoringStarted, testCompletedResult, testTimerSeconds]);

  const navItems: { label: string; route: Route; icon: React.ReactNode }[] = [
    { label: 'Dashboard', route: '/student/dashboard', icon: <DashboardIcon size={18} /> },
    { label: 'My Courses', route: '/student/courses', icon: <BookOpenIcon size={18} /> },
    { label: 'Explore Courses', route: '/courses', icon: <CompassIcon size={18} /> },
    { label: 'Notes', route: '/student/notes', icon: <FileTextIcon size={18} /> },
    { label: 'Assignments', route: '/student/assignments', icon: <ClipboardCheckIcon size={18} /> },
    { label: 'Quizzes', route: '/student/quizzes', icon: <HelpCircleIcon size={18} /> },
    { label: 'Tests & Assessments', route: '/student/tests', icon: <ShieldAlertIcon size={18} /> },
    { label: 'Results', route: '/student/results', icon: <BarChart3Icon size={18} /> },
    { label: 'Certificates', route: '/student/certificates', icon: <AwardIcon size={18} /> },
    { label: 'Payments', route: '/student/payments', icon: <CreditCardIcon size={18} /> },
    { label: 'Profile', route: '/student/profile', icon: <UserIcon size={18} /> },
    { label: 'Settings', route: '/student/settings', icon: <SettingsIcon size={18} /> },
  ];

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Course purchase confirmation
  const handleConfirmPurchase = () => {
    if (!buyModalCourse) return;
    onBuyCourse(buyModalCourse);
    setBuyModalCourse(null);
    onShowToast(
      'Enrollment Confirmed!',
      `You now have full access to ${buyModalCourse.title}`,
      'success'
    );
  };

  // Submit Assignment Handler
  const handleConfirmAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitAssignmentModal) return;

    const updated = assignments.map((item) => {
      if (item.id === submitAssignmentModal.id) {
        return {
          ...item,
          status: 'Submitted' as const,
          submittedFile: assignmentFile,
          submissionDate: 'Today',
          feedback: 'Submitted for instructor review.',
        };
      }
      return item;
    });

    onUpdateAssignments(updated);
    setSubmitAssignmentModal(null);
    onShowToast('Assignment Uploaded', 'Your project has been successfully submitted.', 'success');
  };

  // Start Quiz Handler
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizQuestionIndex(0);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizTimerSeconds(quiz.durationMinutes * 60);
  };

  // Submit Quiz Handler
  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizResult({
      score: correctCount,
      total: activeQuiz.questions.length,
      percentage,
    });
    onShowToast('Quiz Finished', `You scored ${percentage}% on this quiz.`, 'info');
  };

  // Start Pre-test Handler
  const handleStartPretest = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setPretestStage(true);
    setProctoringStarted(false);
  };

  // Begin Proctored Assessment
  const handleBeginProctoredTest = () => {
    setPretestStage(false);
    setProctoringStarted(true);
    setTestQuestionIndex(0);
    setTestAnswers({});
    setTestMarkedForReview({});
    setTestWarnings(0);
    setTestCompletedResult(null);
    setTestTimerSeconds(activeAssessment ? activeAssessment.durationMinutes * 60 : 3600);
  };

  // Submit Proctored Assessment
  const handleSubmitProctoredTest = () => {
    if (!activeAssessment) return;
    let correctCount = 0;
    activeAssessment.questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const total = activeAssessment.questions.length || 10;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= activeAssessment.passingScore;

    setTestCompletedResult({
      assessmentTitle: activeAssessment.title,
      courseTitle: activeAssessment.course,
      correct: correctCount,
      incorrect: total - correctCount,
      total,
      percentage,
      passed,
      timeTaken: `${Math.floor((activeAssessment.durationMinutes * 60 - testTimerSeconds) / 60)}m ${((activeAssessment.durationMinutes * 60 - testTimerSeconds) % 60)}s`,
    });

    setProctoringStarted(false);
    onNavigate('/student/results');
    onShowToast(
      passed ? 'Assessment Passed! 🎉' : 'Assessment Completed',
      `You scored ${percentage}%. ${passed ? 'Certificate is now ready.' : 'Passing requirement is ' + activeAssessment.passingScore + '%.'}`,
      passed ? 'success' : 'warning'
    );
  };

  // Filtered Courses
  const enrolledCourses = courses.filter((c) => c.purchased);
  const displayedMyCourses = myCoursesTab === 'All'
    ? enrolledCourses
    : myCoursesTab === 'In Progress'
    ? enrolledCourses.filter((c) => (c.progress || 0) < 100)
    : enrolledCourses.filter((c) => (c.progress || 0) >= 100);

  const displayedMarketCourses = courses.filter((c) => {
    const matchesCat = marketplaceCategory === 'All' || c.category.toLowerCase().includes(marketplaceCategory.toLowerCase());
    const matchesSearch = c.title.toLowerCase().includes(marketplaceSearch.toLowerCase()) || c.instructor.toLowerCase().includes(marketplaceSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredAssignments = assignmentFilter === 'All'
    ? assignments
    : assignments.filter((a) => a.status === assignmentFilter);

  return (
    <div className="app-layout">
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/krytil-logo.png" alt="KRYTIL LMS" className="sidebar-logo" />
            <span>KRYTIL</span>
            <span className="tag">Student</span>
          </div>
          <button
            className="mobile-menu-toggle btn-ghost btn-icon"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Main Navigation</span>
          {navItems.map((item) => {
            const isActive = route === item.route;
            return (
              <button
                key={item.label}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.route);
                  setSidebarOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button
              className="nav-item-btn"
              style={{ color: 'var(--danger)' }}
              onClick={() => {
                setSidebarOpen(false);
                onLogout();
              }}
            >
              <LogOutIcon size={18} color="var(--danger)" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="user-avatar">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="name">{studentName}</div>
              <div className="role">Enrolled Student</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        {/* Topbar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-toggle btn-ghost btn-icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <MenuIcon size={22} />
            </button>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Welcome back 👋
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                {studentName}
              </h2>
            </div>
          </div>

          <div className="topbar-right">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              className="notification-btn"
              onClick={() => onShowToast('Notifications', 'All your assignments and test reminders are up to date.', 'info')}
              title="Notifications"
            >
              <BellIcon size={18} />
              <span className="notification-badge" />
            </button>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => onNavigate('/student/profile')}
            >
              <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                {studentName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content-wrapper">
          {/* ========================================================
              1. STUDENT DASHBOARD
             ======================================================== */}
          {route === '/student/dashboard' && (
            <div>
              {/* Stat Cards */}
              <div className="stats-grid">
                <StatCardUI
                  title="Enrolled Courses"
                  value={enrolledCourses.length}
                  delta="+1 this month"
                  icon={<BookOpenIcon size={24} />}
                />
                <StatCardUI
                  title="Certificates Earned"
                  value={certificates.length}
                  delta="100% verified"
                  icon={<AwardIcon size={24} />}
                  colorBg="var(--success-soft)"
                  colorText="var(--success)"
                />
                <StatCardUI
                  title="Pending Assignments"
                  value={assignments.filter((a) => a.status === 'Pending').length}
                  delta="Due soon"
                  isPositive={false}
                  icon={<ClipboardCheckIcon size={24} />}
                  colorBg="var(--warning-soft)"
                  colorText="var(--warning)"
                />
                <StatCardUI
                  title="Average Score"
                  value="88.5%"
                  delta="+3.2% boost"
                  icon={<BarChart3Icon size={24} />}
                  colorBg="var(--purple-soft)"
                  colorText="var(--purple)"
                />
              </div>

              {/* Continue Learning Section */}
              <section className="panel" style={{ marginBottom: '24px' }}>
                <div className="panel-header">
                  <div>
                    <h3 className="panel-title">Continue Learning</h3>
                    <p className="panel-subtitle">Pick up right where you left off</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('/student/courses')}
                  >
                    View All Enrolled ({enrolledCourses.length})
                  </Button>
                </div>

                <div className="course-grid">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showProgress={true}
                      onContinueLearning={(c) => {
                        setSelectedCourse(c);
                        setLearningModalOpen(true);
                      }}
                      onViewDetails={(c) => {
                        setSelectedCourse(c);
                        setLearningModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Two Column Layout: Upcoming Schedule & Weekly Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {/* Upcoming Schedule */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3 className="panel-title">Upcoming Deadlines</h3>
                      <p className="panel-subtitle">Assignments, quizzes & assessments</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ClipboardCheckIcon size={18} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--navy)', display: 'block' }}>Build Secure Authentication UI</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Aug 29 • Web Engineering</span>
                        </div>
                      </div>
                      <Badge variant="warning">Due Soon</Badge>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--purple-soft)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShieldAlertIcon size={18} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--navy)', display: 'block' }}>Frontend Engineering Capstone</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Proctored Exam • 60 Mins</span>
                        </div>
                      </div>
                      <Badge variant="primary">Available</Badge>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--cyan-soft)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <HelpCircleIcon size={18} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--navy)', display: 'block' }}>Python Pandas & Manipulation</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 Questions • 20 Mins</span>
                        </div>
                      </div>
                      <Badge variant="neutral">Open</Badge>
                    </div>
                  </div>
                </div>

                {/* Weekly Learning Activity */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3 className="panel-title">Weekly Learning Analytics</h3>
                      <p className="panel-subtitle">Hours spent learning this week</p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Total: 16.5h
                    </span>
                  </div>

                  <div style={{ paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', gap: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                      {[
                        { day: 'Mon', hours: 2.5, percent: 50 },
                        { day: 'Tue', hours: 3.8, percent: 76 },
                        { day: 'Wed', hours: 1.5, percent: 30 },
                        { day: 'Thu', hours: 4.2, percent: 84 },
                        { day: 'Fri', hours: 3.0, percent: 60 },
                        { day: 'Sat', hours: 5.0, percent: 100 },
                        { day: 'Sun', hours: 2.0, percent: 40 },
                      ].map((item) => (
                        <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                            {item.hours}h
                          </span>
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '36px',
                              height: `${item.percent}%`,
                              background: 'linear-gradient(180deg, var(--primary), #60a5fa)',
                              borderRadius: '6px 6px 0 0',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '8px' }}>
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. MY COURSES
             ======================================================== */}
          {route === '/student/courses' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">My Enrolled Courses</h2>
                  <p className="panel-subtitle">Track completion and access course lesson materials</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('/courses')}
                >
                  + Explore More Courses
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="tab-nav-row">
                {(['All', 'In Progress', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${myCoursesTab === tab ? 'active' : ''}`}
                    onClick={() => setMyCoursesTab(tab)}
                  >
                    {tab} ({tab === 'All' ? enrolledCourses.length : tab === 'In Progress' ? enrolledCourses.filter((c) => (c.progress || 0) < 100).length : enrolledCourses.filter((c) => (c.progress || 0) >= 100).length})
                  </button>
                ))}
              </div>

              {displayedMyCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
                  <BookOpenIcon size={40} color="var(--text-subtle)" />
                  <h4 style={{ marginTop: '14px', color: 'var(--navy)' }}>No Courses Found in this Tab</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '18px' }}>
                    Browse our extensive catalog to start learning new skills.
                  </p>
                  <Button variant="primary" onClick={() => onNavigate('/courses')}>
                    Browse Catalog
                  </Button>
                </div>
              ) : (
                <div className="course-grid">
                  {displayedMyCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showProgress={true}
                      onContinueLearning={(c) => {
                        setSelectedCourse(c);
                        setLearningModalOpen(true);
                      }}
                      onViewDetails={(c) => {
                        setSelectedCourse(c);
                        setLearningModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              3. EXPLORE COURSES (MARKETPLACE)
             ======================================================== */}
          {route === '/courses' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Explore Course Catalog</h2>
                  <p className="panel-subtitle">Discover industry-accredited curriculums and enroll instantly</p>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="filter-bar">
                <div className="input-with-icon">
                  <span className="input-icon-left"><SearchIcon size={16} /></span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search by title or instructor..."
                    value={marketplaceSearch}
                    onChange={(e) => setMarketplaceSearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-select"
                  value={marketplaceCategory}
                  onChange={(e) => setMarketplaceCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Marketing">Marketing</option>
                </select>

                <select className="form-select">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

                <select className="form-select">
                  <option>Sort: Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                </select>
              </div>

              <div className="course-grid">
                {displayedMarketCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showProgress={course.purchased}
                    onViewDetails={(c) => {
                      setSelectedCourse(c);
                      setLearningModalOpen(true);
                    }}
                    onBuyCourse={(c) => {
                      setBuyModalCourse(c);
                    }}
                    onContinueLearning={(c) => {
                      setSelectedCourse(c);
                      setLearningModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              4. NOTES
             ======================================================== */}
          {route === '/student/notes' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Lecture Notes & Cheatsheets</h2>
                  <p className="panel-subtitle">Download official study materials published by instructors</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {notes.map((note) => (
                  <div key={note.id} className="panel" style={{ padding: '20px', background: 'var(--panel)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Badge variant="primary">{note.type}</Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{note.size}</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                      {note.title}
                    </h4>

                    <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                      {note.course}
                    </span>

                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                      {note.contentPreview || 'Full lecture summary with key definitions, code syntax, and exam points.'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{note.date}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPreviewNote(note)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<DownloadIcon size={14} />}
                          onClick={() => onShowToast('Downloading Note', `${note.title} (${note.size})`, 'success')}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              5. ASSIGNMENTS
             ======================================================== */}
          {route === '/student/assignments' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Hands-On Assignments</h2>
                  <p className="panel-subtitle">Submit practical project deliverables and receive instructor grading</p>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="tab-nav-row">
                {(['All', 'Pending', 'Submitted', 'Graded', 'Overdue'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${assignmentFilter === tab ? 'active' : ''}`}
                    onClick={() => setAssignmentFilter(tab)}
                  >
                    {tab} ({tab === 'All' ? assignments.length : assignments.filter((a) => a.status === tab).length})
                  </button>
                ))}
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Assignment Title</th>
                      <th>Course</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong style={{ display: 'block', color: 'var(--navy)' }}>{a.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Points: {a.maxScore || 100}</span>
                        </td>
                        <td>{a.course}</td>
                        <td>{a.due}</td>
                        <td>
                          <Badge
                            variant={
                              a.status === 'Graded' ? 'success' :
                              a.status === 'Submitted' ? 'primary' :
                              a.status === 'Pending' ? 'warning' : 'danger'
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                        <td>
                          {a.score !== undefined ? (
                            <strong style={{ color: 'var(--success)' }}>{a.score} / {a.maxScore || 100}</strong>
                          ) : (
                            <span style={{ color: 'var(--text-subtle)' }}>—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {a.status === 'Pending' || a.status === 'Overdue' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<UploadIcon size={14} />}
                              onClick={() => setSubmitAssignmentModal(a)}
                            >
                              Submit
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                onShowToast(
                                  a.title,
                                  a.feedback || `Submitted File: ${a.submittedFile || 'solution.zip'} on ${a.submissionDate || 'Recently'}`,
                                  'info'
                                );
                              }}
                            >
                              View Submission
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              6. QUIZZES
             ======================================================== */}
          {route === '/student/quizzes' && (
            <div>
              {activeQuiz && !quizResult ? (
                /* Interactive Quiz Runner */
                <div className="quiz-runner-container">
                  <div className="quiz-top-bar">
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>ACTIVE QUIZ</span>
                      <h3 style={{ margin: 0, color: 'var(--navy)' }}>{activeQuiz.title}</h3>
                    </div>
                    <div className={`timer-pill ${quizTimerSeconds < 120 ? 'urgent' : ''}`}>
                      <ClockIcon size={18} />
                      <span>{formatTimer(quizTimerSeconds)}</span>
                    </div>
                  </div>

                  <div className="question-box">
                    <div className="question-header-row">
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Question {quizQuestionIndex + 1} of {activeQuiz.questions.length}
                      </span>
                      <Badge variant="primary">{activeQuiz.course}</Badge>
                    </div>

                    <h4 className="question-text">
                      {activeQuiz.questions[quizQuestionIndex].question}
                    </h4>

                    <div className="options-list">
                      {activeQuiz.questions[quizQuestionIndex].options.map((option, oIdx) => {
                        const isSelected = quizAnswers[quizQuestionIndex] === oIdx;
                        return (
                          <button
                            key={option}
                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [quizQuestionIndex]: oIdx })}
                          >
                            <span className="option-marker">{String.fromCharCode(65 + oIdx)}</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="secondary"
                      disabled={quizQuestionIndex === 0}
                      onClick={() => setQuizQuestionIndex((i) => i - 1)}
                    >
                      ← Previous
                    </Button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {activeQuiz.questions.map((_, idx) => (
                        <button
                          key={idx}
                          className={`q-nav-pill ${quizQuestionIndex === idx ? 'current' : ''} ${quizAnswers[idx] !== undefined ? 'answered' : ''}`}
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => setQuizQuestionIndex(idx)}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {quizQuestionIndex === activeQuiz.questions.length - 1 ? (
                      <Button variant="success" onClick={handleSubmitQuiz}>
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => setQuizQuestionIndex((i) => i + 1)}
                      >
                        Next Question →
                      </Button>
                    )}
                  </div>
                </div>
              ) : quizResult && activeQuiz ? (
                /* Quiz Result Summary Card */
                <div className="panel" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '40px 32px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: quizResult.percentage >= 70 ? 'var(--success-soft)' : 'var(--warning-soft)', color: quizResult.percentage >= 70 ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', fontWeight: 900 }}>
                    {quizResult.percentage >= 70 ? '✓' : '!'}
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
                    Quiz Completed!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                    {activeQuiz.title} • {activeQuiz.course}
                  </p>

                  <div style={{ background: 'var(--bg-subtle)', borderRadius: '16px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                    <div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Score Achieved</span>
                      <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--navy)' }}>
                        {quizResult.score} / {quizResult.total}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Percentage</span>
                      <strong style={{ display: 'block', fontSize: '2rem', color: quizResult.percentage >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                        {quizResult.percentage}%
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <Button variant="secondary" onClick={() => setActiveQuiz(null)}>
                      Back to Quizzes
                    </Button>
                    <Button variant="primary" onClick={() => handleStartQuiz(activeQuiz)}>
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              ) : (
                /* Quizzes Catalog List */
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Interactive Module Quizzes</h2>
                      <p className="panel-subtitle">Test knowledge retention with quick, timed concept checks</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="panel" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <Badge variant={quiz.status === 'Completed' ? 'success' : 'primary'}>
                            {quiz.status}
                          </Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {quiz.duration}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                          {quiz.title}
                        </h4>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                          {quiz.course}
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {quiz.questions.length} Questions
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStartQuiz(quiz)}
                          >
                            {quiz.status === 'Completed' ? 'Retake Quiz' : 'Start Quiz →'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              7. TESTS & ASSESSMENTS (WITH PRE-TEST & AI PROCTORING)
             ======================================================== */}
          {route === '/student/tests' && (
            <div>
              {/* Pre-Test System Verification Stage */}
              {pretestStage && activeAssessment ? (
                <div className="panel" style={{ maxWidth: '780px', margin: '0 auto', padding: '36px 32px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <ShieldAlertIcon size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
                      Pre-Assessment System Verification
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                      {activeAssessment.title} • {activeAssessment.course}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration</span>
                      <strong style={{ display: 'block', color: 'var(--navy)' }}>{activeAssessment.duration}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions</span>
                      <strong style={{ display: 'block', color: 'var(--navy)' }}>{activeAssessment.questions.length || 10}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passing Score</span>
                      <strong style={{ display: 'block', color: 'var(--success)' }}>{activeAssessment.passingScore}%</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mode</span>
                      <strong style={{ display: 'block', color: 'var(--primary)' }}>AI Proctored</strong>
                    </div>
                  </div>

                  {/* System Readiness Checks */}
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '12px' }}>
                    Hardware & Browser Checks
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--panel)' }}>
                      <CameraIcon size={20} color="var(--success)" />
                      <div>
                        <strong style={{ fontSize: '0.875rem', display: 'block' }}>Webcam Connected</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>720p HD Stream Verified</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--panel)' }}>
                      <MicIcon size={20} color="var(--success)" />
                      <div>
                        <strong style={{ fontSize: '0.875rem', display: 'block' }}>Microphone Active</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Audio Signal OK</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--panel)' }}>
                      <MaximizeIcon size={20} color="var(--success)" />
                      <div>
                        <strong style={{ fontSize: '0.875rem', display: 'block' }}>Full-Screen Lock</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Supported</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--panel)' }}>
                      <SparklesIcon size={20} color="var(--success)" />
                      <div>
                        <strong style={{ fontSize: '0.875rem', display: 'block' }}>AI Integrity Agent</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Rules Checklist */}
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '12px' }}>
                    Important Assessment Rules
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text)', fontSize: '0.875rem', lineHeight: '1.8', marginBottom: '28px' }}>
                    {activeAssessment.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                    <Button variant="secondary" onClick={() => setPretestStage(false)}>
                      Cancel & Return
                    </Button>
                    <Button variant="primary" size="lg" onClick={handleBeginProctoredTest}>
                      Begin Proctored Assessment ➔
                    </Button>
                  </div>
                </div>
              ) : proctoringStarted && activeAssessment ? (
                /* Live AI-Proctored Assessment Suite */
                <div className="proctor-layout">
                  {/* Main Question Panel */}
                  <div>
                    <div className="quiz-top-bar">
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>FINAL ASSESSMENT</span>
                        <h3 style={{ margin: 0, color: 'var(--navy)' }}>{activeAssessment.title}</h3>
                      </div>
                      <div className={`timer-pill ${testTimerSeconds < 300 ? 'urgent' : ''}`}>
                        <ClockIcon size={18} />
                        <span>{formatTimer(testTimerSeconds)}</span>
                      </div>
                    </div>

                    <div className="question-box">
                      <div className="question-header-row">
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Question {testQuestionIndex + 1} of {activeAssessment.questions.length}
                        </span>
                        {testMarkedForReview[testQuestionIndex] && (
                          <Badge variant="warning">Marked for Review</Badge>
                        )}
                      </div>

                      <h4 className="question-text">
                        {activeAssessment.questions[testQuestionIndex].question}
                      </h4>

                      <div className="options-list">
                        {activeAssessment.questions[testQuestionIndex].options.map((opt, oIdx) => {
                          const isSelected = testAnswers[testQuestionIndex] === oIdx;
                          return (
                            <button
                              key={opt}
                              className={`option-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => setTestAnswers({ ...testAnswers, [testQuestionIndex]: oIdx })}
                            >
                              <span className="option-marker">{String.fromCharCode(65 + oIdx)}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button
                        variant="secondary"
                        disabled={testQuestionIndex === 0}
                        onClick={() => setTestQuestionIndex((i) => i - 1)}
                      >
                        ← Previous
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setTestMarkedForReview({
                            ...testMarkedForReview,
                            [testQuestionIndex]: !testMarkedForReview[testQuestionIndex],
                          });
                        }}
                      >
                        {testMarkedForReview[testQuestionIndex] ? 'Unmark Review' : 'Mark for Review'}
                      </Button>

                      {testQuestionIndex === activeAssessment.questions.length - 1 ? (
                        <Button variant="success" size="lg" onClick={handleSubmitProctoredTest}>
                          Submit Final Exam
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setTestQuestionIndex((i) => i + 1)}
                        >
                          Next Question →
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Sidebar with Live Proctor Video & Question Navigator */}
                  <div className="proctor-sidebar">
                    {/* Simulated Live Webcam Box */}
                    <div className="proctor-camera-feed">
                      <div className="cam-live-indicator">
                        <span className="cam-pulse" /> REC
                      </div>
                      <div className="simulated-cam">
                        <div style={{ textAlign: 'center' }}>
                          <UsersIcon size={40} color="#60a5fa" />
                          <span style={{ fontSize: '0.75rem', display: 'block', marginTop: '6px', color: '#cbd5e1' }}>
                            {studentName} (Verified)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Status Card */}
                    <div className="proctor-status-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--navy)' }}>AI Proctoring Active</strong>
                        <Badge variant="success">Normal</Badge>
                      </div>

                      <div className="proctor-status-item">
                        <span>Audio Ambient Noise</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Low (Quiet)</span>
                      </div>
                      <div className="proctor-status-item">
                        <span>Tab Lockout</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>
                      </div>
                      <div className="proctor-status-item">
                        <span>Warnings Issued</span>
                        <span style={{ color: testWarnings > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {testWarnings} / 3 Max
                        </span>
                      </div>
                    </div>

                    {/* Question Matrix Navigator */}
                    <div className="panel" style={{ padding: '16px' }}>
                      <strong style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Question Matrix
                      </strong>
                      <div className="question-nav-grid">
                        {activeAssessment.questions.map((_, idx) => {
                          const isAnswered = testAnswers[idx] !== undefined;
                          const isMarked = testMarkedForReview[idx];
                          const isCurrent = testQuestionIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`q-nav-pill ${isCurrent ? 'current' : ''} ${isMarked ? 'marked' : isAnswered ? 'answered' : ''}`}
                              onClick={() => setTestQuestionIndex(idx)}
                            >
                              {idx + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Assessment Catalog List */
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Tests & Final Assessments</h2>
                      <p className="panel-subtitle">Accredited examinations required to earn certified credentials</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {assessments.map((item) => (
                      <div key={item.id} className="panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <Badge variant={item.proctored ? 'warning' : 'neutral'}>
                            {item.proctored ? '🛡️ AI Proctored' : 'Non-Proctored'}
                          </Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.duration}</span>
                        </div>

                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '14px' }}>
                          {item.course}
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                          <span>Passing Score: <strong>{item.passingScore}%</strong></span>
                          <span>Attempts: <strong>{item.attemptsTaken}/{item.attemptsAllowed}</strong></span>
                        </div>

                        <Button
                          variant="primary"
                          fullWidth
                          onClick={() => handleStartPretest(item)}
                        >
                          Launch Assessment Check →
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              8. RESULTS
             ======================================================== */}
          {route === '/student/results' && (
            <div className="panel" style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Assessment Performance Report</h2>
                  <p className="panel-subtitle">Official grading breakdown and certificate eligibility</p>
                </div>
              </div>

              {testCompletedResult ? (
                <div>
                  <div style={{ textAlign: 'center', padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: testCompletedResult.passed ? 'var(--success-soft)' : 'var(--warning-soft)', color: testCompletedResult.passed ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2.5rem', fontWeight: 900 }}>
                      {testCompletedResult.passed ? '✓' : '!'}
                    </div>

                    <Badge variant={testCompletedResult.passed ? 'success' : 'danger'}>
                      {testCompletedResult.passed ? 'PASSED — CERTIFICATE ISSUED' : 'RETAKE RECOMMENDED'}
                    </Badge>

                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--navy)', margin: '14px 0 4px' }}>
                      Score: {testCompletedResult.percentage}%
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                      {testCompletedResult.assessmentTitle} • {testCompletedResult.courseTitle}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '24px 0', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Correct Answers</span>
                      <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--success)' }}>{testCompletedResult.correct}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Incorrect Answers</span>
                      <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--danger)' }}>{testCompletedResult.incorrect}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Elapsed</span>
                      <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--navy)' }}>{testCompletedResult.timeTaken}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Integrity Verification</span>
                      <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--primary)' }}>100% Cleared</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                    <Button variant="secondary" onClick={() => onNavigate('/student/dashboard')}>
                      ← Back to Dashboard
                    </Button>
                    <Button variant="primary" onClick={() => onNavigate('/student/certificates')}>
                      View Earned Certificate 🏅
                    </Button>
                  </div>
                </div>
              ) : (
                /* Static Default Performance View */
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Recent Assessment</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--navy)' }}>88.0%</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Passed (Honors)</span>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Total Questions Solved</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--navy)' }}>142</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 6 Quizzes & Tests</span>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Proctor Compliance</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--success)' }}>100%</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>0 Infractions</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '14px' }}>Past Evaluation History</h4>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Assessment</th>
                          <th>Course</th>
                          <th>Score</th>
                          <th>Result</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Frontend Engineering Capstone</td>
                          <td>Full-Stack Modern Web Engineering</td>
                          <td><strong>88%</strong></td>
                          <td><Badge variant="success">Passed</Badge></td>
                          <td>Aug 15, 2026</td>
                        </tr>
                        <tr>
                          <td>React Core Architecture Quiz</td>
                          <td>Full-Stack Modern Web Engineering</td>
                          <td><strong>85%</strong></td>
                          <td><Badge variant="success">Passed</Badge></td>
                          <td>Aug 10, 2026</td>
                        </tr>
                        <tr>
                          <td>Design Systems & Tokens</td>
                          <td>UI/UX Design Systems</td>
                          <td><strong>92%</strong></td>
                          <td><Badge variant="success">Passed</Badge></td>
                          <td>Jul 28, 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              9. CERTIFICATES
             ======================================================== */}
          {route === '/student/certificates' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Verifiable Certificates</h2>
                  <p className="panel-subtitle">Official credentials awarded upon course and assessment completion</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {certificates.map((cert) => (
                  <div key={cert.id} className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="brand-badge" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <AwardIcon size={22} color="#fff" />
                      </div>
                      <Badge variant="success">Verified Credential</Badge>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', marginTop: '4px' }}>
                      {cert.course}
                    </h4>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      <div>Recipient: <strong style={{ color: 'var(--text)' }}>{cert.studentName}</strong></div>
                      <div>Issued: <strong style={{ color: 'var(--text)' }}>{cert.issueDate}</strong></div>
                      <div>ID: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{cert.credentialId}</span></div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => setPreviewCert(cert)}
                      >
                        Preview Certificate
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        icon={<DownloadIcon size={14} />}
                        onClick={() => onShowToast('Downloading Certificate PDF', `${cert.credentialId}.pdf`, 'success')}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              10. PAYMENTS
             ======================================================== */}
          {route === '/student/payments' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Payment & Invoice History</h2>
                  <p className="panel-subtitle">Review course receipts, transaction records, and invoice IDs</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Course Title</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td><strong style={{ color: 'var(--navy)' }}>{p.id}</strong></td>
                        <td>{p.course}</td>
                        <td><strong>₹{p.amount.toLocaleString('en-IN')}</strong></td>
                        <td>{p.method}</td>
                        <td>{p.date}</td>
                        <td>
                          <Badge variant={p.status === 'Paid' ? 'success' : 'warning'}>
                            {p.status}
                          </Badge>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<DownloadIcon size={14} />}
                            onClick={() => onShowToast('Receipt Downloaded', `Invoice ${p.invoiceId} downloaded.`, 'success')}
                          >
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              11. PROFILE
             ======================================================== */}
          {route === '/student/profile' && (
            <div className="panel" style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Student Profile</h2>
                  <p className="panel-subtitle">Manage personal information and learning bio</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div className="user-avatar" style={{ width: '84px', height: '84px', fontSize: '2rem' }}>
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                    {studentName}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', margin: '4px 0' }}>student@krytil.com • +91 98765 43210</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <Badge variant="primary">3 Enrolled Courses</Badge>
                    <Badge variant="success">2 Certifications</Badge>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onShowToast('Profile Updated', 'Your profile details have been saved.', 'success');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '24px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" defaultValue={studentName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" defaultValue="student@krytil.com" disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-control" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / Country</label>
                    <input type="text" className="form-control" defaultValue="India" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio & Learning Goals</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    defaultValue="Software engineer passionate about full-stack architectures, modern design systems, and AI applications."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="primary">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              12. SETTINGS
             ======================================================== */}
          {route === '/student/settings' && (
            <div className="panel" style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Account Settings</h2>
                  <p className="panel-subtitle">Configure theme preferences, security, and alerts</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--navy)' }}>Display Theme</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Current mode: {theme === 'light' ? 'Bright Light Theme' : 'Deep Charcoal Dark Theme'}
                    </span>
                  </div>
                  <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--navy)' }}>Assignment Reminder Notifications</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Receive email alerts 48 hours prior to assignment deadlines
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--navy)' }}>Proctored Test Notifications</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Send SMS and browser push notifications for upcoming exams
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>

                <div style={{ paddingTop: '10px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '12px' }}>Change Password</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input type="password" placeholder="••••••••" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input type="password" placeholder="••••••••" className="form-control" />
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => onShowToast('Password Changed', 'Your password has been updated.', 'success')}>
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          MODALS
         ======================================================== */}

      {/* 1. Course Buy Modal */}
      <Modal
        isOpen={!!buyModalCourse}
        title="Confirm Course Enrollment"
        onClose={() => setBuyModalCourse(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBuyModalCourse(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmPurchase}>
              Confirm & Unlock Course (₹{buyModalCourse?.price.toLocaleString('en-IN')})
            </Button>
          </>
        }
      >
        {buyModalCourse && (
          <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <img
                src={buyModalCourse.image}
                alt={buyModalCourse.title}
                style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div>
                <h4 style={{ margin: '0 0 4px', color: 'var(--navy)' }}>{buyModalCourse.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Instructor: {buyModalCourse.instructor}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                <span>Course Price:</span>
                <strong>₹{buyModalCourse.price.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                <span>Discount / Offer:</span>
                <span style={{ color: 'var(--success)' }}>-₹{(buyModalCourse.originalPrice ? buyModalCourse.originalPrice - buyModalCourse.price : 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '1rem', fontWeight: 800 }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--primary)' }}>₹{buyModalCourse.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ⚡ <em>Frontend simulated transaction:</em> Clicking Confirm will instantly activate this course in your "My Courses" library and generate an invoice receipt.
            </p>
          </div>
        )}
      </Modal>

      {/* 2. Course Learning Player Modal */}
      <Modal
        isOpen={learningModalOpen}
        title={selectedCourse?.title || 'Course Player'}
        onClose={() => setLearningModalOpen(false)}
        wide={true}
      >
        {selectedCourse && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) 1fr', gap: '20px' }}>
              {/* Left Video / Content Player Simulator */}
              <div>
                <div style={{ width: '100%', height: '280px', background: '#090d16', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                  <PlayCircleIcon size={56} color="var(--primary)" />
                  <span style={{ marginTop: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                    Lesson Video Stream Simulator
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    1080p HD • Multi-language Captions
                  </span>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px' }}>
                    {selectedCourse.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              {/* Right Curriculum Module List */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px', maxHeight: '380px', overflowY: 'auto' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>
                  Course Syllabus & Modules
                </h4>

                {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                  selectedCourse.modules.map((m) => (
                    <div key={m.id} style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                        {m.title}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {m.lessons.map((les) => (
                          <div
                            key={les.id}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: activeLessonId === les.id ? 'var(--primary-soft)' : 'var(--panel)',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.8125rem',
                              cursor: 'pointer',
                            }}
                            onClick={() => setActiveLessonId(les.id)}
                          >
                            <span style={{ color: activeLessonId === les.id ? 'var(--primary)' : 'var(--text)' }}>
                              ▶ {les.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{les.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Standard curriculum: 5 Modules, 24 lessons, and 1 capstone assessment included.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 3. Note Preview Modal */}
      <Modal
        isOpen={!!previewNote}
        title={previewNote?.title || 'Note Preview'}
        onClose={() => setPreviewNote(null)}
      >
        {previewNote && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Badge variant="primary">{previewNote.type}</Badge>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{previewNote.size} • {previewNote.date}</span>
            </div>
            <h4 style={{ color: 'var(--navy)', marginBottom: '8px' }}>{previewNote.course} — {previewNote.module}</h4>
            <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '10px', fontSize: '0.875rem', lineHeight: '1.7', color: 'var(--text)', marginBottom: '20px' }}>
              <p><strong>Overview:</strong> {previewNote.contentPreview}</p>
              <p style={{ marginTop: '12px' }}>
                Key architectural patterns, syntaxes, best practices, and troubleshooting tips compiled by the course instructor.
              </p>
            </div>
            <Button
              variant="primary"
              fullWidth
              icon={<DownloadIcon size={16} />}
              onClick={() => {
                onShowToast('Download Initiated', `${previewNote.title} downloaded.`, 'success');
                setPreviewNote(null);
              }}
            >
              Download Full Document
            </Button>
          </div>
        )}
      </Modal>

      {/* 4. Submit Assignment Modal */}
      <Modal
        isOpen={!!submitAssignmentModal}
        title={`Submit: ${submitAssignmentModal?.title || 'Assignment'}`}
        onClose={() => setSubmitAssignmentModal(null)}
      >
        {submitAssignmentModal && (
          <form onSubmit={handleConfirmAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Course: <strong>{submitAssignmentModal.course}</strong> • Due: <strong>{submitAssignmentModal.due}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Upload Solution File (.zip, .pdf, .ipynb, .fig)</label>
              <input
                type="text"
                className="form-control"
                value={assignmentFile}
                onChange={(e) => setAssignmentFile(e.target.value)}
                placeholder="filename_solution.zip"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Submission Comments / Git Repository URL</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Add notes for the evaluator or repository link..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setSubmitAssignmentModal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<UploadIcon size={16} />}>
                Submit Project
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 5. Certificate Preview Modal */}
      <Modal
        isOpen={!!previewCert}
        title="Verified Credential"
        onClose={() => setPreviewCert(null)}
        wide={true}
      >
        {previewCert && (
          <div>
            <div className="certificate-frame">
              <div className="cert-watermark">KRYTIL</div>
              <div className="cert-badge-gold">
                <AwardIcon size={32} />
              </div>
              <h3 className="cert-title">Certificate of Completion</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>This credential is officially conferred upon</p>
              <div className="cert-recipient">{previewCert.studentName}</div>
              <p style={{ color: '#334155', maxWidth: '580px', margin: '14px auto', lineHeight: '1.6' }}>
                in recognition of successful mastery, hands-on project submissions, and capstone assessment for
              </p>
              <h4 style={{ color: '#1e40af', fontSize: '1.25rem', fontWeight: 800 }}>
                {previewCert.course}
              </h4>
              <div className="cert-footer-row">
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>{previewCert.instructor}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Lead Instructor</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb' }}>Credential ID: {previewCert.credentialId}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>KRYTIL Certification Board</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Verified Digital Credential</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <Button variant="secondary" onClick={() => setPreviewCert(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={<DownloadIcon size={16} />}
                onClick={() => {
                  onShowToast('Certificate Downloaded', `PDF for ${previewCert.credentialId} saved.`, 'success');
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
