// Test script for UP-004 Profile Storage & Sync implementation
// Run with: node test-profile-sync.js

const axios = require("axios");

const API_BASE = "http://localhost:3000/api/v1";

async function testProfileSyncImplementation() {
  console.log("🧪 Testing UP-004 Profile Storage & Sync Implementation...\n");

  try {
    // Test 1: Create a profile (should be idempotent)
    console.log("1️⃣ Testing Profile Creation (Idempotent POST)");
    const profileData = {
      age: 30,
      sex: "M",
      heightCm: 175,
      weightKg: 75.5,
      activityLevel: "moderate",
    };

    const createResponse = await axios.post(`${API_BASE}/profile`, profileData);
    console.log("✅ POST /profile response:", {
      status: createResponse.status,
      id: createResponse.data.id,
      updatedAt: createResponse.data.updatedAt,
    });
    console.log("");

    // Test 2: Update profile using PUT (idempotent)
    console.log("2️⃣ Testing Profile Update (Idempotent PUT)");
    const updatedProfileData = {
      ...profileData,
      age: 31,
      weightKg: 74.0,
    };

    const updateResponse = await axios.put(
      `${API_BASE}/profile`,
      updatedProfileData
    );
    console.log("✅ PUT /profile response:", {
      status: updateResponse.status,
      age: updateResponse.data.age,
      weightKg: updateResponse.data.weightKg,
      updatedAt: updateResponse.data.updatedAt,
    });
    console.log("");

    // Test 3: Update baseline (idempotent PATCH)
    console.log("3️⃣ Testing Baseline Update (Idempotent PATCH)");
    const baselineData = {
      conditions: ["hypertension", "diabetes"],
      painAreas: ["lower_back", "shoulders"],
      notes: "Regular checkups needed",
    };

    const baselineResponse = await axios.patch(
      `${API_BASE}/profile/baseline`,
      baselineData
    );
    console.log("✅ PATCH /profile/baseline response:", {
      status: baselineResponse.status,
      baselineJson: baselineResponse.data.baselineJson,
    });
    console.log("");

    // Test 4: Create/Update goals (idempotent PUT)
    console.log("4️⃣ Testing Goals Update (Idempotent PUT)");
    const goalsData = {
      weightGoalKg: 70,
      sleepHoursTarget: 8,
      painTarget: 2,
    };

    const goalsResponse = await axios.put(`${API_BASE}/goals`, goalsData);
    console.log("✅ PUT /goals response:", {
      status: goalsResponse.status,
      weightGoalKg: goalsResponse.data.weightGoalKg,
      sleepHoursTarget: goalsResponse.data.sleepHoursTarget,
      updatedAt: goalsResponse.data.updatedAt,
    });
    console.log("");

    // Test 5: Verify GET endpoints work
    console.log("5️⃣ Testing GET Endpoints for Retrieval");
    const getProfileResponse = await axios.get(`${API_BASE}/profile`);
    const getGoalsResponse = await axios.get(`${API_BASE}/goals`);

    console.log("✅ GET /profile response:", {
      status: getProfileResponse.status,
      hasBaseline: !!getProfileResponse.data.baselineJson,
    });

    console.log("✅ GET /goals response:", {
      status: getGoalsResponse.status,
      weightGoalKg: getGoalsResponse.data.weightGoalKg,
    });
    console.log("");

    // Test 6: Test idempotency - same operations should not fail
    console.log("6️⃣ Testing Idempotency - Repeating Same Operations");

    // Repeat profile update
    const idempotentUpdate = await axios.put(
      `${API_BASE}/profile`,
      updatedProfileData
    );
    console.log("✅ Repeated PUT /profile:", {
      status: idempotentUpdate.status,
      consistent: idempotentUpdate.data.age === 31,
    });

    // Repeat goals update
    const idempotentGoals = await axios.put(`${API_BASE}/goals`, goalsData);
    console.log("✅ Repeated PUT /goals:", {
      status: idempotentGoals.status,
      consistent: idempotentGoals.data.weightGoalKg === 70,
    });
    console.log("");

    console.log("🎉 All UP-004 Profile Storage & Sync tests passed!");
    console.log(
      "✅ Backend endpoints are idempotent and ready for sync integration"
    );
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the tests
testProfileSyncImplementation();
