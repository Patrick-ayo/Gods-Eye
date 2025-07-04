import React, { useRef, useState, useEffect } from 'react';
import './login-otp.css';

export default function OtpVerification({ email = 'xyz@example.com', onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [disabled, setDisabled] = useState(true);
  const inputsRef = useRef([]);

  useEffect(() => {
    setDisabled(otp.some(val => val.length !== 1));
  }, [otp]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && otp[idx] === '' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputsRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.every(val => val.length === 1)) {
      if (otp.join('') === '123456') {
        alert('OTP verified successfully!');
        if (typeof onSuccess === 'function') onSuccess();
      } else {
        alert('Invalid OTP');
      }
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    alert('OTP resent to your email!');
    setOtp(['', '', '', '', '', '']);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="otp-bg">
      <div className="dot"></div>
      <div className="shape1"></div>
      <div className="shape2"></div>
      <div className="shape3"></div>
      <div className="bottom-shapes"></div>
      <div className="otp-container">
        <div className="otp-message">
          The OTP is sent on your <span className="email-highlight">{email}</span> mail
        </div>
        <form onSubmit={handleSubmit}>
          <div className="otp-section">
            <div className="otp-inputs">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="otp-input"
                  maxLength={1}
                  pattern="[0-9]"
                  value={val}
                  onChange={e => handleChange(e, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  ref={el => (inputsRef.current[idx] = el)}
                  required
                />
              ))}
            </div>
            <button type="submit" className="verify-button" disabled={disabled}>
              Verify OTP
            </button>
          </div>
        </form>
        <div className="resend-section">
          Didn't receive the code?{' '}
          <a href="#" className="resend-link" onClick={handleResend}>
            Resend OTP
          </a>
        </div>
      </div>
    </div>
  );
} 