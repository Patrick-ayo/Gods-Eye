import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import zoeIco from "../avatars/zoe.png";

import ChatHeader from "./ChatHeader";

const commands = ["/help", "/clear", "/ban", "/kick", "/invite"];
const users = ["@Shubham", "@Anjali", "@Devid", "@Patrick"];

function ChatArea() {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [messages, setMessages] = useState([
    { from: "joe", text: "Hello my friend" },
    { from: "joe", text: "Welcome to the server" },
  ]);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const lastWord = message.split(/\s+/).pop() || "";
    if (lastWord.startsWith("/")) {
      setSuggestions(commands.filter((c) => c.startsWith(lastWord)));
      setActiveIndex(0);
    } else if (lastWord.startsWith("@")) {
      setSuggestions(users.filter((u) => u.startsWith(lastWord)));
      setActiveIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [message]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const acceptSuggestion = (value) => {
    const parts = message.split(/\s+/);
    parts.pop();
    const newMessage = [...parts, value].join(" ") + " ";
    setMessage(newMessage);
    inputRef.current?.focus();
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        acceptSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { from: "me", text: message }]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 bg-white space-y-3">
        {messages.map((msg, idx) =>
          msg.from === "joe" ? (
            <div key={idx} className="flex items-start gap-2">
              <img src={zoeIco} alt="Joe" className="w-10 h-10 rounded-full" />
              <div className="bg-blue-100 text-black rounded-xl px-4 py-2 max-w-xs">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={idx} className="flex justify-end">
              <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs">
                {msg.text}
              </div>
            </div>
          )
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="relative p-4 border-t bg-white">
        {suggestions.length > 0 && (
          <ul className="absolute bottom-14 left-4 mb-2 w-60 bg-white border rounded-lg shadow-lg z-10 text-gray-900">
            {suggestions.map((s, i) => (
              <li
                key={s}
                className={`px-4 py-2 cursor-pointer ${
                  i === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onMouseDown={() => acceptSuggestion(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-gray-900"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-315" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
