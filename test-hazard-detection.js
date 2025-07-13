// Test script for hazard detection API
const testHazardDetection = async () => {
  const testCases = [
    "Hello, how are you?",
    "The password is admin123",
    "API key: sk-1234567890abcdef",
    "Let's discuss the quarterly report",
    "Internal project codename: Project Phoenix",
    "Client database URI: mongodb://localhost:27017",
    "Meeting at 3 PM today",
    "HR file contains employee salaries",
    "Weather is nice today",
    "Database credentials: user=admin, pass=secret123"
  ];

  console.log("🧪 Testing Hazard Detection API...\n");

  for (const testMessage of testCases) {
    try {
      const response = await fetch("http://localhost:8000/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: testMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const status = data.result === "CONFIDENTIAL" ? "🔴 CONFIDENTIAL" : "🟢 SAFE";
        console.log(`${status} | "${testMessage}"`);
      } else {
        console.log(`❌ Error: ${response.status} | "${testMessage}"`);
      }
    } catch (error) {
      console.log(`❌ Network Error | "${testMessage}": ${error.message}`);
    }
  }

  console.log("\n✅ Test completed!");
};

// Run the test
testHazardDetection(); 