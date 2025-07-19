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
  const [replyingTo, setReplyingTo] = useState(null);
  const [ollamaMessages, setOllamaMessages] = useState([]); // {role: 'user'|'assistant', content: string}
  const [ollamaInput, setOllamaInput] = useState("");
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [ollamaFileId, setOllamaFileId] = useState(null);
  const [ollamaFileName, setOllamaFileName] = useState(null);
  const [ollamaImagePreview, setOllamaImagePreview] = useState(null);
  const [ollamaPreviewFile, setOllamaPreviewFile] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentMessageImages, setCurrentMessageImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [enlargedDocument, setEnlargedDocument] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState(false);
  
  // Hazard detection state
  const [isConfidential, setIsConfidential] = useState(false);
  const [hazardDetectionLoading, setHazardDetectionLoading] = useState(false);
  const [hazardDetectionTimeout, setHazardDetectionTimeout] = useState(null);

  // Filtered messages for search
  const filteredMessages = searchTerm
    ? messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  // Real-time hazard detection function
  const detectHazard = async (text) => {
    if (!text.trim()) {
      setIsConfidential(false);
      return;
    }

    try {
      setHazardDetectionLoading(true);
      const response = await fetch("http://localhost:8000/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Treat anything except 'SAFE' as confidential (strict policy)
        setIsConfidential(data.result !== "SAFE");
      } else {
        console.error("Hazard detection failed:", response.status);
        setIsConfidential(true); // Strict: treat as confidential on error
      }
    } catch (error) {
      console.error("Error detecting hazard:", error);
      setIsConfidential(true); // Strict: treat as confidential on error
    } finally {
      setHazardDetectionLoading(false);
    }
  };

  // Debounced hazard detection while typing
  useEffect(() => {
    if (hazardDetectionTimeout) {
      clearTimeout(hazardDetectionTimeout);
    }

    const timeout = setTimeout(() => {
      detectHazard(message);
    }, 1000); // 1 second delay

    setHazardDetectionTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [message]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hazardDetectionTimeout) {
        clearTimeout(hazardDetectionTimeout);
      }
    };
  }, [hazardDetectionTimeout]);

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
      const documentFiles = files.filter((file) => 
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "text/plain" ||
        file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.type === "application/vnd.ms-powerpoint"
      );

      if (ollamaPanelOpen) {
        // For Cohere chat - show preview only (single image)
        if (imageFiles.length > 0) {
          const file = imageFiles[0];
          const url = URL.createObjectURL(file);
          setOllamaImagePreview(url);
          setOllamaPreviewFile(file);
        }
      } else {
        // For main chat - show preview in message input area
        if (imageFiles.length > 0) {
          const newPreviews = imageFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
          }));
          setImagePreviews(newPreviews);
          setImageFiles(imageFiles);
        }
        
        // Handle document files
        if (documentFiles.length > 0) {
          const newDocPreviews = documentFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
            fileName: file.name,
            fileType: file.type,
          }));
          setDocumentPreviews(newDocPreviews);
          setDocumentFiles(documentFiles);
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
    if (message.trim() || imageFiles.length > 0 || documentFiles.length > 0) {
      const newMessage = {
        from: "me",
        text: message.trim() || (imageFiles.length > 0 || documentFiles.length > 0 ? "" : ""),
        id: Date.now() + Math.random(),
        replyTo: replyingTo,
        isConfidential: isConfidential,
      };
      
      // Add images if they exist
      if (imageFiles.length > 0) {
        newMessage.images = imagePreviews.map((preview) => ({
          url: preview.url,
          fileName: preview.file.name,
          fileType: preview.file.type,
        }));
      }
      
      // Add documents if they exist
      if (documentFiles.length > 0) {
        newMessage.documents = documentPreviews.map((preview) => ({
          url: preview.url,
          fileName: preview.fileName,
          fileType: preview.fileType,
        }));
      }
      
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setReplyingTo(null);
      setIsConfidential(false);
      
      // Clear previews after sending
      setImagePreviews([]);
      setImageFiles([]);
      setDocumentPreviews([]);
      setDocumentFiles([]);
    }
  };

  // Handle Cohere chat send
  const handleOllamaSend = async () => {
    if (!ollamaInput.trim() && !ollamaPreviewFile) return;

    let userMessage = ollamaInput || "";
    let imageAnalysis = null;

    // Handle image analysis if there's a preview file
    if (ollamaPreviewFile) {
      setOllamaLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", ollamaPreviewFile);
        
        const analysisRes = await fetch("http://localhost:3001/api/ollama/analyze-image", {
          method: "POST",
          body: formData,
        });
        
        if (analysisRes.ok) {
          const analysisData = await analysisRes.json();
          imageAnalysis = analysisData;
          
          // If user didn't provide text, use the analysis
          if (!ollamaInput.trim()) {
            userMessage = `Please analyze this image: ${ollamaPreviewFile.name}`;
          }
        }
      } catch (e) {
        console.error("Image analysis failed:", e);
        setOllamaMessages((prev) => [
          ...prev,
          { role: "assistant", content: `[Image analysis failed: ${e.message}]` },
        ]);
        setOllamaLoading(false);
        return;
      }
      
      // Clear preview after processing
      setOllamaImagePreview(null);
      setOllamaPreviewFile(null);
    }

    const newMsg = { 
      role: "user", 
      content: userMessage,
      imageAnalysis: imageAnalysis
    };
    setOllamaMessages((prev) => [...prev, newMsg]);
    setOllamaInput("");
    setOllamaLoading(true);

    try {
      let chatPrompt = userMessage;
      
      // If we have image analysis, include it in the prompt
      if (imageAnalysis) {
        chatPrompt = `${userMessage}\n\nImage Analysis: ${imageAnalysis.analysis}\n\nExtracted Text: ${imageAnalysis.extractedText}`;
      }
      
      const res = await fetch("http://localhost:3001/api/ollama/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...ollamaMessages.map(msg => ({ role: msg.role, content: msg.content })), { role: "user", content: chatPrompt }],
          fileId: ollamaFileId,
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setOllamaMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (e) {
      console.error("Error calling Cohere API:", e);
      setOllamaMessages((prev) => [
        ...prev,
        { role: "assistant", content: `[Error contacting Cohere: ${e.message}]` },
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
  const removeImageFromPreview = (imageId) => {
    setImagePreviews((prev) => prev.filter((img) => img.id !== imageId));
    setImageFiles((prev) => {
      const indexToRemove = imagePreviews.findIndex((img) => img.id === imageId);
      if (indexToRemove !== -1) {
        const newFiles = [...prev];
        newFiles.splice(indexToRemove, 1);
        return newFiles;
      }
      return prev;
    });
  };

  // Remove document from preview
  const removeDocumentFromPreview = (documentId) => {
    setDocumentPreviews((prev) => prev.filter((doc) => doc.id !== documentId));
    setDocumentFiles((prev) => {
      const indexToRemove = documentPreviews.findIndex((doc) => doc.id === documentId);
      if (indexToRemove !== -1) {
        const newFiles = [...prev];
        newFiles.splice(indexToRemove, 1);
        return newFiles;
      }
      return prev;
    });
  };

  // Handle image enlargement
  const handleImageClick = (imageSrc, messageImages = []) => {
    setImageLoading(true);
    setImageError(false);
    setEnlargedImage(imageSrc);
    setCurrentMessageImages(messageImages);
    setCurrentImageIndex(messageImages.findIndex(img => img === imageSrc));
    setIsImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setEnlargedImage(null);
    setCurrentMessageImages([]);
    setCurrentImageIndex(0);
    setImageLoading(false);
    setImageError(false);
  };

  // Navigate to next image
  const nextImage = () => {
    if (currentMessageImages.length > 0 && currentImageIndex < currentMessageImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setEnlargedImage(currentMessageImages[nextIndex]);
      setImageLoading(true);
      setImageError(false);
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    if (currentMessageImages.length > 0 && currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setEnlargedImage(currentMessageImages[prevIndex]);
      setImageLoading(true);
      setImageError(false);
    }
  };

  const closeDocumentModal = () => {
    setIsDocumentModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDocumentClick = (documentUrl, fileName, fileType) => {
    setSelectedDocument({ url: documentUrl, fileName, fileType });
    setIsDocumentModalOpen(true);
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return '📄';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      return '📝';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel') {
      return '📊';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileType === 'application/vnd.ms-powerpoint') {
      return '📽️';
    } else if (fileType === 'text/plain') {
      return '📄';
    } else {
      return '📁';
    }
  };

  // Get file extension from filename
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toUpperCase();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isImageModalOpen) {
        if (e.key === 'Escape') {
          closeImageModal();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, currentImageIndex, currentMessageImages]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isImageModalOpen) {
          closeImageModal();
        } else if (isDocumentModalOpen) {
          closeDocumentModal();
        }
      }
    };
    
    if (isImageModalOpen || isDocumentModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isImageModalOpen, isDocumentModalOpen]);

  // Handle file drop for Cohere
  const handleOllamaFileDrop = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setOllamaFileName(file.name);
    setOllamaFileId(null);

    try {
      const res = await fetch("http://localhost:3001/api/ollama/upload", {
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
      {/* Cohere Left Bottom Panel */}
      {ollamaPanelOpen && (
        <div className="fixed bottom-0 left-0 h-1/2 w-1/4 min-w-80 bg-white shadow-2xl z-50 flex flex-col border-r border-t border-gray-200 rounded-tr-lg animate-slide-in">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50">
            <div className="font-semibold text-lg text-gray-800">
              Cohere Chat (Command)
            </div>
            <button
              onClick={() => setOllamaPanelOpen(false)}
              className="p-2 rounded hover:bg-gray-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          {/* Cohere Messages - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {ollamaFileName && (
              <div className="mb-2 text-xs text-blue-700">
                File for Q&A:{" "}
                <span className="font-semibold">{ollamaFileName}</span>
              </div>
            )}
            {ollamaMessages.length === 0 && (
              <div className="text-gray-400 text-center mt-10">
                Start chatting with Cohere...
              </div>
            )}
            {ollamaMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-xs">
                  {/* Show image analysis if available */}
                  {msg.imageAnalysis && (
                    <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      <div className="font-semibold text-blue-800 mb-1">📸 Image: {msg.imageAnalysis.filename}</div>
                      {msg.imageAnalysis.extractedText && (
                        <div className="text-gray-600 mb-2">
                          <strong>Extracted text:</strong> {msg.imageAnalysis.extractedText}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-400 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Cohere Fixed Input Area at Bottom */}
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
                placeholder="Ask Cohere..."
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
                {ollamaLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5 rotate-315" />
                )}
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
                  {msg.isConfidential && (
                    <div className="mb-1 text-xs text-red-600 font-semibold flex items-center gap-1">
                      ⚠️ This message is confidential
                    </div>
                  )}
                  <div className={`rounded-xl px-4 py-2 max-w-xs ${
                    msg.isConfidential 
                      ? "bg-red-100 text-red-900 border-2 border-red-300" 
                      : "bg-blue-100 text-black"
                  }`}>
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
                  {msg.isConfidential && (
                    <div className="mb-1 text-xs text-red-600 font-semibold flex items-center gap-1 justify-end">
                      ⚠️ This message is confidential
                    </div>
                  )}
                  {msg.images ? (
                    <div className="max-w-xs">
                      {/* WhatsApp-like image container */}
                      <div className="bg-white rounded-lg shadow-md p-1 mb-2">
                        <div className="grid grid-cols-2 gap-1">
                          {msg.images.map((image, imgIdx) => (
                            <div key={imgIdx} className="relative">
                              <img
                                src={image.url}
                                alt={image.fileName}
                                className="rounded-lg w-full h-32 object-cover cursor-pointer hover:opacity-80 transition"
                                onClick={() => handleImageClick(image.url, msg.images.map(img => img.url))}
                              />
                              {/* Optional: Add image count overlay for multiple images */}
                              {msg.images.length > 1 && imgIdx === 0 && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                  {msg.images.length}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {/* Caption below images */}
                        {msg.text !== "Images" && msg.text && (
                          <div className="px-2 py-1 text-gray-700 text-sm">
                            {msg.text}
                          </div>
                        )}
                        {/* WhatsApp-like timestamp */}
                        <div className="flex justify-end px-2 pb-1">
                          <span className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : msg.documents ? (
                    <div className="max-w-xs">
                      {/* Document container */}
                      <div className="bg-white rounded-lg shadow-md p-3 mb-2">
                        <div className="space-y-2">
                          {msg.documents.map((document, docIdx) => (
                            <div key={docIdx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onClick={() => handleDocumentClick(document.url, document.fileName, document.fileType)}>
                              <div className="text-2xl">
                                {getFileIcon(document.fileType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {document.fileName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {getFileExtension(document.fileName)} • {document.fileType.split('/').pop()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Caption below documents */}
                        {msg.text && (
                          <div className="px-2 py-1 text-gray-700 text-sm mt-2">
                            {msg.text}
                          </div>
                        )}
                        {/* WhatsApp-like timestamp */}
                        <div className="flex justify-end px-2 pb-1">
                          <span className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-xl px-4 py-2 max-w-xs relative ${
                      msg.isConfidential 
                        ? "bg-red-500 text-white border-2 border-red-600" 
                        : "bg-blue-400 text-white"
                    }`}>
                      {msg.text}
                      {/* WhatsApp-like timestamp */}
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-blue-100">
                          {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
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

        {/* Image Preview in Message Input */}
        {imagePreviews.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">Images to send:</div>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview) => (
                <div key={preview.id} className="relative">
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleImageClick(preview.url)}
                  />
                  <button
                    onClick={() => removeImageFromPreview(preview.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Preview in Message Input */}
        {documentPreviews.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">Documents to send:</div>
            <div className="flex flex-wrap gap-2">
              {documentPreviews.map((preview) => (
                <div key={preview.id} className="relative">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition">
                    <div className="text-2xl mb-1">
                      {getFileIcon(preview.fileType)}
                    </div>
                    <div className="text-xs text-gray-600 text-center truncate max-w-full">
                      {getFileExtension(preview.fileName)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocumentFromPreview(preview.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Hazard Detection Indicator */}
        {message.trim() && (
          <div className="mb-3 flex items-center gap-2">
            {hazardDetectionLoading ? (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Analyzing message...
              </div>
            ) : isConfidential ? (
              <div className="text-sm text-red-600 font-semibold flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                ⚠️ This message is confidential
              </div>
            ) : (
              <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                ✓ Message is safe
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none text-gray-900 resize-none max-h-32 min-h-[2.5rem] overflow-y-auto transition-all ${
              dragActive ? 'border-blue-400 bg-blue-50' : isConfidential 
                ? "border-red-500 focus:border-red-600 bg-red-50" 
                : "border-gray-300 focus:border-blue-500"
            }`}
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
            className={`p-2 text-white rounded-lg transition flex-shrink-0 ${
              isConfidential 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-315" />
          </button>
        </div>
      </div>

      {/* Image Enlargement Modal */}
      {isImageModalOpen && enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {/* Loading indicator */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Error state */}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg text-white">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-lg">Failed to load image</p>
                <button 
                  onClick={closeImageModal}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Close
                </button>
              </div>
            )}
            
            {/* Main image */}
            <img
              src={enlargedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
              style={{ display: imageLoading || imageError ? 'none' : 'block' }}
            />
            
            {/* Navigation buttons */}
            {currentMessageImages.length > 1 && !imageLoading && !imageError && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-opacity-70 transition"
                  disabled={currentImageIndex === 0}
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-opacity-70 transition"
                  disabled={currentImageIndex === currentMessageImages.length - 1}
                >
                  ›
                </button>
              </>
            )}
            
            {/* Image counter */}
            {currentMessageImages.length > 1 && !imageLoading && !imageError && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {currentMessageImages.length}
              </div>
            )}
            
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-opacity-70 transition"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {isDocumentModalOpen && selectedDocument && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeDocumentModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-4">
                {getFileIcon(selectedDocument.fileType)}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {selectedDocument.fileName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {getFileExtension(selectedDocument.fileName)} • {selectedDocument.fileType}
              </p>
              <div className="flex gap-3">
                <a
                  href={selectedDocument.url}
                  download={selectedDocument.fileName}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Download
                </a>
                <button
                  onClick={closeDocumentModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
            <button
              onClick={closeDocumentModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-opacity-70 transition"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatArea;
