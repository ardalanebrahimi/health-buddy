const axios = require("axios");

const API_BASE = "http://localhost:3000/api/v1";

async function testGoalsOnly() {
  console.log("🧪 Testing Goals Endpoint Only...");

  try {
    console.log("\n1️⃣ Testing Goals Update (PUT)");
    const goalsData = {
      weightGoalKg: 70,
      sleepHoursTarget: 8,
      painTarget: 2,
    };

    console.log("Sending data:", goalsData);

    const goalsResponse = await axios.put(`${API_BASE}/goals`, goalsData);
    console.log("✅ PUT /goals response:", {
      status: goalsResponse.status,
      data: goalsResponse.data,
    });
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    if (error.response?.data?.error?.details) {
      console.error("Validation details:", error.response.data.error.details);
    }
  }
}

testGoalsOnly();
