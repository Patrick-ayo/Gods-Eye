const axios = require('axios');

async function testFrontendCall() {
  try {
    console.log('Testing frontend API call...');
    
    const response = await axios.post('http://localhost:3001/api/ollama/chat', {
      messages: [
        { role: 'user', content: 'Hello from the frontend test!' }
      ],
      fileId: null
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frontend API call successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Frontend API call failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFrontendCall();
