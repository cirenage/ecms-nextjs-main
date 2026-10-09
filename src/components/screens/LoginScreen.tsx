import React, { useState } from 'react';
import { Lock, Mail, Shield, FileText, Clock, Scale, Eye, EyeOff, Globe, HelpCircle, UserCircle, LogIn, Headphones, ChevronDown } from 'lucide-react';
import { UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';

export const LoginScreen: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [help, setHelp] = useState(false);
  function selectRole(value: UserRole | '') { setRole(value); setEmail(value ? DEMO_USERS[value].email : ''); setPassword(value ? 'Demo@123' : ''); setError(''); }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!role || email.trim().toLowerCase() !== DEMO_USERS[role].email.toLowerCase() || password !== 'Demo@123') { setError('Select a demo role and use its email with password Demo@123.'); return; }
    onLogin(role);
  }
  return <main className="jsg-login-page">
    <div className="jsg-login-shell">
      <section className="jsg-login-brand" aria-label="Judicial Service of Ghana">
        <div className="jsg-login-brand-copy">
          <img className="jsg-login-logo" src="/jsg-logo.svg" alt="Judicial Service of Ghana" />
          <h1>Modern <span>Justice.</span><br />Stronger <span>Ghana.</span></h1>
          <div className="jsg-login-rule" />
          <p><strong>The Minimum Operational Judiciary Platform</strong><br />enables efficient electronic filing, case management,<br className="jsg-desktop-break" /> scheduling and real-time case tracking for<br className="jsg-desktop-break" /> specialised courts.</p>
        </div>
        <img className="jsg-login-courthouse" src="/login-courthouse.png" alt="Courthouse artwork from the proposed interface" />
        <div className="jsg-login-features">
          {[{ icon: Shield, label: <>Secure<br />Access</> }, { icon: FileText, label: <>Paperless<br />Filing</> }, { icon: Clock, label: <>Faster Case<br />Management</> }, { icon: Scale, label: <>Accountability &<br />Transparency</> }].map(({ icon: Icon, label }, i) => <div key={i}><span><Icon size={19} strokeWidth={1.6} /></span><p>{label}</p></div>)}
        </div>
      </section>
      <section className="jsg-login-right">
        <nav className="jsg-login-top" aria-label="Login help"><span><Globe size={15} />English <ChevronDown size={10} /></span><i /><button onClick={() => setHelp(!help)}><HelpCircle size={15} />Help</button></nav>
        <div className="jsg-login-card">
          <p className="jsg-login-welcome">Welcome Back!</p><h2>Sign in to your account</h2><p className="jsg-login-subtitle">Access your cases, filings and court activities securely.</p>
          {help && <p className="jsg-login-help" role="status">For this demonstration, select a role to fill its account details. The password is Demo@123. Account registration, password recovery and Ghana.gov ID are coming soon.</p>}
          {error && <p className="jsg-login-error" role="alert">{error}</p>}
          <form onSubmit={submit}>
            <label htmlFor="login-role">User Type / Role</label><div className="jsg-login-field"><UserCircle className="jsg-role-icon" size={21} /><select id="login-role" value={role} required onChange={e => selectRole(e.target.value as UserRole | '')}><option value="">Select your role</option>{Object.keys(DEMO_USERS).map(r => <option key={r} value={r}>{r.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}</select></div>
            <label htmlFor="login-email">Email Address</label><div className="jsg-login-field"><Mail size={17} /><input id="login-email" type="email" autoComplete="username" placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)} /></div>
            <label htmlFor="login-password">Password</label><div className="jsg-login-field"><Lock size={17} /><input id="login-password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <Eye size={16} /> : <EyeOff size={16} />}</button></div>
            <div className="jsg-login-options"><label><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />Remember me</label><button type="button" onClick={() => setHelp(true)}>Forgot Password?</button></div>
            <button type="submit" className="jsg-login-submit"><LogIn size={18} />Sign In</button>
          </form>
          <div className="jsg-login-divider"><span />OR<span /></div>
          <button className="jsg-login-sso" onClick={() => setHelp(true)}><Shield size={19} />Sign in with Ghana.gov. ID (Coming Soon)</button>
          <p className="jsg-login-register">New to the platform? <button onClick={() => setHelp(true)}>Register here</button></p>
        </div>
      </section>
      <footer className="jsg-login-footer"><div className="jsg-login-protection"><Shield size={25} /><p><strong>Your information is protected</strong><br /><span>Demo only · Fictional browser-local records</span></p></div><p>© {new Date().getFullYear()} Judicial Service of Ghana. All Rights Reserved.</p><div className="jsg-login-footer-links">{['Privacy Policy', 'Terms of Use', 'Security'].map(x => <button key={x} onClick={() => setHelp(true)}>{x}</button>)}</div><button className="jsg-login-support" onClick={() => setHelp(true)}><Headphones size={27} /><span><strong>Need Help?</strong><br />Contact System Administrator</span></button></footer>
    </div>
  </main>;
};
