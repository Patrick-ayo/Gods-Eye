import React, { useState, useRef } from 'react';

export default function PhoneLogin({ onSuccess }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const recaptchaRef = useRef(null);

  const sendOtp = async (e) => {
    e.preventDefault();
    // Simulate sending OTP
    setStep('otp');
    alert('OTP sent!');
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp === '123456') {
      alert('Phone verified!');
      if (onSuccess) onSuccess();
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div>
      {step === 'phone' && (
        <form onSubmit={sendOtp}>
          <input
            type="tel"
            placeholder="Enter phone number (+1234567890)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <div id="recaptcha-container" ref={recaptchaRef}></div>
          <button type="submit">Send OTP</button>
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={verifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
} 