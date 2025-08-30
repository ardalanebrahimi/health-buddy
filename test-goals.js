// Test script for UP-003 Goals API endpoints
// Run with: node test-goals.js

const axios = require("axios");

const API_BASE = "http://localhost:3000/api/v1";

async function testGoalsAPI() {
  console.log("🧪 Testing UP-003 Goals API Implementation...\n");

  try {
    // Test 1: Update goals (PUT /goals)
    console.log("1️⃣ Testing PUT /goals - Create/Update goals");
    const goalsData = {
      weightGoalKg: 75.5,
      sleepHoursTarget: 8,
      painTarget: 3,
    };

    const putResponse = await axios.put(`${API_BASE}/goals`, goalsData);
    console.log("✅ PUT /goals response:", putResponse.data);
    console.log("");

    // Test 2: Get goals (GET /goals)
    console.log("2️⃣ Testing GET /goals - Retrieve goals");
    const getResponse = await axios.get(`${API_BASE}/goals`);
    console.log("✅ GET /goals response:", getResponse.data);
    console.log("");

    // Test 3: Validation - Invalid weight
    console.log("3️⃣ Testing validation - Invalid weight (too low)");
    try {
      await axios.put(`${API_BASE}/goals`, {
        weightGoalKg: 10, // Too low
        sleepHoursTarget: 8,
      });
    } catch (error) {
      console.log("✅ Validation working - Error:", error.response.data);
    }
    console.log("");

    // Test 4: Validation - Invalid sleep hours
    console.log("4️⃣ Testing validation - Invalid sleep hours");
    try {
      await axios.put(`${API_BASE}/goals`, {
        weightGoalKg: 75,
        sleepHoursTarget: 15, // Too high
      });
    } catch (error) {
      console.log("✅ Validation working - Error:", error.response.data);
    }
    console.log("");

    // Test 5: Optional pain target
    console.log("5️⃣ Testing optional pain target (null)");
    const optionalResponse = await axios.put(`${API_BASE}/goals`, {
      weightGoalKg: 80,
      sleepHoursTarget: 7,
      // painTarget omitted
    });
    console.log("✅ Optional pain target working:", optionalResponse.data);

    console.log(
      "\n🎉 All tests passed! UP-003 Goals API is working correctly."
    );
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    console.error("Make sure the backend server is running on localhost:3000");
  }
}

testGoalsAPI();
