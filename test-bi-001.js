/**
 * Test script for BI-001 Weight Quick Log implementation
 */

const BASE_URL = "http://localhost:3000/api/v1";

// Test weight logging
async function testLogWeight() {
  console.log("Testing weight logging...");

  try {
    const response = await fetch(`${BASE_URL}/biometrics/weight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueKg: 72.5,
        takenAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Weight logged successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to log weight:", error);
    throw error;
  }
}

// Test getting latest weight
async function testGetLatestWeight() {
  console.log("Testing get latest weight...");

  try {
    const response = await fetch(`${BASE_URL}/biometrics/weight/latest`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("ℹ️ No weight entries found");
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Latest weight retrieved:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to get latest weight:", error);
    throw error;
  }
}

// Test getting weight entries
async function testGetWeightEntries() {
  console.log("Testing get weight entries...");

  try {
    const response = await fetch(`${BASE_URL}/biometrics/weight`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Weight entries retrieved:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to get weight entries:", error);
    throw error;
  }
}

// Test validation
async function testValidation() {
  console.log("Testing validation...");

  // Test missing valueKg
  try {
    const response = await fetch(`${BASE_URL}/biometrics/weight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        takenAt: new Date().toISOString(),
      }),
    });

    if (response.status === 400) {
      console.log("✅ Validation works: Missing valueKg rejected");
    } else {
      console.error("❌ Validation failed: Missing valueKg should be rejected");
    }
  } catch (error) {
    console.error("❌ Validation test failed:", error);
  }

  // Test weight too low
  try {
    const response = await fetch(`${BASE_URL}/biometrics/weight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueKg: 15,
        takenAt: new Date().toISOString(),
      }),
    });

    if (response.status === 400) {
      console.log("✅ Validation works: Weight too low rejected");
    } else {
      console.error("❌ Validation failed: Weight too low should be rejected");
    }
  } catch (error) {
    console.error("❌ Validation test failed:", error);
  }

  // Test weight too high
  try {
    const response = await fetch(`${BASE_URL}/biometrics/weight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueKg: 350,
        takenAt: new Date().toISOString(),
      }),
    });

    if (response.status === 400) {
      console.log("✅ Validation works: Weight too high rejected");
    } else {
      console.error("❌ Validation failed: Weight too high should be rejected");
    }
  } catch (error) {
    console.error("❌ Validation test failed:", error);
  }
}

// Run all tests
async function runTests() {
  console.log("🧪 Running BI-001 Weight Quick Log Tests\n");

  try {
    // Test API endpoints
    await testLogWeight();
    await testGetLatestWeight();
    await testGetWeightEntries();
    await testValidation();

    console.log("\n🎉 All tests completed! Check individual results above.");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error);
  }
}

// Export for Node.js or run in browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { runTests };
} else {
  // Run tests immediately if in browser
  runTests();
}
