import "./App.css";
import React, { useState } from 'react';

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import DataPanel from "./components/DataPanel";
import Login from './components/Login';
import OtpVerification from './components/OtpVerification';

export default function App() {
  const [step, setStep] = useState('login');

  if (step === 'login') {
    return <Login onSuccess={() => setStep('otp')} />;
  }
  if (step === 'otp') {
    return <OtpVerification email="xyz@example.com" onSuccess={() => setStep('main')} />;
  }

  return (
    <PanelGroup direction="horizontal">
      <Panel minSize={20} defaultSize={25}>
        <Sidebar />
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={30} defaultSize={50}>
        <ChatArea />
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={20} defaultSize={25}>
        <DataPanel />
      </Panel>
    </PanelGroup>
  );
}
