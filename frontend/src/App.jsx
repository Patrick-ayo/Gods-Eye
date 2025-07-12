import "./App.css";
import React, { useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import DataPanel from "./components/DataPanel";
import Login from "./components/Login";
import OtpVerification from "./components/OtpVerification";

export default function App() {
  const [step, setStep] = useState("login");
  const [userEmail, setUserEmail] = useState("");
  const [ollamaPanelOpen, setOllamaPanelOpen] = useState(false);

  if (step === "login") {
    return (
      <Login
        onSuccess={(email) => {
          setUserEmail(email);
          setStep("otp");
        }}
      />
    );
  }
  if (step === "otp") {
    return (
      <OtpVerification email={userEmail} onSuccess={() => setStep("main")} />
    );
  }

  return (
    <div className="h-screen overflow-hidden">
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
    </div>
  );
}
