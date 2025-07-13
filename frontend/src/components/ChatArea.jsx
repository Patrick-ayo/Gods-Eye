import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import zoeIco from "../avatars/zoe.png";

import ChatHeader from "./ChatHeader";

const commands = ["/help", "/clear", "/ban", "/kick", "/invite"];
const users = ["@Shubham", "@Anjali", "@Devid", "@Patrick"];

function ChatArea({ ollamaPanelOpen, setOllamaPanelOpen }) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [messages, setMessages] = useState([
    { from: "joe", text: "Hello my friend", id: 1 },
    { from: "joe", text: "Welcome to the server", id: 2 },
  ]);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [chatImagePreviews, setChatImagePreviews] = useState([]);
  const [chatPreviewFiles, setChatPreviewFiles] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [ollamaMessages, setOllamaMessages] = useState([]); // {role: 'user'|'assistant', content: string}
  const [ollamaInput, setOllamaInput] = useState("");
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [ollamaFileId, setOllamaFileId] = useState(null);
  const [ollamaFileName, setOllamaFileName] = useState(null);
  const [ollamaImagePreview, setOllamaImagePreview] = useState(null);
  const [ollamaPreviewFile, setOllamaPreviewFile] = useState(null);

  // Filtered messages for search
  const filteredMessages = searchTerm
    ? messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (ollamaPanelOpen) {
        // For Ollama chat - show preview only (single image)
        if (imageFiles.length > 0) {
          const file = imageFiles[0];
          const url = URL.createObjectURL(file);
          setOllamaImagePreview(url);
          setOllamaPreviewFile(file);
        }
      } else {
        // For main chat - show preview only (multiple images)
        if (imageFiles.length > 0) {
          const newPreviews = imageFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
          }));
          setChatImagePreviews((prev) => [...prev, ...newPreviews]);
          setChatPreviewFiles((prev) => [...prev, ...imageFiles]);
        }
      }
    }
  };

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
    if (message.trim() || chatPreviewFiles.length > 0) {
      if (chatPreviewFiles.length > 0) {
        // Send message with images
        const newMessage = {
          from: "me",
          text: message.trim() || "Images",
          images: chatImagePreviews.map((preview) => ({
            url: preview.url,
            fileName: preview.file.name,
            fileType: preview.file.type,
          })),
          id: Date.now() + Math.random(),
          replyTo: replyingTo,
        };
        setMessages((prev) => [...prev, newMessage]);
        // Clear preview after sending
        setChatImagePreviews([]);
        setChatPreviewFiles([]);
      } else {
        // Send text message only
        const newMessage = {
          from: "me",
          text: message,
          id: Date.now() + Math.random(),
          replyTo: replyingTo,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
      setMessage("");
      setReplyingTo(null);
    }
  };

  // Handle Ollama chat send
  const handleOllamaSend = async () => {
    if (!ollamaInput.trim() && !ollamaPreviewFile) return;

    // Handle file upload if there's a preview file
    if (ollamaPreviewFile) {
      await handleOllamaFileDrop(ollamaPreviewFile);
      // Clear preview after processing
      setOllamaImagePreview(null);
      setOllamaPreviewFile(null);
    }

    const newMsg = { role: "user", content: ollamaInput || "Image uploaded" };
    setOllamaMessages((prev) => [...prev, newMsg]);
    setOllamaInput("");
    setOllamaLoading(true);

    try {
      const res = await fetch("/api/ollama/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...ollamaMessages, newMsg],
          fileId: ollamaFileId,
        }),
      });
      const data = await res.json();
      setOllamaMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (e) {
      setOllamaMessages((prev) => [
        ...prev,
        { role: "assistant", content: "[Error contacting Ollama]" },
      ]);
    }
    setOllamaLoading(false);
  };

  // Handle reply to message
  const handleReply = (messageId) => {
    const messageToReply = messages.find((msg) => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageToReply);
      inputRef.current?.focus();
    }
  };

  // Remove image from preview
  const removeImagePreview = (imageId) => {
    setChatImagePreviews((prev) => prev.filter((img) => img.id !== imageId));
    setChatPreviewFiles((prev) => {
      const updatedFiles = [...prev];
      const indexToRemove = chatImagePreviews.findIndex(
        (img) => img.id === imageId
      );
      if (indexToRemove !== -1) {
        updatedFiles.splice(indexToRemove, 1);
      }
      return updatedFiles;
    });
  };

  // Handle file drop for Ollama
  const handleOllamaFileDrop = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setOllamaFileName(file.name);
    setOllamaFileId(null);

    try {
      const res = await fetch("/api/ollama/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setOllamaFileId(data.fileId);
    } catch (e) {
      setOllamaFileId(null);
      setOllamaFileName(null);
      setOllamaMessages((prev) => [
        ...prev,
        { role: "assistant", content: "[File upload failed]" },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader />
      {/* Ollama Left Bottom Panel */}
      {ollamaPanelOpen && (
        <div className="fixed bottom-0 left-0 h-1/2 w-1/4 min-w-80 bg-white shadow-2xl z-50 flex flex-col border-r border-t border-gray-200 rounded-tr-lg animate-slide-in">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50">
            <div className="font-semibold text-lg text-gray-800">
              Ollama Chat (Mistral)
            </div>
            <button
              onClick={() => setOllamaPanelOpen(false)}
              className="p-2 rounded hover:bg-gray-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          {/* Ollama Messages - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {ollamaFileName && (
              <div className="mb-2 text-xs text-blue-700">
                File for Q&A:{" "}
                <span className="font-semibold">{ollamaFileName}</span>
              </div>
            )}
            {ollamaMessages.length === 0 && (
              <div className="text-gray-400 text-center mt-10">
                Start chatting with Ollama...
              </div>
            )}
            {ollamaMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-xl px-4 py-2 max-w-xs ${
                    msg.role === "user"
                      ? "bg-blue-400 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {/* Ollama Fixed Input Area at Bottom */}
          <div className="border-t bg-white p-4">
            {/* Image Preview */}
            {ollamaImagePreview && (
              <div className="mb-3 relative">
                <img
                  src={ollamaImagePreview}
                  alt="Preview"
                  className="max-w-20 max-h-20 rounded-lg border border-gray-200 object-cover"
                />
                <button
                  onClick={() => {
                    setOllamaImagePreview(null);
                    setOllamaFileName(null);
                    setOllamaFileId(null);
                    setOllamaPreviewFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                >
                  ×
                </button>
              </div>
            )}
            <form
              className="flex gap-2 items-end"
              onSubmit={(e) => {
                e.preventDefault();
                handleOllamaSend();
              }}
            >
              <textarea
                placeholder="Ask Ollama..."
                value={ollamaInput}
                onChange={(e) => setOllamaInput(e.target.value)}
                disabled={ollamaLoading}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-gray-900 resize-none max-h-32 min-h-[2.5rem] overflow-y-auto"
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "2.5rem",
                  maxHeight: "8rem",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 128) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleOllamaSend();
                  }
                }}
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex-shrink-0"
                disabled={ollamaLoading}
              >
                <PaperAirplaneIcon className="h-5 w-5 rotate-315" />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Main Chat Area - Scrollable Messages */}
      <div className="flex-1 overflow-hidden">
        <div
          className={`h-full overflow-y-auto p-4 bg-white space-y-3 relative ${
            dragActive ? "ring-4 ring-blue-300" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag-and-drop overlay */}
          {dragActive && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-20 pointer-events-none rounded-lg">
              <span className="text-blue-700 text-lg font-semibold">
                Drop file to upload
              </span>
            </div>
          )}
          {/* Message List */}
          {filteredMessages.map((msg, idx) => {
            // If this message has a fileUrl, show a preview
            if (msg.fileUrl) {
              if (msg.fileType.startsWith("image/")) {
                // Image preview
                return (
                  <div key={idx} className="flex justify-end">
                    <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs flex flex-col items-end">
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName}
                        className="max-w-[200px] max-h-[150px] rounded mb-2"
                      />
                      <span className="text-xs text-white">{msg.fileName}</span>
                    </div>
                  </div>
                );
              } else if (msg.fileType === "application/pdf") {
                // PDF preview (embed first page if possible, else icon)
                return (
                  <div key={idx} className="flex justify-end">
                    <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs flex flex-col items-end">
                      <embed
                        src={msg.fileUrl}
                        type="application/pdf"
                        width="200"
                        height="150"
                        className="rounded mb-2"
                      />
                      <span className="text-xs text-white">{msg.fileName}</span>
                    </div>
                  </div>
                );
              } else if (
                msg.fileType ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                msg.fileType === "application/msword"
              ) {
                // Word doc preview (icon + filename)
                return (
                  <div key={idx} className="flex justify-end">
                    <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs flex flex-col items-end">
                      <span className="text-4xl mb-2">📄</span>
                      <span className="text-xs text-white">{msg.fileName}</span>
                    </div>
                  </div>
                );
              } else if (
                msg.fileType ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                msg.fileType === "application/vnd.ms-excel"
              ) {
                // Excel doc preview (icon + filename)
                return (
                  <div key={idx} className="flex justify-end">
                    <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs flex flex-col items-end">
                      <span className="text-4xl mb-2">📊</span>
                      <span className="text-xs text-white">{msg.fileName}</span>
                    </div>
                  </div>
                );
              } else {
                // Generic file preview (icon + filename)
                return (
                  <div key={idx} className="flex justify-end">
                    <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs flex flex-col items-end">
                      <span className="text-4xl mb-2">📎</span>
                      <span className="text-xs text-white">{msg.fileName}</span>
                    </div>
                  </div>
                );
              }
            }
            // Updated message rendering for joe/me with reply and image support
            return msg.from === "joe" ? (
              <div key={idx} className="flex items-start gap-2 group">
                <img
                  src={zoeIco}
                  alt="Joe"
                  className="w-10 h-10 rounded-full"
                />
                <div className="relative">
                  {msg.replyTo && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg text-sm text-gray-600 border-l-4 border-blue-400">
                      <span className="font-semibold">Replying to:</span>{" "}
                      {msg.replyTo.text}
                    </div>
                  )}
                  <div className="bg-blue-100 text-black rounded-xl px-4 py-2 max-w-xs">
                    {msg.text}
                  </div>
                  <button
                    onClick={() => handleReply(msg.id)}
                    className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <ArrowUturnLeftIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div key={idx} className="flex justify-end group">
                <div className="relative">
                  {msg.replyTo && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg text-sm text-gray-600 border-l-4 border-blue-400">
                      <span className="font-semibold">Replying to:</span>{" "}
                      {msg.replyTo.text}
                    </div>
                  )}
                  {msg.images ? (
                    <div className="max-w-xs">
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        {msg.images.map((image, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={image.url}
                            alt={image.fileName}
                            className="rounded-lg max-w-full h-auto object-cover"
                          />
                        ))}
                      </div>
                      {msg.text !== "Images" && (
                        <div className="bg-blue-400 text-white rounded-xl px-4 py-2">
                          {msg.text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-400 text-white rounded-xl px-4 py-2 max-w-xs">
                      {msg.text}
                    </div>
                  )}
                  <button
                    onClick={() => handleReply(msg.id)}
                    className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <ArrowUturnLeftIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="border-t bg-white p-4">
        {suggestions.length > 0 && (
          <ul className="absolute bottom-24 left-4 mb-2 w-60 bg-white border rounded-lg shadow-lg z-10 text-gray-900">
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

        {/* Reply Preview */}
        {replyingTo && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg border-l-4 border-blue-400">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Replying to:
                </span>
                <p className="text-sm text-gray-600">{replyingTo.text}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Image Preview for Main Chat */}
        {chatImagePreviews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {chatImagePreviews.map((preview) => (
              <div key={preview.id} className="relative">
                <img
                  src={preview.url}
                  alt="Preview"
                  className="max-w-20 max-h-20 rounded-lg border border-gray-200 object-cover"
                />
                <button
                  onClick={() => removeImagePreview(preview.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-gray-900 resize-none max-h-32 min-h-[2.5rem] overflow-y-auto"
            rows={1}
            style={{
              height: "auto",
              minHeight: "2.5rem",
              maxHeight: "8rem",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-315" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
