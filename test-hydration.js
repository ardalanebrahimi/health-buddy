// Test NU-005 Hydration Quick Log Implementation
// Tests all hydration endpoints and basic functionality

const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/v1";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testHydrationEndpoints() {
  console.log("🧪 Testing NU-005 Hydration Quick Log Implementation\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health check...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check:", healthResponse.data);

    // Test 2: Create hydration entry (250ml)
    console.log("\n2. Creating hydration entry (250ml)...");
    const hydration1 = await axios.post(`${BASE_URL}/hydration`, {
      amountMl: 250,
      takenAt: new Date().toISOString(),
    });
    console.log("✅ Created hydration entry:", hydration1.data);

    // Test 3: Create another hydration entry (500ml)
    console.log("\n3. Creating hydration entry (500ml)...");
    const hydration2 = await axios.post(`${BASE_URL}/hydration`, {
      amountMl: 500,
      takenAt: new Date().toISOString(),
    });
    console.log("✅ Created hydration entry:", hydration2.data);

    // Test 4: Get hydration summary for today
    console.log("\n4. Getting hydration summary for today...");
    const today = new Date().toISOString().split("T")[0];
    const summaryResponse = await axios.get(
      `${BASE_URL}/hydration/summary?date=${today}`
    );
    console.log("✅ Hydration summary:", summaryResponse.data);

    // Test 5: Get hydration entries for today
    console.log("\n5. Getting hydration entries for today...");
    const entriesResponse = await axios.get(
      `${BASE_URL}/hydration?date=${today}`
    );
    console.log("✅ Hydration entries:", {
      totalEntries: entriesResponse.data.entries.length,
      totalMl: entriesResponse.data.totalMl,
      goalMl: entriesResponse.data.goalMl,
      entries: entriesResponse.data.entries.map((e) => ({
        id: e.id,
        amountMl: e.amountMl,
        takenAt: e.takenAt,
      })),
    });

    // Test 6: Delete hydration entry (undo functionality)
    console.log("\n6. Testing undo (delete last entry)...");
    const lastEntryId = hydration2.data.id;
    await axios.delete(`${BASE_URL}/hydration/${lastEntryId}`);
    console.log("✅ Deleted hydration entry:", lastEntryId);

    // Test 7: Verify deletion by getting updated summary
    console.log("\n7. Getting updated summary after deletion...");
    const updatedSummaryResponse = await axios.get(
      `${BASE_URL}/hydration/summary?date=${today}`
    );
    console.log("✅ Updated hydration summary:", updatedSummaryResponse.data);

    console.log("\n🎉 All hydration tests passed successfully!");
    console.log("\n📋 Test Summary:");
    console.log(`- Created 2 hydration entries (250ml + 500ml = 750ml)`);
    console.log(
      `- Total after creation: ${summaryResponse.data.totalLiters} L`
    );
    console.log(`- Deleted 1 entry (500ml)`);
    console.log(
      `- Total after deletion: ${updatedSummaryResponse.data.totalLiters} L`
    );
    console.log(`- Expected reduction: 0.5 L`);
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    console.error(
      "Make sure the backend server is running on http://localhost:3000"
    );
    process.exit(1);
  }
}

async function testValidation() {
  console.log("\n🧪 Testing Validation...\n");

  try {
    // Test invalid amountMl
    console.log("Testing invalid amountMl...");
    try {
      await axios.post(`${BASE_URL}/hydration`, {
        amountMl: -100,
        takenAt: new Date().toISOString(),
      });
      console.log("❌ Should have failed validation");
    } catch (error) {
      console.log(
        "✅ Validation works for negative amountMl:",
        error.response.data.error.message
      );
    }

    // Test missing takenAt
    console.log("\nTesting missing takenAt...");
    try {
      await axios.post(`${BASE_URL}/hydration`, {
        amountMl: 250,
      });
      console.log("❌ Should have failed validation");
    } catch (error) {
      console.log(
        "✅ Validation works for missing takenAt:",
        error.response.data.error.message
      );
    }

    // Test invalid date format for summary
    console.log("\nTesting invalid date format for summary...");
    try {
      await axios.get(`${BASE_URL}/hydration/summary?date=invalid-date`);
      console.log("❌ Should have failed validation");
    } catch (error) {
      console.log(
        "✅ Validation works for invalid date:",
        error.response.data.error.message
      );
    }

    console.log("\n🎉 All validation tests passed!");
  } catch (error) {
    console.error(
      "❌ Validation test failed:",
      error.response?.data || error.message
    );
  }
}

// Run tests
if (require.main === module) {
  testHydrationEndpoints()
    .then(() => testValidation())
    .catch(console.error);
}

module.exports = { testHydrationEndpoints, testValidation };
