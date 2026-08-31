import { useEffect, useState } from 'react';
import {
  Role,
  Route,
  Course,
  Note,
  Assignment,
  Quiz,
  Assessment,
  QuestionBankItem,
  Student,
  Payment,
  Certificate,
  ToastMessage,
} from './types';
import {
  INITIAL_COURSES,
  INITIAL_NOTES,
  INITIAL_ASSIGNMENTS,
  INITIAL_QUIZZES,
  INITIAL_ASSESSMENTS,
  INITIAL_QUESTION_BANK,
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_CERTIFICATES,
} from './mockData';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPages } from './components/auth/AuthPages';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ToastContainer } from './components/common/CommonUI';

function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('krytil_theme') as 'light' | 'dark';
    return saved || 'light';
  });

  // Current Route
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace('#', '') as Route;
    return hash || '/';
  });

  // Role & Current User state
  const [role, setRole] = useState<Role | null>(() => {
    const savedRole = localStorage.getItem('krytil_role') as Role;
    return savedRole || null;
  });

  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('krytil_student_name') || 'Alex Johnson';
  });

  // Global Mock Stores with localStorage sync
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('krytil_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('krytil_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('krytil_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('krytil_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('krytil_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(() => {
    const saved = localStorage.getItem('krytil_question_bank');
    return saved ? JSON.parse(saved) : INITIAL_QUESTION_BANK;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('krytil_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('krytil_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('krytil_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme to document element immediately
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('krytil_theme', theme);
  }, [theme]);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('krytil_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('krytil_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('krytil_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('krytil_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('krytil_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('krytil_question_bank', JSON.stringify(questionBank));
  }, [questionBank]);

  useEffect(() => {
    localStorage.setItem('krytil_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('krytil_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('krytil_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Hash Routing sync
  useEffect(() => {
    const handleHashChange = () => {
      const current = (window.location.hash.replace('#', '') as Route) || '/';
      setRoute(current);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (next: Route) => {
    window.location.hash = next;
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLoginSuccess = (userRole: 'student' | 'admin', name: string) => {
    setRole(userRole);
    setStudentName(name);
    localStorage.setItem('krytil_role', userRole);
    localStorage.setItem('krytil_student_name', name);

    if (userRole === 'admin') {
      navigate('/admin/dashboard');
      showToast('Admin Authenticated', 'Welcome to the KRYTIL LMS Operations console.', 'success');
    } else {
      navigate('/student/dashboard');
      showToast('Welcome to KRYTIL', `Signed in as ${name}`, 'success');
    }
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem('krytil_role');
    navigate('/');
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  // Student course purchase flow
  const handleBuyCourse = (course: Course) => {
    const updated = courses.map((item) =>
      item.id === course.id
        ? { ...item, purchased: true, progress: item.progress || 5 }
        : item
    );
    setCourses(updated);

    // Create Payment Record
    const newPayment: Payment = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      studentName,
      course: course.title,
      amount: course.price,
      date: 'Today',
      method: 'UPI',
      status: 'Paid',
      invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    };
    setPayments([newPayment, ...payments]);

    // If on landing or public courses, jump into student dashboard/courses
    if (!role) {
      setRole('student');
      localStorage.setItem('krytil_role', 'student');
    }
    navigate('/student/courses');
  };

  // Render Routes based on Role & Path
  const renderCurrentView = () => {
    // Auth Routes
    if (route === '/login') {
      return (
        <AuthPages
          type="student-login"
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    if (route === '/signup') {
      return (
        <AuthPages
          type="student-signup"
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    if (route === '/admin/login') {
      return (
        <AuthPages
          type="admin-login"
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    if (route === '/forgot-password') {
      return (
        <AuthPages
          type="forgot-password"
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    // Admin Routes
    if (role === 'admin' || route.startsWith('/admin/')) {
      return (
        <AdminPortal
          route={route}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
          onLogout={handleLogout}
          courses={courses}
          onUpdateCourses={setCourses}
          students={students}
          onUpdateStudents={setStudents}
          notes={notes}
          onUpdateNotes={setNotes}
          assignments={assignments}
          onUpdateAssignments={setAssignments}
          quizzes={quizzes}
          onUpdateQuizzes={setQuizzes}
          assessments={assessments}
          onUpdateAssessments={setAssessments}
          questionBank={questionBank}
          onUpdateQuestionBank={setQuestionBank}
          payments={payments}
          certificates={certificates}
          onShowToast={showToast}
        />
      );
    }

    // Student Routes (or authenticated learner on any student view)
    if (role === 'student' || route.startsWith('/student/')) {
      return (
        <StudentPortal
          route={route}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
          onLogout={handleLogout}
          courses={courses}
          notes={notes}
          assignments={assignments}
          quizzes={quizzes}
          assessments={assessments}
          payments={payments}
          certificates={certificates}
          onBuyCourse={handleBuyCourse}
          onUpdateAssignments={setAssignments}
          onAddNote={(newNote) => setNotes([newNote, ...notes])}
          studentName={studentName}
          onShowToast={showToast}
        />
      );
    }

    // Landing Page (default public view)
    return (
      <LandingPage
        courses={courses}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
        onSelectCourse={(course) => {
          if (course.purchased) {
            setRole('student');
            navigate('/student/courses');
          } else {
            handleBuyCourse(course);
          }
        }}
        onBuyCourse={handleBuyCourse}
      />
    );
  };

  return (
    <>
      {renderCurrentView()}
      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </>
  );
}

export default App;
