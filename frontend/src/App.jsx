import "./App.css";
import React, { useState, useEffect } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import DataPanel from "./components/DataPanel";
import Login from "./components/Login";
import OtpVerification from "./components/OtpVerification";
import SystemStatusWidget from "./components/SystemStatusWidget";

export default function App() {
  const [step, setStep] = useState(() => {
    // Check if user is already authenticated
    const savedSession = localStorage.getItem('gods-eye-session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session.isAuthenticated && Date.now() - session.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
        return "main";
      }
    }
    return "login";
  });
  const [userEmail, setUserEmail] = useState(() => {
    const savedSession = localStorage.getItem('gods-eye-session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      return session.email || "";
    }
    return "";
  });
  const [ollamaPanelOpen, setOllamaPanelOpen] = useState(false);
  
  // Save session when user completes authentication
  const saveSession = (email) => {
    const session = {
      isAuthenticated: true,
      email: email,
      timestamp: Date.now()
    };
    localStorage.setItem('gods-eye-session', JSON.stringify(session));
  };

  if (step === "login") {
    return (
      <>
        <Login
          onSuccess={(email) => {
            setUserEmail(email);
            saveSession(email);
            setStep("otp");
          }}
        />
        <SystemStatusWidget />
      </>
    );
  }
  if (step === "otp") {
    return (
      <>
        <OtpVerification email={userEmail} onSuccess={() => setStep("main")} />
        <SystemStatusWidget />
      </>
    );
  }

  return (
    <>
      <div className="h-screen overflow-hidden relative">
        <PanelGroup direction="horizontal">
          <Panel minSize={20} defaultSize={25}>
            <Sidebar onOllamaOpen={() => setOllamaPanelOpen(true)} />
          </Panel>
          <PanelResizeHandle />
          <Panel minSize={30} defaultSize={50}>
            <ChatArea
              ollamaPanelOpen={ollamaPanelOpen}
              setOllamaPanelOpen={setOllamaPanelOpen}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel minSize={20} defaultSize={25}>
            <DataPanel />
          </Panel>
        </PanelGroup>
        <SystemStatusWidget />
      </div>
    </>
  );
}
