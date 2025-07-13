const { CohereClient } = require("cohere-ai");

// Initialize Cohere API
const cohere = new CohereClient({
  token: 'vuMm9IF4r9PNUueAR3FsbD4iSxAfYUf9vECBPlGH',
});

async function testCohere() {
  try {
    console.log("Testing Cohere API integration...");
    
    const response = await cohere.chat({
      model: 'command-nightly',
      message: 'Hello, this is a test message from the Gods Eye chatbot!',
      maxTokens: 100,
      temperature: 0.7,
    });
    
    console.log("✅ Cohere API call successful!");
    console.log("Response:", response.text);
    
    // Test with context
    const contextResponse = await cohere.chat({
      model: 'command-nightly',
      message: '[File context: test.txt]\nThis is a test file content.\n\nUser: What does this file contain?',
      maxTokens: 100,
      temperature: 0.7,
    });
    
    console.log("✅ Context-aware response successful!");
    console.log("Context Response:", contextResponse.text);
    
  } catch (error) {
    console.error("❌ Cohere API call failed:", error.message);
    if (error.body) {
      console.error("Error body:", error.body);
    }
  }
}

testCohere();
