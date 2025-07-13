# 🔐 Real-time Hazard Detection Integration

This document describes the real-time hazard detection system integrated into the Gods-Eye chat application.

## 🚀 Features

### ✅ Real-time Detection While Typing
- **Debounced Analysis**: Messages are analyzed 1 second after the user stops typing
- **Live Feedback**: Visual indicators show whether the current message is safe or confidential
- **Loading States**: Shows "Analyzing message..." while detection is in progress

### 🔴 Confidential Message Handling
- **Red Alert Rendering**: Confidential messages appear in red with warning borders
- **Warning Tags**: "⚠️ This message is confidential" tags on flagged messages
- **Visual Distinction**: Different styling for confidential vs safe messages

### 🎯 Detection Categories
The system detects confidential information including:
- Internal passwords and API keys
- Database URIs and credentials
- Project codenames and internal tools
- Company finances and employee data
- Client lists and HR files
- NDA violations and internal policies

## 🛠️ Technical Implementation

### Backend API Endpoints

#### `/detect` (POST)
- **Purpose**: Real-time hazard detection while typing
- **Input**: `{ "message": "text to analyze" }`
- **Output**: `{ "result": "SAFE" | "CONFIDENTIAL" }`
- **Usage**: Called automatically while user types

#### `/check-hazard` (POST)
- **Purpose**: Full hazard detection with logging
- **Input**: `{ "message": "text", "sender": "user" }`
- **Output**: `{ "result": "SAFE" | "CONFIDENTIAL" }`
- **Usage**: Logs confidential messages to MongoDB

### Frontend Integration

#### State Management
```javascript
const [isConfidential, setIsConfidential] = useState(false);
const [hazardDetectionLoading, setHazardDetectionLoading] = useState(false);
const [hazardDetectionTimeout, setHazardDetectionTimeout] = useState(null);
```

#### Real-time Detection
- Debounced API calls (1-second delay)
- Automatic cleanup of timeouts
- Error handling for network issues

#### Visual Indicators
- **Input Area**: Red border and background for confidential messages
- **Send Button**: Red color when message is confidential
- **Status Indicator**: Shows "Analyzing...", "⚠️ Confidential", or "✓ Safe"
- **Chat Messages**: Red styling with warning tags for confidential messages

## 🧪 Testing

### Manual Testing
1. Start the backend server: `cd ml-fraud-detection && python app.py`
2. Start the frontend: `cd frontend && npm run dev`
3. Type confidential content (e.g., "password", "API key", "internal project")
4. Observe real-time detection and visual feedback

### Automated Testing
Run the test script to verify API functionality:
```bash
node test-hazard-detection.js
```

### Test Cases
- ✅ Safe: "Hello, how are you?"
- 🔴 Confidential: "The password is admin123"
- 🔴 Confidential: "API key: sk-1234567890abcdef"
- ✅ Safe: "Meeting at 3 PM today"
- 🔴 Confidential: "Internal project codename: Project Phoenix"

## 🔧 Configuration

### Backend Setup
1. Install dependencies: `pip install fastapi uvicorn ollama pymongo python-dotenv`
2. Ensure Ollama is running with Mistral model
3. Set up MongoDB connection (optional for logging)
4. Start server: `uvicorn app:app --reload --port 8000`

### Frontend Setup
1. No additional dependencies required
2. API calls automatically handle CORS
3. Error handling for offline detection service

## 🎨 UI/UX Features

### Real-time Feedback
- **Loading Spinner**: Animated indicator during analysis
- **Color Coding**: Green for safe, red for confidential
- **Warning Icons**: ⚠️ for confidential, ✓ for safe
- **Smooth Transitions**: CSS transitions for state changes

### Message Styling
- **Safe Messages**: Blue background (existing design)
- **Confidential Messages**: Red background with borders
- **Warning Tags**: Prominent display above confidential messages
- **Consistent Layout**: Maintains existing chat bubble design

## 🔒 Security Considerations

### Data Privacy
- Messages are analyzed locally via Ollama/Mistral
- No message content is stored permanently (except logged confidential messages)
- API responses are immediate and don't persist

### Error Handling
- Graceful degradation when detection service is unavailable
- Network error handling with user feedback
- Timeout management to prevent memory leaks

## 🚀 Future Enhancements

### Potential Improvements
- **Custom Detection Rules**: User-defined confidential keywords
- **Message Encryption**: End-to-end encryption for confidential messages
- **Audit Logging**: Detailed logs of detection events
- **Machine Learning**: Improved detection accuracy over time
- **Integration**: Connect with existing security systems

### Performance Optimizations
- **Caching**: Cache common detection results
- **Batch Processing**: Analyze multiple messages simultaneously
- **Offline Mode**: Local detection when API is unavailable

## 📝 API Documentation

### Request Format
```json
{
  "message": "Text to analyze for confidential content"
}
```

### Response Format
```json
{
  "result": "SAFE" | "CONFIDENTIAL"
}
```

### Error Responses
```json
{
  "error": "Error message",
  "status": "ERROR"
}
```

## 🔗 Dependencies

### Backend
- FastAPI
- Ollama (with Mistral model)
- PyMongo (optional)
- Python-dotenv

### Frontend
- React (existing)
- No additional dependencies

## 📞 Support

For issues or questions about the hazard detection system:
1. Check the console for error messages
2. Verify Ollama is running with Mistral model
3. Test API connectivity with the test script
4. Review the backend logs for detailed error information 