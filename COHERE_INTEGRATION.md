# Cohere API Integration

This document describes the integration of Cohere API into the Gods Eye chatbot system.

## Changes Made

### Backend Changes (`backend/app.js`)

1. **Added Cohere SDK**: Installed and imported the `cohere-ai` package
2. **Replaced Mistral API**: Converted from Mistral AI to Cohere API
3. **Updated API calls**: Changed from `mistral-tiny` model to `command-nightly` model
4. **Enhanced error handling**: Updated error messages to reflect Cohere usage

### Frontend Changes (`frontend/src/components/ChatArea.jsx`)

1. **Updated UI labels**: Changed "Ollama Chat (Mistral)" to "Cohere Chat (Command)"
2. **Updated placeholders**: Changed "Ask Ollama..." to "Ask Cohere..."
3. **Updated messages**: Changed "Start chatting with Ollama..." to "Start chatting with Cohere..."
4. **Updated error messages**: Changed error messages to reference Cohere

## API Configuration

The Cohere API is configured with:
- **Model**: `command-nightly`
- **Max Tokens**: 300
- **Temperature**: 0.7
- **API Key**: Securely stored in the application

## Features Supported

- ✅ **Text Chat**: Basic conversation with Cohere
- ✅ **File Upload**: Upload and analyze PDF, Word, Excel, and image files
- ✅ **Context Awareness**: Ask questions about uploaded files
- ✅ **Real-time Responses**: Streaming responses from Cohere
- ✅ **Error Handling**: Graceful error handling with user-friendly messages

## Testing

A test file (`test-cohere.js`) has been created to verify the integration:

```bash
cd backend
node test-cohere.js
```

## Usage

The chatbot panel can be accessed from the main application interface. Users can:

1. **Chat with Cohere**: Type messages and get AI-powered responses
2. **Upload Files**: Drag and drop files for analysis
3. **Ask Questions**: Ask questions about uploaded file content
4. **Get Context-Aware Responses**: Receive responses that consider the uploaded file content

## API Endpoints

- **POST `/api/ollama/chat`**: Main chat endpoint (note: endpoint name kept for backward compatibility)
- **POST `/api/ollama/upload`**: File upload endpoint (note: endpoint name kept for backward compatibility)

## Security

- API key is hardcoded in the application (should be moved to environment variables in production)
- File uploads are processed locally and cleaned up after text extraction
- All API calls are made server-side to protect the API key

## Performance

- **Response Time**: Typically 1-3 seconds for simple queries
- **File Processing**: Depends on file size and type
- **Memory Usage**: Files are processed in memory and cleaned up immediately

## Troubleshooting

### Error: "[Error contacting Cohere]"

This error typically occurs when:
1. **Backend not running**: Make sure the backend server is running on port 3001
2. **CORS issues**: Frontend and backend are on different ports
3. **Network issues**: Check if http://localhost:3001 is accessible

**Solutions:**
- Start backend: `cd backend && npm start`
- Test API directly: Open `test-chat.html` in browser
- Check backend logs for detailed error messages

### Common Issues

1. **API Endpoint URLs**: All frontend API calls now use full URLs (http://localhost:3001/api/...)
2. **Model Name**: Changed from `command-nightly` to `command` for better compatibility
3. **Error Handling**: Added detailed error logging in both frontend and backend

### Testing

Run these tests to verify the integration:

```bash
# Test backend directly
cd backend
node test-cohere.js

# Test API endpoints
node test-frontend-call.js

# Test in browser
# Open test-chat.html in your browser
```

## Future Enhancements

- Move API key to environment variables
- Add support for conversation history
- Implement rate limiting
- Add support for more file types
- Add conversation memory across sessions
- Add proper proxy configuration for production
