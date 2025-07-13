// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const xlsx = require("xlsx");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Initialize Simple USB Monitor
const SimpleUSBMonitor = require("./simple-usb-monitor");

const app = express();
const PORT = process.env.PORT || 3001;

const connectDB = require("./config/db");
connectDB();

const testInsertRoute = require("./routes/testInsert");
const imageRoutes = require("./routes/imageRoutes");
// const uploadRoutes = require("./routes/upload");

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory file text storage (for demo)
const fileTextStore = {};

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Helper: extract text from file
async function extractText(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    const data = fs.readFileSync(filePath);
    const pdfData = await pdfParse(data);
    return pdfData.text;
  } else if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    const data = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: data });
    return result.value;
  } else if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimetype === "application/vnd.ms-excel"
  ) {
    const workbook = xlsx.readFile(filePath);
    let text = "";
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      text += xlsx.utils.sheet_to_csv(sheet);
    });
    return text;
  } else if (mimetype.startsWith("image/")) {
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng");
    return text;
  } else {
    return "[Unsupported file type]";
  }
}

// File upload endpoint
app.post("/api/ollama/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const text = await extractText(file.path, file.mimetype);
    const fileId = uuidv4();
    fileTextStore[fileId] = { text, name: file.originalname };
    // Clean up uploaded file
    fs.unlinkSync(file.path);
    res.json({ fileId });
  } catch (e) {
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Ollama chat endpoint
app.post("/api/ollama/chat", async (req, res) => {
  try {
    const { messages, fileId } = req.body;
    let context = "";
    if (fileId && fileTextStore[fileId]) {
      context = `\n\n[File context: ${fileTextStore[fileId].name}]\n${fileTextStore[fileId].text}\n`;
    }
    // Compose prompt for Ollama
    const lastUserMsg = messages.filter((m) => m.role === "user").pop();
    const prompt = context
      ? `${context}\nUser: ${lastUserMsg.content}`
      : lastUserMsg.content;

    // Call Ollama (Mistral)
    // const ollamaRes = await axios.post(
    //   "http://localhost:11434/api/generate",
    //   {
    //     model: "mistral",
    //     prompt,
    //     stream: false,
    //   },
    //   {
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );
    // const data = ollamaRes.data;
    // res.json({ answer: data.response });

    const ollamaRes = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-tiny",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer sk-EL2JDIwD6Wvw19UCj4YX1D0HmitiU3Wp`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MISTRAL KEY: EL2JDIwD6Wvw19UCj4YX1D0HmitiU3Wp");

    const data = ollamaRes.data;
    res.json({ answer: data.choices[0].message.content });
  } catch (e) {
    console.error("❌ Ollama call failed:", e.message);
    if (e.response?.data) console.error("📄 Response body:", e.response.data);

    console.log("MISTRAL KEY: EL2JDIwD6Wvw19UCj4YX1D0HmitiU3Wp");

    console.log("🔑 API KEY:", process.env.MISTRAL_API_KEY);
    res.status(500).json({ error: "Failed to contact Ollama" });
  }
});

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Gods Eye Backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/image", imageRoutes);
// app.use("/api", uploadRoutes);

app.get("/api/dbtest", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    res.json({ connected: true, collections });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

app.get("/api/status", (req, res) => {
  res.json({
    app: "Gods Eye",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/security", require("./routes/securityRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Gods Eye Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Status: http://localhost:${PORT}/api/status`);

  // Initialize and start USB monitoring
  try {
    const usbMonitor = new SimpleUSBMonitor({
      checkInterval: 1000, // Check every 1 second
      autoShutdown: true,
    });

    await usbMonitor.startMonitoring();
    console.log("🔒 USB Security Monitor initialized and active");

    // Handle USB storage detection
    usbMonitor.on("usbStorageDetected", (drive) => {
      console.log("🚨 USB STORAGE DETECTED - SHUTTING DOWN APPLICATION!");
      console.log("❌ Security violation: USB storage device connected");
      console.log(
        `   Drive: ${drive.DeviceID}, Size: ${
          drive.Size
            ? Math.round((drive.Size / 1024 / 1024 / 1024) * 100) / 100 + " GB"
            : "Unknown"
        }`
      );

      // Shutdown the application
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });
  } catch (error) {
    console.error("❌ Failed to initialize USB Monitor:", error.message);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

app.use("/api/test", testInsertRoute);

module.exports = app;
