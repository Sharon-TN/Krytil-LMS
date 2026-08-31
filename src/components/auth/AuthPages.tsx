import React, { useState } from 'react';
import { Button, ThemeToggle } from '../common/CommonUI';

type AuthPageProps = {
  type: 'student-login' | 'student-signup' | 'admin-login' | 'forgot-password';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (route: any) => void;
  onLoginSuccess: (role: 'student' | 'admin', name: string) => void;
};

export const AuthPages: React.FC<AuthPageProps> = ({
  type,
  theme,
  onToggleTheme,
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState(
    type === 'admin-login' ? 'admin@krytil.com' : 'student@krytil.com'
  );
  const [password, setPassword] = useState(
    type === 'admin-login' ? 'admin123' : 'student123'
  );
  const [fullName, setFullName] = useState('Alex Johnson');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'student-login') {
      if (email === 'student@krytil.com' && password === 'student123') {
        onLoginSuccess('student', 'Alex Johnson');
      } else if (email && password) {
        onLoginSuccess('student', fullName || 'Student User');
      } else {
        setError('Please enter valid email and password.');
      }
    } else if (type === 'admin-login') {
      if (email === 'admin@krytil.com' && password === 'admin123') {
        onLoginSuccess('admin', 'Admin User');
      } else if (email && password) {
        onLoginSuccess('admin', 'Administrator');
      } else {
        setError('Invalid admin credentials. Use admin@krytil.com / admin123');
      }
    } else if (type === 'student-signup') {
      if (!agreeTerms) {
        setError('Please agree to the Terms & Conditions.');
        return;
      }
      onLoginSuccess('student', fullName || 'New Student');
    } else if (type === 'forgot-password') {
      setResetSent(true);
    }
  };

  const fillDemo = (userType: 'student' | 'admin') => {
    if (userType === 'student') {
      setEmail('student@krytil.com');
      setPassword('student123');
    } else {
      setEmail('admin@krytil.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Auth Topbar */}
      <header style={{ padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <div
          onClick={() => onNavigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div className="brand-badge">K</div>
          <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>
            KRYTIL <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>LMS</span>
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </header>

      {/* Auth Main Card */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div
          className="panel"
          style={{
            width: '100%',
            maxWidth: type === 'student-signup' ? '560px' : '440px',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="brand-badge lg" style={{ margin: '0 auto 16px' }}>K</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
              {type === 'student-login' && 'Student Sign In'}
              {type === 'student-signup' && 'Create Student Account'}
              {type === 'admin-login' && 'Administrator Portal'}
              {type === 'forgot-password' && 'Reset Password'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {type === 'student-login' && 'Access your courses, notes, and assessments'}
              {type === 'student-signup' && 'Join thousands of learners on KRYTIL LMS'}
              {type === 'admin-login' && 'Secure administrative access to platform analytics'}
              {type === 'forgot-password' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger-dark)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              {error}
            </div>
          )}

          {resetSent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-soft)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem', fontWeight: 800 }}>
                ✓
              </div>
              <h4 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Reset Link Dispatched</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                We have sent instructions to <strong>{email}</strong>.
              </p>
              <Button variant="primary" fullWidth onClick={() => onNavigate('/login')}>
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {type === 'student-signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              {type !== 'forgot-password' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Password</label>
                    {type === 'student-login' && (
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('/forgot-password'); }}
                        style={{ fontSize: '0.78125rem', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {type === 'student-login' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    Remember me on this browser
                  </label>
                </div>
              )}

              {type === 'student-signup' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <label htmlFor="agreeTerms" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: '1.4' }}>
                    I agree to the KRYTIL LMS Terms of Service and Privacy Policy.
                  </label>
                </div>
              )}

              <Button type="submit" variant="primary" fullWidth size="lg">
                {type === 'student-login' && 'Sign In to Student Portal'}
                {type === 'student-signup' && 'Create Free Account'}
                {type === 'admin-login' && 'Authenticate Admin'}
                {type === 'forgot-password' && 'Send Password Reset Link'}
              </Button>

              {/* Demo Fill Buttons */}
              <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  ⚡ Quick Demo Fill:
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fillDemo('student')}
                  >
                    Student Demo
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fillDemo('admin')}
                  >
                    Admin Demo
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Bottom Switch Links */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
            {type === 'student-login' && (
              <>
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Sign up free
                </a>
                <div style={{ marginTop: '8px' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/admin/login'); }} style={{ color: 'var(--text-subtle)', fontSize: '0.8125rem' }}>
                    Switch to Admin Login →
                  </a>
                </div>
              </>
            )}

            {type === 'student-signup' && (
              <>
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Sign in
                </a>
              </>
            )}

            {type === 'admin-login' && (
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ← Return to Student Login
                </a>
              </>
            )}

            {type === 'forgot-password' && (
              <>
                Remember your password?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Sign in
                </a>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
