// BI-005 Mood/Energy Quick Log - Test Script
// This script tests the mood and energy endpoints

const BASE_URL = "http://localhost:3000/api/v1";

async function testMoodEnergyEndpoints() {
  console.log("🧪 Testing BI-005 Mood/Energy Quick Log endpoints...\n");

  // Test 1: Log Mood
  console.log("1. Testing POST /biometrics/mood");
  try {
    const moodResponse = await fetch(`${BASE_URL}/biometrics/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: "🙂",
        takenAt: new Date().toISOString(),
      }),
    });

    if (moodResponse.ok) {
      const moodData = await moodResponse.json();
      console.log("✅ Mood logged successfully:", moodData);
    } else {
      const error = await moodResponse.text();
      console.log("❌ Failed to log mood:", error);
    }
  } catch (error) {
    console.log("❌ Error logging mood:", error.message);
  }

  // Test 2: Log Energy
  console.log("\n2. Testing POST /biometrics/energy");
  try {
    const energyResponse = await fetch(`${BASE_URL}/biometrics/energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 7,
        takenAt: new Date().toISOString(),
      }),
    });

    if (energyResponse.ok) {
      const energyData = await energyResponse.json();
      console.log("✅ Energy logged successfully:", energyData);
    } else {
      const error = await energyResponse.text();
      console.log("❌ Failed to log energy:", error);
    }
  } catch (error) {
    console.log("❌ Error logging energy:", error.message);
  }

  // Test 3: Get Latest Mood
  console.log("\n3. Testing GET /biometrics/mood/latest");
  try {
    const latestMoodResponse = await fetch(
      `${BASE_URL}/biometrics/mood/latest`
    );

    if (latestMoodResponse.ok) {
      const latestMoodData = await latestMoodResponse.json();
      console.log("✅ Latest mood retrieved:", latestMoodData);
    } else {
      const error = await latestMoodResponse.text();
      console.log("❌ Failed to get latest mood:", error);
    }
  } catch (error) {
    console.log("❌ Error getting latest mood:", error.message);
  }

  // Test 4: Get Latest Energy
  console.log("\n4. Testing GET /biometrics/energy/latest");
  try {
    const latestEnergyResponse = await fetch(
      `${BASE_URL}/biometrics/energy/latest`
    );

    if (latestEnergyResponse.ok) {
      const latestEnergyData = await latestEnergyResponse.json();
      console.log("✅ Latest energy retrieved:", latestEnergyData);
    } else {
      const error = await latestEnergyResponse.text();
      console.log("❌ Failed to get latest energy:", error);
    }
  } catch (error) {
    console.log("❌ Error getting latest energy:", error.message);
  }

  // Test 5: Validation Tests
  console.log("\n5. Testing input validation");

  // Invalid mood
  try {
    const invalidMoodResponse = await fetch(`${BASE_URL}/biometrics/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: "🤮", // Not in allowed list
        takenAt: new Date().toISOString(),
      }),
    });

    if (!invalidMoodResponse.ok) {
      console.log("✅ Invalid mood properly rejected");
    } else {
      console.log("❌ Invalid mood was accepted (should be rejected)");
    }
  } catch (error) {
    console.log("❌ Error testing invalid mood:", error.message);
  }

  // Invalid energy score
  try {
    const invalidEnergyResponse = await fetch(`${BASE_URL}/biometrics/energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 15, // Out of range (1-10)
        takenAt: new Date().toISOString(),
      }),
    });

    if (!invalidEnergyResponse.ok) {
      console.log("✅ Invalid energy score properly rejected");
    } else {
      console.log("❌ Invalid energy score was accepted (should be rejected)");
    }
  } catch (error) {
    console.log("❌ Error testing invalid energy:", error.message);
  }

  console.log("\n🏁 BI-005 endpoint testing completed!");
}

// Run the test if this file is executed directly
if (typeof window === "undefined") {
  // Node.js environment
  const fetch = require("node-fetch");
  testMoodEnergyEndpoints();
} else {
  // Browser environment
  testMoodEnergyEndpoints();
}
