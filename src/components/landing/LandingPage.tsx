import React, { useState } from 'react';
import { Course } from '../../types';
import { CourseCard } from '../common/CourseCard';
import { Button, ThemeToggle, Badge } from '../common/CommonUI';
import {
  BookOpenIcon,
  AwardIcon,
  ShieldAlertIcon,
  BarChart3Icon,
  FileTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PlayCircleIcon,
  ZapIcon,
  UsersIcon,
} from '../icons/Icons';

type LandingPageProps = {
  courses: Course[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (route: any) => void;
  onSelectCourse: (course: Course) => void;
  onBuyCourse: (course: Course) => void;
};

export const LandingPage: React.FC<LandingPageProps> = ({
  courses,
  theme,
  onToggleTheme,
  onNavigate,
  onSelectCourse,
  onBuyCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Development', 'Design', 'Data & AI', 'Cloud & DevOps', 'Marketing'];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter((c) => c.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/krytil-logo.png" alt="KRYTIL LMS" className="landing-logo" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>
                KRYTIL <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>LMS</span>
              </strong>
            </div>
          </div>

          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#courses">Courses</a>
            <a href="#learning">Learning Modules</a>
            <a href="#assessments">Assessments</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#certificates">Certificates</a>
          </nav>

          <div className="landing-header-actions">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/login')}
            >
              Student Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-pill">
              <SparklesIcon size={16} color="var(--primary)" />
              <span>Next-Generation Learning Platform</span>
            </div>

            <h1 className="hero-title">
              Learn Smarter. <br />
              <span className="gradient-text">Perform Better.</span>
            </h1>

            <p className="hero-description">
              KRYTIL LMS combines interactive courses, hands-on assignments, structured quizzes,
              and AI-proctored assessments into one unified platform built for peak learner performance.
            </p>

            <div className="hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                icon={<ChevronRightIcon size={18} />}
                onClick={() => onNavigate('/courses')}
              >
                Explore Courses
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<PlayCircleIcon size={18} />}
                onClick={() => onNavigate('/signup')}
              >
                Get Started Free
              </Button>
            </div>

            <div className="hero-metrics-row">
              <div className="hero-metric-item">
                <strong>12,500+</strong>
                <span>Active Learners</span>
              </div>
              <div className="hero-metric-item">
                <strong>98.4%</strong>
                <span>Pass Rate</span>
              </div>
              <div className="hero-metric-item">
                <strong>4.9 / 5</strong>
                <span>Average Rating</span>
              </div>
              <div className="hero-metric-item">
                <strong>150+</strong>
                <span>Industry Modules</span>
              </div>
            </div>
          </div>

          {/* Product Window Preview Mockup */}
          <div className="hero-preview-window">
            <div className="window-header">
              <div className="window-dots">
                <span /><span /><span />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                app.krytil.com/student/dashboard
              </span>
              <div style={{ width: '40px' }} />
            </div>

            <div className="window-body">
              <div className="preview-highlight-card">
                <div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>CURRENT COURSE</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 8px' }}>
                    Full-Stack Modern Web Engineering
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                    <span>Module 3 of 5</span> • <span>72% Completed</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '8px', fontWeight: 700 }}>
                  Resume ▶
                </div>
              </div>

              <div className="preview-grid-2">
                <div className="preview-card-mini">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>NEXT TEST</span>
                    <Badge variant="warning">Proctored</Badge>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>Frontend Capstone</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    60 Mins • 10 Questions
                  </div>
                </div>

                <div className="preview-card-mini">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LATEST QUIZ</span>
                    <Badge variant="success">92%</Badge>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>React Hooks & Architecture</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Score: 18/20 (Passed)
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AwardIcon size={20} color="var(--primary)" />
                  <div>
                    <strong style={{ fontSize: '0.875rem', display: 'block', color: 'var(--navy)' }}>
                      2 Verified Certificates Earned
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Credential IDs: KRY-FSW-88492, KRY-UXD-31904
                    </span>
                  </div>
                </div>
                <Badge variant="primary">Verified</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Key Platform Capabilities</span>
          <h2 className="section-heading-lg">Everything You Need for Modern Mastery</h2>
          <p className="section-subtitle-lg">
            A comprehensive suite of learning tools engineered to support learners from fundamental concepts to certified mastery.
          </p>
        </div>

        <div className="feature-cards-grid">
          <div className="feature-box">
            <div className="feature-icon-box" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
              <BookOpenIcon size={26} />
            </div>
            <h4>Structured Course Curriculum</h4>
            <p>
              Organized into bite-sized modules, high-definition videos, interactive reading notes, and downloadable code resources.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-box" style={{ background: 'var(--purple-soft)', color: 'var(--purple)' }}>
              <ShieldAlertIcon size={26} />
            </div>
            <h4>AI-Proctored Assessment Suite</h4>
            <p>
              Secure, high-integrity test environments featuring automated webcam verification, browser lockouts, and countdown timers.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-box" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
              <AwardIcon size={26} />
            </div>
            <h4>Verifiable Digital Certificates</h4>
            <p>
              Receive tamper-proof completion credentials with unique verification IDs, instantly shareable with employers.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-box" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
              <FileTextIcon size={26} />
            </div>
            <h4>Centralized Note Repository</h4>
            <p>
              Curated lecture notes and downloadable cheat sheets categorized by course and module for swift exam revision.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-box" style={{ background: 'var(--cyan-soft)', color: 'var(--cyan)' }}>
              <ZapIcon size={26} />
            </div>
            <h4>Interactive Quizzes & Instant Feedback</h4>
            <p>
              Test retention with timed multiple-choice quizzes and detailed explanations for every option right after submission.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-box" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
              <BarChart3Icon size={26} />
            </div>
            <h4>Detailed Analytics & Performance Tracking</h4>
            <p>
              Visualize weekly learning trends, time spent, assignment scores, and readiness indicators with clear graphical charts.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Showcase Section */}
      <section id="courses" className="section-wrapper alt-bg">
        <div className="section-inner">
          <div className="section-header-center">
            <span className="section-tag">Featured Catalog</span>
            <h2 className="section-heading-lg">Explore In-Demand Professional Courses</h2>
            <p className="section-subtitle-lg">
              Designed by industry leaders to deliver actionable skills and practical expertise.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="tab-nav-row" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="course-grid">
            {filteredCourses.slice(0, 6).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={onSelectCourse}
                onBuyCourse={onBuyCourse}
                showProgress={false}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/courses')}
            >
              Browse All Courses →
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Modules Breakdown */}
      <section id="learning" className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Modular Learning System</span>
          <h2 className="section-heading-lg">Built for Maximum Knowledge Retention</h2>
          <p className="section-subtitle-lg">
            Every course follows a multi-tier learning roadmap blending theoretical foundations with practical project deliverables.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="panel" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div className="brand-badge lg" style={{ margin: '0 auto 16px' }}>01</div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '8px' }}>Concept Lectures</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Structured video sessions explaining architectural patterns and best practices with real code walkthroughs.
            </p>
          </div>

          <div className="panel" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div className="brand-badge lg" style={{ margin: '0 auto 16px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>02</div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '8px' }}>Notes & Cheatsheets</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Downloadable summaries, diagrams, and reference guides available 24/7 for offline study.
            </p>
          </div>

          <div className="panel" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div className="brand-badge lg" style={{ margin: '0 auto 16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>03</div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '8px' }}>Hands-On Assignments</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Solve real-world challenges, upload project deliverables, and receive constructive instructor feedback.
            </p>
          </div>

          <div className="panel" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div className="brand-badge lg" style={{ margin: '0 auto 16px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>04</div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '8px' }}>Capstones & Quizzes</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Validate subject proficiency through timed quizzes and comprehensive final examinations.
            </p>
          </div>
        </div>
      </section>

      {/* AI Proctoring & Assessment Showcase Banner */}
      <section id="assessments" className="section-wrapper" style={{ paddingTop: 0 }}>
        <div className="proctoring-banner">
          <div>
            <Badge variant="primary" className="mb-8">HIGH-INTEGRITY TESTING</Badge>
            <h3 style={{ marginTop: '12px' }}>AI-Proctored Assessment Environment</h3>
            <p>
              Experience seamless, stress-free certification exams with automated system readiness checks,
              intelligent ambient monitoring, and real-time timer protection.
            </p>

            <div className="proctoring-checkmarks">
              <div><CheckCircleIcon size={18} color="#60a5fa" /> Automated Camera & Mic Checks</div>
              <div><CheckCircleIcon size={18} color="#60a5fa" /> Full-Screen Tab Lockout Guard</div>
              <div><CheckCircleIcon size={18} color="#60a5fa" /> Real-time Countdown Timer</div>
              <div><CheckCircleIcon size={18} color="#60a5fa" /> Instant Grading & Score Sheet</div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <Button
                variant="primary"
                onClick={() => onNavigate('/student/tests')}
              >
                View Assessment Suite →
              </Button>
            </div>
          </div>

          <div style={{ background: '#090d16', border: '1px solid #334155', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="cam-pulse" style={{ background: '#ef4444' }} />
                <strong style={{ fontSize: '0.8125rem', color: '#fff' }}>LIVE AI PROCTOR</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Session ID: #PRC-8819</span>
            </div>

            <div style={{ background: '#1e293b', height: '140px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
              <UsersIcon size={32} color="#60a5fa" />
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Simulated Learner Feed (Webcam Active)</span>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>Identity Verified: ✅ Yes</span>
              <span>Integrity Status: Normal</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="section-wrapper alt-bg">
        <div className="section-inner">
          <div className="section-header-center">
            <span className="section-tag">Learning Journey</span>
            <h2 className="section-heading-lg">How KRYTIL Works in 4 Steps</h2>
            <p className="section-subtitle-lg">
              A frictionless progression from enrollment to certified professional.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h5>Select Your Course</h5>
              <p>Browse our catalog of industry-curated curriculums and enroll instantly.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h5>Learn at Your Pace</h5>
              <p>Access high-quality lectures, lecture notes, and complete hands-on assignments.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h5>Take Assessments</h5>
              <p>Reinforce mastery through regular quizzes and the final proctored exam.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h5>Earn & Share Certificate</h5>
              <p>Receive your verifiable digital certificate to showcase on LinkedIn & resumes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Showcase Section */}
      <section id="certificates" className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Industry Credentials</span>
          <h2 className="section-heading-lg">Globally Verifiable Certificates</h2>
          <p className="section-subtitle-lg">
            Prove your skills with authenticated certificate credentials issued immediately upon course completion.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div className="certificate-frame">
            <div className="cert-watermark">KRYTIL</div>
            <div className="cert-badge-gold">
              <AwardIcon size={32} />
            </div>
            <h3 className="cert-title">Certificate of Completion</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>This is proudly presented to</p>
            <div className="cert-recipient">Alex Johnson</div>
            <p style={{ color: '#334155', maxWidth: '580px', margin: '14px auto', lineHeight: '1.6' }}>
              for successfully completing all curriculum requirements, hands-on assignments, and the capstone assessment for
            </p>
            <h4 style={{ color: '#1e40af', fontSize: '1.25rem', fontWeight: 800 }}>
              Full-Stack Modern Web Engineering
            </h4>
            <div className="cert-footer-row">
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>Dr. Sarah Malik</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Lead Instructor</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb' }}>ID: KRY-FSW-88492</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>KRYTIL Certification Board</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Verified Digital Credential</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="section-wrapper">
        <div className="cta-banner">
          <h2>Ready to Accelerate Your Career?</h2>
          <p>
            Join thousands of learners mastering cutting-edge technology and engineering skills on KRYTIL LMS today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('/signup')}
            >
              Create Free Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: '#fff' }}
              onClick={() => onNavigate('/courses')}
            >
              Browse All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/krytil-logo.png" alt="KRYTIL LMS" className="landing-logo" />
              <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)' }}>KRYTIL LMS</strong>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px' }}>
              The modern learning and assessment platform designed to deliver measurable learning outcomes.
            </p>
          </div>

          <div className="footer-col">
            <h6>Platform</h6>
            <div className="footer-links">
              <a href="#courses">Courses</a>
              <a href="#features">Features</a>
              <a href="#assessments">Assessments</a>
              <a href="#certificates">Certificates</a>
            </div>
          </div>

          <div className="footer-col">
            <h6>Portals</h6>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }}>Student Login</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>Student Registration</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/admin/login'); }}>Admin Portal</a>
            </div>
          </div>

          <div className="footer-col">
            <h6>Legal & Support</h6>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">System Status</a>
              <a href="mailto:support@krytil.com">support@krytil.com</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KRYTIL LMS. All rights reserved.</span>
          <span>Learn Smarter. Perform Better.</span>
        </div>
      </footer>
    </div>
  );
};
