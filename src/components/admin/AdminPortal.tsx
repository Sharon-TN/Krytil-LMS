import React, { useState } from 'react';
import {
  Course,
  Note,
  Assignment,
  Quiz,
  Assessment,
  QuestionBankItem,
  Student,
  Payment,
  Certificate,
  Route,
} from '../../types';
import {
  Button,
  Badge,
  StatCardUI,
  Modal,
  ThemeToggle,
} from '../common/CommonUI';
import {
  DashboardIcon,
  BookOpenIcon,
  UsersIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  HelpCircleIcon,
  ShieldAlertIcon,
  DatabaseIcon,
  CreditCardIcon,
  AwardIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  BellIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  PlusIcon,
  DownloadIcon,
  TrashIcon,
  EditIcon,
} from '../icons/Icons';

type AdminPortalProps = {
  route: Route;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (route: Route) => void;
  onLogout: () => void;
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  notes: Note[];
  onUpdateNotes: (notes: Note[]) => void;
  assignments: Assignment[];
  onUpdateAssignments: (assignments: Assignment[]) => void;
  quizzes: Quiz[];
  onUpdateQuizzes: (quizzes: Quiz[]) => void;
  assessments: Assessment[];
  onUpdateAssessments: (assessments: Assessment[]) => void;
  questionBank: QuestionBankItem[];
  onUpdateQuestionBank: (questions: QuestionBankItem[]) => void;
  payments: Payment[];
  certificates: Certificate[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
};

export const AdminPortal: React.FC<AdminPortalProps> = ({
  route,
  theme,
  onToggleTheme,
  onNavigate,
  onLogout,
  courses,
  onUpdateCourses,
  students,
  onUpdateStudents,
  notes,
  onUpdateNotes,
  assignments,
  onUpdateAssignments,
  quizzes,
  onUpdateQuizzes,
  assessments,
  onUpdateAssessments,
  questionBank,
  onUpdateQuestionBank,
  payments,
  certificates,
  onShowToast,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [createCourseModal, setCreateCourseModal] = useState(false);
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [uploadNoteModal, setUploadNoteModal] = useState(false);
  const [createAssignmentModal, setCreateAssignmentModal] = useState(false);
  const [createQuizModal, setCreateQuizModal] = useState(false);
  const [createAssessmentModal, setCreateAssessmentModal] = useState(false);
  const [addQuestionModal, setAddQuestionModal] = useState(false);

  // Form states for modals
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    instructor: 'Dr. Sarah Malik',
    category: 'Development',
    level: 'Intermediate',
    price: 3999,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
    description: '',
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [newNote, setNewNote] = useState({
    title: '',
    course: 'Full-Stack Modern Web Engineering',
    module: 'Module 1',
    type: 'PDF' as const,
    size: '1.5 MB',
  });

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: 'Full-Stack Modern Web Engineering',
    due: 'Sep 05, 2026',
    maxScore: 100,
  });

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    course: 'Full-Stack Modern Web Engineering',
    duration: '20 mins',
    durationMinutes: 20,
    questionsCount: 10,
  });

  const [newAssessment, setNewAssessment] = useState({
    title: '',
    course: 'Full-Stack Modern Web Engineering',
    duration: '60 mins',
    durationMinutes: 60,
    passingScore: 75,
    proctored: true,
  });

  const [newQuestion, setNewQuestion] = useState({
    q: '',
    topic: 'React',
    difficulty: 'Medium' as const,
    type: 'MCQ' as const,
    points: 5,
  });

  const adminNavItems: { label: string; route: Route; icon: React.ReactNode }[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: <DashboardIcon size={18} /> },
    { label: 'Courses', route: '/admin/courses', icon: <BookOpenIcon size={18} /> },
    { label: 'Students', route: '/admin/students', icon: <UsersIcon size={18} /> },
    { label: 'Notes', route: '/admin/notes', icon: <FileTextIcon size={18} /> },
    { label: 'Assignments', route: '/admin/assignments', icon: <ClipboardCheckIcon size={18} /> },
    { label: 'Quizzes', route: '/admin/quizzes', icon: <HelpCircleIcon size={18} /> },
    { label: 'Tests & Assessments', route: '/admin/tests', icon: <ShieldAlertIcon size={18} /> },
    { label: 'Question Bank', route: '/admin/question-bank', icon: <DatabaseIcon size={18} /> },
    { label: 'Payments', route: '/admin/payments', icon: <CreditCardIcon size={18} /> },
    { label: 'Certificates', route: '/admin/certificates', icon: <AwardIcon size={18} /> },
    { label: 'Reports', route: '/admin/reports', icon: <BarChart3Icon size={18} /> },
    { label: 'Settings', route: '/admin/settings', icon: <SettingsIcon size={18} /> },
  ];

  // Course handlers
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title) return;

    const created: Course = {
      id: Date.now(),
      title: newCourse.title,
      instructor: newCourse.instructor || 'Lead Instructor',
      category: newCourse.category || 'Development',
      level: newCourse.level as any || 'Intermediate',
      price: Number(newCourse.price) || 3999,
      duration: newCourse.duration || '6 weeks',
      rating: 5.0,
      students: 0,
      image: newCourse.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
      description: newCourse.description || 'Comprehensive curriculum created by industry professionals.',
      purchased: false,
    };

    onUpdateCourses([created, ...courses]);
    setCreateCourseModal(false);
    setNewCourse({ title: '', instructor: 'Dr. Sarah Malik', category: 'Development', level: 'Intermediate', price: 3999, duration: '6 weeks', image: '', description: '' });
    onShowToast('Course Created', `${created.title} is now published.`, 'success');
  };

  const handleDeleteCourse = (id: number) => {
    onUpdateCourses(courses.filter((c) => c.id !== id));
    onShowToast('Course Removed', 'The course has been deleted.', 'info');
  };

  // Student Handlers
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    const created: Student = {
      id: Date.now(),
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone || '+91 99999 88888',
      courses: 1,
      completion: '0%',
      score: '—',
      status: 'Active',
      enrolledDate: 'Today',
    };

    onUpdateStudents([created, ...students]);
    setAddStudentModal(false);
    setNewStudent({ name: '', email: '', phone: '' });
    onShowToast('Student Enrolled', `${created.name} was added.`, 'success');
  };

  // Note Handlers
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title) return;

    const created: Note = {
      id: Date.now(),
      title: newNote.title,
      course: newNote.course,
      module: newNote.module,
      date: 'Today',
      type: newNote.type,
      size: newNote.size,
      contentPreview: 'Newly uploaded curriculum notes and reference materials.',
    };

    onUpdateNotes([created, ...notes]);
    setUploadNoteModal(false);
    setNewNote({ title: '', course: 'Full-Stack Modern Web Engineering', module: 'Module 1', type: 'PDF', size: '1.5 MB' });
    onShowToast('Note Published', `${created.title} is now accessible to enrolled learners.`, 'success');
  };

  // Assignment Handlers
  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title) return;

    const created: Assignment = {
      id: Date.now(),
      title: newAssignment.title,
      course: newAssignment.course,
      due: newAssignment.due,
      status: 'Pending',
      maxScore: Number(newAssignment.maxScore) || 100,
      instructions: 'Complete and submit according to the project specifications.',
    };

    onUpdateAssignments([created, ...assignments]);
    setCreateAssignmentModal(false);
    setNewAssignment({ title: '', course: 'Full-Stack Modern Web Engineering', due: 'Sep 05, 2026', maxScore: 100 });
    onShowToast('Assignment Created', `${created.title} has been scheduled.`, 'success');
  };

  // Quiz Handlers
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.title) return;

    const created: Quiz = {
      id: Date.now(),
      title: newQuiz.title,
      course: newQuiz.course,
      duration: newQuiz.duration,
      durationMinutes: newQuiz.durationMinutes,
      questionsCount: newQuiz.questionsCount,
      status: 'Available',
      questions: [
        {
          id: 1,
          question: `Sample question for ${newQuiz.title}`,
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Standard verified answer explanation.',
        },
      ],
    };

    onUpdateQuizzes([created, ...quizzes]);
    setCreateQuizModal(false);
    setNewQuiz({ title: '', course: 'Full-Stack Modern Web Engineering', duration: '20 mins', durationMinutes: 20, questionsCount: 10 });
    onShowToast('Quiz Published', `${created.title} is now active.`, 'success');
  };

  // Assessment Handlers
  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessment.title) return;

    const created: Assessment = {
      id: Date.now(),
      title: newAssessment.title,
      course: newAssessment.course,
      duration: newAssessment.duration,
      durationMinutes: newAssessment.durationMinutes,
      questionsCount: 10,
      status: 'Available',
      proctored: newAssessment.proctored,
      passingScore: Number(newAssessment.passingScore) || 75,
      attemptsAllowed: 2,
      attemptsTaken: 0,
      instructions: [
        'Webcam and microphone must remain connected.',
        'Full-screen lock will be monitored by the AI proctor.',
      ],
      questions: [
        {
          id: 1,
          question: `Core evaluation question for ${newAssessment.title}`,
          options: ['Option 1', 'Option 2 (Correct)', 'Option 3', 'Option 4'],
          correctAnswer: 1,
        },
      ],
    };

    onUpdateAssessments([created, ...assessments]);
    setCreateAssessmentModal(false);
    setNewAssessment({ title: '', course: 'Full-Stack Modern Web Engineering', duration: '60 mins', durationMinutes: 60, passingScore: 75, proctored: true });
    onShowToast('Assessment Created', `${created.title} is now live.`, 'success');
  };

  // Question Bank Handlers
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.q) return;

    const created: QuestionBankItem = {
      id: Date.now(),
      q: newQuestion.q,
      topic: newQuestion.topic,
      difficulty: newQuestion.difficulty,
      type: newQuestion.type,
      points: Number(newQuestion.points) || 5,
      course: 'Full-Stack Modern Web Engineering',
    };

    onUpdateQuestionBank([created, ...questionBank]);
    setAddQuestionModal(false);
    setNewQuestion({ q: '', topic: 'React', difficulty: 'Medium', type: 'MCQ', points: 5 });
    onShowToast('Question Added', 'Saved to the central question repository.', 'success');
  };

  // Total Platform Revenue
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="app-layout">
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Admin Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-badge" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>K</div>
            <span>KRYTIL</span>
            <span className="tag" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#8b5cf6' }}>Admin</span>
          </div>
          <button
            className="mobile-menu-toggle btn-ghost btn-icon"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Administration</span>
          {adminNavItems.map((item) => {
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
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              A
            </div>
            <div className="user-details">
              <div className="name">Super Admin</div>
              <div className="role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="app-main-wrapper">
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
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Management Console
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                KRYTIL LMS Operations
              </h2>
            </div>
          </div>

          <div className="topbar-right">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              className="notification-btn"
              onClick={() => onShowToast('Admin Alerts', 'All microservices and proctoring nodes operational.', 'info')}
            >
              <BellIcon size={18} />
              <span className="notification-badge" />
            </button>

            <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.85rem', background: '#7c3aed' }}>
              A
            </div>
          </div>
        </header>

        <main className="page-content-wrapper">
          {/* ========================================================
              1. ADMIN DASHBOARD
             ======================================================== */}
          {route === '/admin/dashboard' && (
            <div>
              <div className="stats-grid">
                <StatCardUI
                  title="Total Students"
                  value={students.length + 2840}
                  delta="+14.2% MoM"
                  icon={<UsersIcon size={24} />}
                />
                <StatCardUI
                  title="Published Courses"
                  value={courses.length}
                  delta="+2 this month"
                  icon={<BookOpenIcon size={24} />}
                  colorBg="var(--purple-soft)"
                  colorText="var(--purple)"
                />
                <StatCardUI
                  title="Total Revenue"
                  value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
                  delta="+18.5% YoY"
                  icon={<CreditCardIcon size={24} />}
                  colorBg="var(--success-soft)"
                  colorText="var(--success)"
                />
                <StatCardUI
                  title="Active Exams"
                  value={assessments.length}
                  delta="AI Proctor Active"
                  icon={<ShieldAlertIcon size={24} />}
                  colorBg="var(--warning-soft)"
                  colorText="var(--warning)"
                />
              </div>

              {/* Two Column Layout: Recent Enrollments & Revenue Analytics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3 className="panel-title">Recent Student Enrollments</h3>
                      <p className="panel-subtitle">Latest learners who joined the platform</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onNavigate('/admin/students')}>
                      View All Students
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 4).map((s) => (
                          <tr key={s.id}>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.email}</td>
                            <td><Badge variant="success">{s.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3 className="panel-title">Monthly Platform Revenue</h3>
                      <p className="panel-subtitle">Gross enrollment receipts (2026)</p>
                    </div>
                  </div>

                  <div style={{ paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                      {[
                        { month: 'Jan', val: 78, amt: '₹7.8L' },
                        { month: 'Feb', val: 84, amt: '₹8.4L' },
                        { month: 'Mar', val: 92, amt: '₹9.2L' },
                        { month: 'Apr', val: 88, amt: '₹8.8L' },
                        { month: 'May', val: 110, amt: '₹11.0L' },
                        { month: 'Jun', val: 128, amt: '₹12.8L' },
                      ].map((item) => (
                        <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                            {item.amt}
                          </span>
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '40px',
                              height: `${(item.val / 130) * 100}%`,
                              background: 'linear-gradient(180deg, var(--purple), #6366f1)',
                              borderRadius: '6px 6px 0 0',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '8px' }}>
                            {item.month}
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
              2. ADMIN COURSES
             ======================================================== */}
          {route === '/admin/courses' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Course Management</h2>
                  <p className="panel-subtitle">Create, modify, and monitor course offerings</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setCreateCourseModal(true)}
                >
                  Create Course
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Instructor</th>
                      <th>Category</th>
                      <th>Level</th>
                      <th>Price</th>
                      <th>Students</th>
                      <th>Rating</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={course.image}
                              alt={course.title}
                              style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                            <strong>{course.title}</strong>
                          </div>
                        </td>
                        <td>{course.instructor}</td>
                        <td><Badge variant="primary">{course.category}</Badge></td>
                        <td>{course.level}</td>
                        <td><strong>₹{course.price.toLocaleString('en-IN')}</strong></td>
                        <td>{course.students.toLocaleString()}</td>
                        <td>⭐ {course.rating.toFixed(1)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            Delete
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
              3. ADMIN STUDENTS
             ======================================================== */}
          {route === '/admin/students' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Student Directory</h2>
                  <p className="panel-subtitle">Manage enrolled learners, progress, and account statuses</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setAddStudentModal(true)}
                >
                  Add Student
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Courses</th>
                      <th>Avg Completion</th>
                      <th>Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                              {s.name.charAt(0)}
                            </div>
                            <strong>{s.name}</strong>
                          </div>
                        </td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>{s.courses}</td>
                        <td>{s.completion}</td>
                        <td><strong>{s.score}</strong></td>
                        <td>
                          <Badge variant={s.status === 'Active' ? 'success' : 'neutral'}>
                            {s.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              4. ADMIN NOTES
             ======================================================== */}
          {route === '/admin/notes' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Notes Repository</h2>
                  <p className="panel-subtitle">Upload and organize lecture notes for enrolled students</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setUploadNoteModal(true)}
                >
                  Upload Note
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Note Title</th>
                      <th>Course</th>
                      <th>Module</th>
                      <th>File Format</th>
                      <th>Size</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((n) => (
                      <tr key={n.id}>
                        <td><strong>{n.title}</strong></td>
                        <td>{n.course}</td>
                        <td>{n.module}</td>
                        <td><Badge variant="primary">{n.type}</Badge></td>
                        <td>{n.size}</td>
                        <td>{n.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              5. ADMIN ASSIGNMENTS
             ======================================================== */}
          {route === '/admin/assignments' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Assignment Management</h2>
                  <p className="panel-subtitle">Design project deliverables and set grading criteria</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setCreateAssignmentModal(true)}
                >
                  Create Assignment
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Course</th>
                      <th>Due Date</th>
                      <th>Max Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.id}>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.course}</td>
                        <td>{a.due}</td>
                        <td>{a.maxScore || 100} pts</td>
                        <td><Badge variant="primary">{a.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              6. ADMIN QUIZZES
             ======================================================== */}
          {route === '/admin/quizzes' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Quiz Builder & Management</h2>
                  <p className="panel-subtitle">Construct question sets for regular knowledge checks</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setCreateQuizModal(true)}
                >
                  Create Quiz
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Quiz Name</th>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Questions</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((q) => (
                      <tr key={q.id}>
                        <td><strong>{q.title}</strong></td>
                        <td>{q.course}</td>
                        <td>{q.duration}</td>
                        <td>{q.questions.length}</td>
                        <td><Badge variant="success">{q.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              7. ADMIN TESTS & ASSESSMENTS
             ======================================================== */}
          {route === '/admin/tests' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Assessment & Exam Suite</h2>
                  <p className="panel-subtitle">Configure high-stakes AI-proctored certification exams</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setCreateAssessmentModal(true)}
                >
                  Create Assessment
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Assessment Title</th>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Passing Score</th>
                      <th>AI Proctoring</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.title}</strong></td>
                        <td>{item.course}</td>
                        <td>{item.duration}</td>
                        <td>{item.passingScore}%</td>
                        <td>
                          <Badge variant={item.proctored ? 'warning' : 'neutral'}>
                            {item.proctored ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </td>
                        <td><Badge variant="primary">{item.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              8. ADMIN QUESTION BANK
             ======================================================== */}
          {route === '/admin/question-bank' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Question Bank</h2>
                  <p className="panel-subtitle">Centralized pool of questions categorized by topic and difficulty</p>
                </div>
                <Button
                  variant="primary"
                  icon={<PlusIcon size={16} />}
                  onClick={() => setAddQuestionModal(true)}
                >
                  Add Question
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Topic</th>
                      <th>Difficulty</th>
                      <th>Type</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionBank.map((q) => (
                      <tr key={q.id}>
                        <td><strong>{q.q}</strong></td>
                        <td><Badge variant="primary">{q.topic}</Badge></td>
                        <td>
                          <Badge variant={q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'warning' : 'success'}>
                            {q.difficulty}
                          </Badge>
                        </td>
                        <td>{q.type}</td>
                        <td>{q.points} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              9. ADMIN PAYMENTS
             ======================================================== */}
          {route === '/admin/payments' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Payment & Revenue Ledger</h2>
                  <p className="panel-subtitle">Comprehensive transaction logs and settlement tracking</p>
                </div>
                <Button
                  variant="secondary"
                  icon={<DownloadIcon size={16} />}
                  onClick={() => onShowToast('Exporting Report', 'Transaction CSV exported.', 'success')}
                >
                  Export CSV
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.id}</strong></td>
                        <td>{p.studentName}</td>
                        <td>{p.course}</td>
                        <td><strong>₹{p.amount.toLocaleString('en-IN')}</strong></td>
                        <td>{p.method}</td>
                        <td>{p.date}</td>
                        <td><Badge variant="success">{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              10. ADMIN CERTIFICATES
             ======================================================== */}
          {route === '/admin/certificates' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Issued Certificates Ledger</h2>
                  <p className="panel-subtitle">Verify and manage certified student credentials</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Credential ID</th>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Instructor</th>
                      <th>Issue Date</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((c) => (
                      <tr key={c.id}>
                        <td><strong style={{ color: 'var(--primary)' }}>{c.credentialId}</strong></td>
                        <td>{c.studentName}</td>
                        <td>{c.course}</td>
                        <td>{c.instructor}</td>
                        <td>{c.issueDate}</td>
                        <td><Badge variant="success">{c.grade}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              11. ADMIN REPORTS
             ======================================================== */}
          {route === '/admin/reports' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Platform Intelligence & Reports</h2>
                  <p className="panel-subtitle">Learner progression, assessment pass rates, and course completion stats</p>
                </div>
                <Button
                  variant="primary"
                  icon={<DownloadIcon size={16} />}
                  onClick={() => onShowToast('Exporting Analytics', 'Analytics report PDF downloaded.', 'success')}
                >
                  Download Summary PDF
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: '12px' }}>
                  <h4 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Course Completion Rate</h4>
                  <strong style={{ fontSize: '2rem', color: 'var(--success)' }}>78.4%</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    +6.2% improvement compared to last academic quarter.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: '12px' }}>
                  <h4 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Assessment Pass Rate</h4>
                  <strong style={{ fontSize: '2rem', color: 'var(--primary)' }}>92.1%</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Average first-attempt test score: 84.6%
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: '12px' }}>
                  <h4 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Proctor Integrity Index</h4>
                  <strong style={{ fontSize: '2rem', color: 'var(--purple)' }}>99.8%</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Zero critical tab-switch anomalies detected.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              12. ADMIN SETTINGS
             ======================================================== */}
          {route === '/admin/settings' && (
            <div className="panel" style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">LMS Platform Configuration</h2>
                  <p className="panel-subtitle">Global platform branding, proctor sensitivity, and email triggers</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onShowToast('Settings Saved', 'Platform preferences updated.', 'success');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Platform Name</label>
                    <input type="text" className="form-control" defaultValue="KRYTIL LMS" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support Email</label>
                    <input type="email" className="form-control" defaultValue="support@krytil.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">AI Proctor Sensitivity</label>
                    <select className="form-select" defaultValue="Standard">
                      <option>Low (Minimal alerts)</option>
                      <option>Standard (Recommended)</option>
                      <option>High (Strict gaze & audio tracking)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Certificate Verification Prefix</label>
                    <input type="text" className="form-control" defaultValue="KRY-" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <Button type="submit" variant="primary">
                    Save Global Settings
                  </Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          ADMIN CREATION MODALS
         ======================================================== */}

      {/* 1. Create Course Modal */}
      <Modal
        isOpen={createCourseModal}
        title="Create New Course"
        onClose={() => setCreateCourseModal(false)}
        wide={true}
      >
        <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Next.js 15 Full-Stack"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instructor Name</label>
              <input
                type="text"
                className="form-control"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              >
                <option>Development</option>
                <option>Design</option>
                <option>Data & AI</option>
                <option>Cloud & DevOps</option>
                <option>Marketing</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (INR ₹)</label>
              <input
                type="number"
                className="form-control"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Course Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Course syllabus and key objectives..."
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setCreateCourseModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Course
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Student Modal */}
      <Modal
        isOpen={addStudentModal}
        title="Add New Student"
        onClose={() => setAddStudentModal(false)}
      >
        <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sarah Jenkins"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="sarah@example.com"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              placeholder="+91 98765 00000"
              value={newStudent.phone}
              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setAddStudentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Upload Note Modal */}
      <Modal
        isOpen={uploadNoteModal}
        title="Upload Course Note"
        onClose={() => setUploadNoteModal(false)}
      >
        <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Note Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Concurrency & Fiber Architecture"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={newNote.course}
              onChange={(e) => setNewNote({ ...newNote, course: e.target.value })}
            >
              {courses.map((c) => (
                <option key={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Module Reference</label>
            <input
              type="text"
              className="form-control"
              value={newNote.module}
              onChange={(e) => setNewNote({ ...newNote, module: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setUploadNoteModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Note
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Create Assignment Modal */}
      <Modal
        isOpen={createAssignmentModal}
        title="Schedule New Assignment"
        onClose={() => setCreateAssignmentModal(false)}
      >
        <form onSubmit={handleSaveAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Build Redux Toolkit Pipeline"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={newAssignment.course}
              onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
            >
              {courses.map((c) => (
                <option key={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="text"
              className="form-control"
              value={newAssignment.due}
              onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setCreateAssignmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Create Quiz Modal */}
      <Modal
        isOpen={createQuizModal}
        title="Create New Quiz"
        onClose={() => setCreateQuizModal(false)}
      >
        <form onSubmit={handleSaveQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. PostgreSQL Schema Modeling"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input
              type="text"
              className="form-control"
              value={newQuiz.duration}
              onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setCreateQuizModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Quiz
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Create Assessment Modal */}
      <Modal
        isOpen={createAssessmentModal}
        title="Create Proctored Assessment"
        onClose={() => setCreateAssessmentModal(false)}
      >
        <form onSubmit={handleSaveAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Assessment Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cloud Solutions Architect Exam"
              value={newAssessment.title}
              onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (e.g. 60 mins)</label>
            <input
              type="text"
              className="form-control"
              value={newAssessment.duration}
              onChange={(e) => setNewAssessment({ ...newAssessment, duration: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Passing Score (%)</label>
            <input
              type="number"
              className="form-control"
              value={newAssessment.passingScore}
              onChange={(e) => setNewAssessment({ ...newAssessment, passingScore: Number(e.target.value) })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setCreateAssessmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Launch Exam
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Add Question Modal */}
      <Modal
        isOpen={addQuestionModal}
        title="Add Question to Bank"
        onClose={() => setAddQuestionModal(false)}
      >
        <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Question Text</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Type question prompt..."
              value={newQuestion.q}
              onChange={(e) => setNewQuestion({ ...newQuestion, q: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Topic</label>
            <input
              type="text"
              className="form-control"
              value={newQuestion.topic}
              onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select
              className="form-select"
              value={newQuestion.difficulty}
              onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setAddQuestionModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
