import React, { useState, useRef } from 'react';
import './login-otp.css';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let captcha = '';
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const captchaInputRef = useRef(null);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    captchaInputRef.current && captchaInputRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captcha !== captchaInput.toUpperCase()) {
      alert('CAPTCHA verification failed. Please try again.');
      refreshCaptcha();
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      const data = await response.json();
      if (data.success) {
        onSuccess();
      } else {
        alert(data.message || 'Access denied.');
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="dot"></div>
      <div className="shape1"></div>
      <div className="shape2"></div>
      <div className="shape3"></div>
      <div className="login-container">
        <h1 className="login-title">login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div className="captcha-container">
              <div className="captcha-text">{captcha}</div>
              <button type="button" className="captcha-refresh" onClick={refreshCaptcha}>↻</button>
            </div>
            <input
              type="text"
              className="captcha-input"
              placeholder="Enter CAPTCHA"
              value={captchaInput}
              onChange={e => setCaptchaInput(e.target.value)}
              ref={captchaInputRef}
              required
            />
          </div>
          <button type="submit" className="login-button">login</button>
        </form>
      </div>
    </div>
  );
} 